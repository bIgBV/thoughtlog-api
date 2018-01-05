package migrate

import (
	"fmt"

	"github.com/go-pg/migrations"
)

const userTable = `
CREATE TABLE users (
id serial NOT NULL,
created_at timestamp NOT NULL DEFAULT current_timestamp,
updated_at timestamp DEFAULT current_timestamp,
email text NOT NULL UNIQUE,
name text NOT NULL,
PRIMARY KEY (id)
)`

const postTable = `
CREATE TABLE posts (
id serial NOT NULL,
created_at timestamp NOT NULL DEFAULT current_timestamp,
updated_at timestamp DEFAULT current_timestamp,
title text NOT NULL,
body text NOT NULL,
PRIMARY KEY (id)
)`

func init() {
	up := []string{
		userTable,
		postTable,
	}

	down := []string{
		`DROP TABLE posts`,
		`DROP TABLE users`,
	}

	migrations.Register(func(db migrations.DB) error {
		fmt.Println("creating initial tables")
		for _, q := range up {
			_, err := db.Exec(q)
			if err != nil {
				return err
			}
		}
		return nil
	}, func(db migrations.DB) error {
		fmt.Println("dropping initial tables")
		for _, q := range down {
			_, err := db.Exec(q)
			if err != nil {
				return err
			}
		}
		return nil
	})
}
