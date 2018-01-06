package database

import (
	"time"

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

// Get returns posts made by a given user on the given date
func (s *PostStore) Get(createdDate time.Time) (*[]models.Post, error) {
	p := models.Post{}
	var res []models.Post

	err := s.db.Model(&p).
		Where("created_at::date > date ?", createdDate.AddDate(0, 0, -1).Format("2006-01-2")).
		Where("created_at::date <= date ?", createdDate.Format("2006-01-2")).
		Select(&res)

	return &res, err
}
