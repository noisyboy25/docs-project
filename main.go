package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

type Document struct {
	gorm.Model
	Name  string `gorm:"unique"`
	Files []File `gorm:"foreignKey:DocumentID"`
}

type File struct {
	gorm.Model
	DocumentID uint
	Uuid       string `gorm:"unique"`
	Filename   string
}

type LogMessage struct {
	gorm.Model
	Message string
	UserID  uint
}

var db *gorm.DB

// для завершения работы программы
func setupCloseHandler() {
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	go func() {
		<-c
		os.Exit(0)
	}()
}

// запуск БД
func setupDatabase() {
	var err error

	//5 попыток подключения
	for i := 0; i < 5; i++ {
		var db_conn_str string

		//загрузка конфигурации, конфиг в .env
		db_url := os.Getenv("DB_URL")
		if db_url != "" {
			db_conn_str = db_url
		} else {
			db_conn_str = fmt.Sprintf("user=postgres password=%s port=5432 dbname=postgres", os.Getenv("POSTGRES_PASSWORD"))
		}

		//подключение к БД
		db, err = gorm.Open(postgres.Open(db_conn_str), &gorm.Config{})
		if err != nil {
			log.Printf("failed to connect database, reconnecting...")
			time.Sleep(5 * time.Second)
		} else {
			break
		}
	}

	if err != nil {
		panic("failed to connect database")
	}

	//создание таблиц в БД
	db.AutoMigrate(&Document{}, &File{}, &LogMessage{})
}

func main() {
	setupCloseHandler()

	//ошибка при не нахождении .env файла, но не останавливает прог.
	err := godotenv.Load()
	if err != nil {
		log.Println("failed to load .env file")
	}

	setupDatabase()

	app := fiber.New(fiber.Config{BodyLimit: 50 * 1024 * 1024}) //создание приложения
	app.Use(logger.New())                                       //подключение логирования
	app.Use(cors.New(cors.Config{                               //настройка CORS
		AllowOrigins: "*", //сервер отвечает клиентам с любого адреса
	}))

	storagePath := "./file-storage/" //установка пути для хранения файлов

	app.Static("/", "./client/dist") //хранилище статичных файлов

	api := app.Group("api") //создание пути для api
	filesApi := app.Group("files")

	//скачивание файла по id
	filesApi.Get("/:id", func(c *fiber.Ctx) error {
		id, err := c.ParamsInt("id")
		if err != nil {
			return err
		}

		var file File

		//поиск файла в БД
		result := db.First(&file, id)
		if result.Error != nil {
			return result.Error
		}

		m := LogMessage{Message: fmt.Sprintf("Загружен файл (ID:%d)", id), UserID: 0}
		db.Create(&m)

		//скачивание файла
		return c.Download(fmt.Sprintf("%s/%s", storagePath, file.Uuid), file.Filename)
	})

	documentApi := api.Group("documents")

	//получение списка документов
	documentApi.Get("/", func(c *fiber.Ctx) error {
		var documents = []Document{} //создание пустого списка

		result := db.Preload("Files").Find(&documents) //загрузка данных в пуст. список
		if result.Error != nil {
			return result.Error
		}

		// m := LogMessage{Message: "Получен список документов", UserID: 0}
		// db.Create(&m)

		return c.JSON(fiber.Map{"documents": documents}) //форматирование списка и ответ на запрос
	})

	//загрузка документа в БД
	documentApi.Post("/", func(c *fiber.Ctx) error {
		nd := new(Document) //создание пустого объекта

		//обработка форм
		if err := c.BodyParser(nd); err != nil {
			return err
		}

		//загрузка данных формы в объект
		d := Document{Name: nd.Name}

		//загрузка нового документа в БД
		result := db.Create(&d)
		if result.Error != nil {
			return result.Error
		}

		m := LogMessage{Message: fmt.Sprintf("Добавлен документ (ID:%d)", d.ID), UserID: 0}
		db.Create(&m)

		return c.JSON(d)
	})

	//загрузка файла
	documentApi.Post("/:id/files", func(c *fiber.Ctx) error {
		//чтение id и загрузка в переменную id
		id, err := c.ParamsInt("id")
		if err != nil {
			return err
		}

		//поиск документа в БД
		d := Document{Model: gorm.Model{ID: uint(id)}}
		result := db.Find(&d)
		if result.Error != nil {
			return result.Error
		}

		//создание папки, если её нет
		err = os.MkdirAll(storagePath, os.ModePerm)
		if err != nil {
			return err
		}

		//чтение форм
		file, err := c.FormFile("file")
		if err != nil {
			return err
		}

		//сохранение файла
		uuid := uuid.New().String()                                    //создание ранд. назв файла
		err = c.SaveFile(file, fmt.Sprintf("%s%s", storagePath, uuid)) // сохранение файла на диск
		if err != nil {
			return err
		}
		f := File{Filename: file.Filename, Uuid: uuid} //создание объекта для загрузки в БД
		db.Model(&d).Association("Files").Append(&f)   // загрузка в БД

		m := LogMessage{Message: fmt.Sprintf("Добавлен файл к документу (ID:%d)", id), UserID: 0}
		db.Create(&m)

		return c.JSON(d)
	})

	//удаление документа
	documentApi.Delete("/:id", func(c *fiber.Ctx) error {
		//чтение id
		id, err := c.ParamsInt("id")
		if err != nil {
			return err
		}

		//нахождение и удаление документа по id
		result := db.Select("Files").Delete(&Document{Model: gorm.Model{ID: uint(id)}})
		if result.Error != nil {
			return result.Error
		}

		//создание логов
		m := LogMessage{Message: fmt.Sprintf("Удалён документ (ID:%d)", id), UserID: 0}
		db.Create(&m)

		return c.SendStatus(fiber.StatusNoContent)
	})

	documentApi.Delete("/files/:id", func(c *fiber.Ctx) error {
		id, err := c.ParamsInt("id")
		if err != nil {
			return err
		}

		result := db.Delete(&File{Model: gorm.Model{ID: uint(id)}})
		if result.Error != nil {
			return result.Error
		}

		m := LogMessage{Message: fmt.Sprintf("Удалён файл документа (ID:%d)", id), UserID: 0}
		db.Create(&m)

		return c.SendStatus(fiber.StatusNoContent)
	})

	logsApi := api.Group("logs")

	//получение журнала
	logsApi.Get("/", func(c *fiber.Ctx) error {
		//создание пустого списка
		messages := []LogMessage{}

		//заполнение списка
		db.Find(&messages)

		return c.JSON(fiber.Map{"messages": messages})
	})

	log.Fatal(app.Listen(":3000"))
}
