package main

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

type Document struct {
	gorm.Model
	Name string `gorm:"unique"`
}

type DocumentCreate struct {
	Code  string `json:"Code" form:"Code"`
	Price uint   `json:"Price" form:"Price"`
}

var db *gorm.DB

func init() {
	var err error
	err = godotenv.Load()
	if err != nil {
		log.Println("failed to load .env file")
	}
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

	db.AutoMigrate(&Document{})
}

func main() {
	app := fiber.New()
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
	}))

	app.Static("/", "./client/dist")

	api := app.Group("/api")
	documentApi := api.Group("documents")

	documentApi.Get("/", func(c *fiber.Ctx) error {
		var documents = []Document{}

		result := db.Find(&documents)
		if result.Error != nil {
			return result.Error
		}

		return c.JSON(fiber.Map{"documents": documents})
	})

	documentApi.Post("/", func(c *fiber.Ctx) error {
		np := new(Document)

		if err := c.BodyParser(np); err != nil {
			return err
		}

		file, err := c.FormFile("file")
		if err != nil {
			return err
		}

		storagePath := "./file-storage"
		err = os.MkdirAll(storagePath, os.ModePerm)
		if err != nil {
			return err
		}

		err = c.SaveFile(file, fmt.Sprintf("./file-storage/%s", file.Filename))
		if err != nil {
			return err
		}

		p := Document{Name: np.Name}

		result := db.Create(&p)
		if result.Error != nil {
			return result.Error
		}

		return c.JSON(p)
	})

	documentApi.Delete("/:id", func(c *fiber.Ctx) error {
		id := c.Params("id")

		result := db.Delete(&Document{}, id)
		if result.Error != nil {
			return result.Error
		}

		return c.SendStatus(fiber.StatusNoContent)
	})

	log.Fatal(app.Listen(":3000"))
}
