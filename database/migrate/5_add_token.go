package migrate

import (
	"github.com/go-pg/migrations"
	log "github.com/sirupsen/logrus"
)

const createTable = `
CREATE TABLE tokens (
	id SERIAL PRIMARY KEY,
	token VARCHAR(256) NOT NULL
);
`

const addTokenFk = `
ALTER TABLE users
	ADD COLUMN user_token_id INTEGER;
ALTER TABLE users
	ADD CONSTRAINT fk_token
	FOREIGN KEY(user_token_id)
	REFERENCES tokens(id);
`

const dropConstraint = `
ALTER TABLE users
	DROP constraint fk_token;
`

const dropTable = `
DROP TABLE tokens;
`

func init() {
	up := []string{
		createTable,
		addTokenFk,
	}
	down := []string{
		dropConstraint,
		dropTable,
	}

	migrations.Register(func(db migrations.DB) error {
		log.Info("Add token table and foreign key")
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
