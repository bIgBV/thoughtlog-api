package database

import (
	"github.com/bIgBV/thoughtlog-api/auth"
	"github.com/go-pg/pg"
)

// UserStore implements databse operations for users
type UserStore struct {
	db *pg.DB
}

// NewUserStore returns a UserStore
func NewUserStore(db *pg.DB) *UserStore {
	return &UserStore{
		db: db,
	}
}

// Get returns a user by name. (That's all I need for this application)
func (s *UserStore) Get(name string) (*auth.User, error) {
	u := auth.User{Name: name}
	err := s.db.Select(&u)
	return &u, err
}
