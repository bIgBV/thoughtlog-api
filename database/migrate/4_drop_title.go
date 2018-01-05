package migrate

import (
	"github.com/go-pg/migrations"
	log "github.com/sirupsen/logrus"
)

const dropTitle = `
ALTER TABLE posts
    DROP COLUMN title;
`

const addTitle = `
ALTER TABLE posts
	ADD COLUMN title TEXT NOT NULL;
`

func init() {
	up := []string{
		dropTitle,
	}
	down := []string{
		addTitle,
	}

	migrations.Register(func(db migrations.DB) error {
		log.Info("Adding users foreign key to posts")
		for _, q := range up {
			_, err := db.Exec(q)
			if err != nil {
				return err
			}
		}
		return nil
	}, func(db migrations.DB) error {
		for _, q := range down {
			_, err := db.Exec(q)
			if err != nil {
				return err
			}
		}
		return nil
	})
}
