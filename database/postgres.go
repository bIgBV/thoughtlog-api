package database

import (
	"github.com/go-pg/pg"
)

// DBConn returns a postgres connection pool
func DBConn() (*pg.DB, error) {
	opts := pg.Options{
		User:      "postgres",
		Password:  "postgres",
		Addr:      "localhost:5432",
		TLSConfig: nil,
	}
	db := pg.Connect(&opts)
	if err := checkConn(db); err != nil {
		return nil, err
	}
	return db, nil
}

func checkConn(db *pg.DB) error {
	var n int

	if _, err := db.QueryOne(pg.Scan(&n), "SELECT 1"); err != nil {
		return err
	}
	return nil
}
