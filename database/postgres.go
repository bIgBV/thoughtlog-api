package database

import (
	"time"

	log "github.com/sirupsen/logrus"

	"github.com/go-pg/pg"
	"github.com/spf13/viper"
)

// DBConn returns a postgres connection pool
func DBConn() (*pg.DB, error) {
	opts, err := pg.ParseURL(viper.GetString("database_url"))
	if err != nil {
		return nil, err
	}
	db := pg.Connect(opts)
	if err := checkConn(db); err != nil {
		return nil, err
	}

	db.OnQueryProcessed(func(event *pg.QueryProcessedEvent) {
		query, err := event.FormattedQuery()
		if err != nil {
			log.Fatal(err)
		}

		log.WithFields(log.Fields{
			"time":  time.Since(event.StartTime),
			"query": query,
		}).Info("Processed query")
	})
	return db, nil
}

func checkConn(db *pg.DB) error {
	var n int

	if _, err := db.QueryOne(pg.Scan(&n), "SELECT 1"); err != nil {
		return err
	}
	return nil
}
