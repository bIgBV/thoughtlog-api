package migrate

import (
	"github.com/bIgBV/thoughtlog-api/database"
	"github.com/go-pg/migrations"
	"github.com/go-pg/pg"
	log "github.com/sirupsen/logrus"
)

// Migrate runs go-pg migratiosn
func Migrate(args []string) {
	db, err := database.DBConn()
	if err != nil {
		log.Fatal(err)
	}

	err = db.RunInTransaction(func(tx *pg.Tx) error {
		oldVersion, newVersion, err := migrations.Run(tx, args...)
		if err != nil {
			return err
		}
		if newVersion != oldVersion {
			log.WithFields(log.Fields{
				"oldVersion": oldVersion,
				"newVersion": newVersion,
			}).Info("migrated versions")
		} else {
			log.WithFields(log.Fields{
				"version": oldVersion,
			}).Info("current version")
		}
		return nil
	})
	if err != nil {
		log.Fatal(err)
	}
}

// Reset reverts all migrations to version 0 and applies all migrations to latest
func Reset() {
	db, err := database.DBConn()
	if err != nil {
		log.Fatal(err)
	}

	version, err := migrations.Version(db)
	if err != nil {
		log.Fatal(err)
	}

	err = db.RunInTransaction(func(tx *pg.Tx) error {
		for version != 0 {
			oldVersion, newVersion, err := migrations.Run(tx, "down")
			if err != nil {
				return err
			}
			log.WithFields(log.Fields{
				"old": oldVersion,
				"new": newVersion,
			}).Info("migration from old to new")
			version = newVersion
		}
		return nil
	})
	if err != nil {
		log.Fatal(err)
	}
}
