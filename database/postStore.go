package database

import (
	"github.com/bIgBV/thoughtlog-api/models"
	"github.com/go-pg/pg"
)

// PostStore implements persistance operations for a given post
type PostStore struct {
	db *pg.DB
}

// NewPostStore instantiates a new PostStore
func NewPostStore(db *pg.DB) *PostStore {
	return &PostStore{
		db: db,
	}
}

// Create creates a given post
func (s *PostStore) Create(p *models.Post) error {
	err := s.db.RunInTransaction(func(tx *pg.Tx) error {
		err := tx.Insert(p)
		if err != nil {
			return err
		}

		return nil
	})

	return err
}
