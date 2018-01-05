package models

import (
	"time"

	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/go-pg/pg/orm"
)

// Post represents a post in memory.
type Post struct {
	ID        int       `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Body      string
	CreatedBy int `json:"created_by" pg:",fk:User"`
}

// BeforeInsert sets the created at and inital updated at
func (p *Post) BeforeInsert(db orm.DB) error {
	now := time.Now()
	if p.CreatedAt.IsZero() {
		p.CreatedAt = now
		p.UpdatedAt = now
	}

	return p.Validate()
}

// BeforeUpdate updates the updated at field
func (p *Post) BeforeUpdate(db orm.DB) error {
	p.UpdatedAt = time.Now()
	return p.Validate()
}

// Validate checks if the post has a title and a body. Prevents a round trip to the db
func (p *Post) Validate() error {
	return validation.ValidateStruct(p,
		validation.Field(&p.Body, validation.Required),
	)
}
