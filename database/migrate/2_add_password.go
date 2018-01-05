package migrate

import (
	"github.com/go-pg/migrations"
	log "github.com/sirupsen/logrus"
)

const addPwd = `
ALTER TABlE users ADD COLUMN password VARCHAR(256);
`

func init() {
	up := []string{
		addPwd,
	}
	down := []string{
		`ALTER TABLE users DROP COLUMN password;`,
	}

	migrations.Register(func(db migrations.DB) error {
		log.Info("Adding password column")
		for _, q := range up {
			_, err := db.Exec(q)
			if err != nil {
				return err
			}
		}
		return nil
	}, func(db migrations.DB) error {
		log.Info("Removing password column")
		for _, q := range down {
			_, err := db.Exec(q)
			if err != nil {
				return err
			}
		}
		return nil
	})
}
