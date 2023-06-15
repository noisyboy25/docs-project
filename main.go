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

var db *gorm.DB

func setupCloseHandler() {
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	go func() {
		<-c
		os.Exit(0)
	}()
}

func setupDatabase() {
	var err error
	for i := 0; i < 5; i++ {
		var db_conn_str string

		db_url := os.Getenv("DB_URL")
		if db_url != "" {
			db_conn_str = db_url
		} else {
			db_conn_str = fmt.Sprintf("user=postgres password=%s port=5432 dbname=postgres", os.Getenv("POSTGRES_PASSWORD"))
		}

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

	db.AutoMigrate(&Document{}, &File{})
}

func main() {
	setupCloseHandler()

	err := godotenv.Load()
	if err != nil {
		log.Println("failed to load .env file")
	}

	setupDatabase()

	app := fiber.New(fiber.Config{BodyLimit: 50 * 1024 * 1024})
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
	}))

	storagePath := "./file-storage/"

	app.Static("/", "./client/dist")

	api := app.Group("/api")
	filesApi := app.Group("/files")

	filesApi.Get("/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")

		var file File

		result := db.First(&file, id)
		if result.Error != nil {
			return result.Error
		}

		return c.Download(fmt.Sprintf("%s/%s", storagePath, file.Uuid), file.Filename)
	})

	documentApi := api.Group("documents")

	documentApi.Get("/", func(c *fiber.Ctx) error {
		var documents = []Document{}

		result := db.Preload("Files").Find(&documents)
		if result.Error != nil {
			return result.Error
		}

		return c.JSON(fiber.Map{"documents": documents})
	})

	documentApi.Post("/", func(c *fiber.Ctx) error {
		nd := new(Document)

		if err := c.BodyParser(nd); err != nil {
			return err
		}

		d := Document{Name: nd.Name}

		result := db.Create(&d)
		if result.Error != nil {
			return result.Error
		}

		return c.JSON(d)
	})

	documentApi.Post("/:id/files", func(c *fiber.Ctx) error {
		id, err := c.ParamsInt("id")
		if err != nil {
			return err
		}

		d := Document{Model: gorm.Model{ID: uint(id)}}
		result := db.Find(&d)
		if result.Error != nil {
			return result.Error
		}

		err = os.MkdirAll(storagePath, os.ModePerm)
		if err != nil {
			return err
		}

		file, err := c.FormFile("file")
		if err != nil {
			return err
		}

		uuid := uuid.New().String()
		err = c.SaveFile(file, fmt.Sprintf("%s%s", storagePath, uuid))
		if err != nil {
			return err
		}
		f := File{Filename: file.Filename, Uuid: uuid}
		db.Model(&d).Association("Files").Append(&f)

		return c.JSON(d)
	})

	documentApi.Delete("/:id", func(c *fiber.Ctx) error {
		id, err := c.ParamsInt("id")
		if err != nil {
			return err
		}

		result := db.Select("Files").Delete(&Document{Model: gorm.Model{ID: uint(id)}})
		if result.Error != nil {
			return result.Error
		}

		return c.SendStatus(fiber.StatusNoContent)
	})

	log.Fatal(app.Listen(":3000"))
}
