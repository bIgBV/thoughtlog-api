package migrate

import (
	"github.com/go-pg/migrations"
	log "github.com/sirupsen/logrus"
)

const addCreatedBy = `
ALTER TABLE posts
    ADD COLUMN created_by INTEGER;
`

const addUserFk = `
ALTER TABLE posts
	ADD CONSTRAINT fk_users
	FOREIGN KEY (created_by)
	REFERENCES users(id);
`

const removeUserFk = `
ALTER TABLE posts
	DROP CONSTRAINT fk_users;
`

func init() {
	up := []string{
		addCreatedBy,
		addUserFk,
	}
	down := []string{
		removeUserFk,
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
