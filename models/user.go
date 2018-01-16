package models

import (
	"strings"
	"time"

	validation "github.com/go-ozzo/ozzo-validation"
	"github.com/go-pg/pg/orm"
)

// Token represents a user token
type Token struct {
	ID    int    `json:"id"`
	Token string `json:"token"`
}

// User representes an authenticated application user
type User struct {
	ID        int       `json:"id"`
	CreatedAt time.Time `json:"created_at,omitempty"`
	UpdatedAt time.Time `json:"updated_at,omitempty"`

	Email       string `json:"email"`
	Password    string `json:"password,omitempty"`
	Name        string `json:"name"`
	UserTokenID int
	UserToken   *Token `json:"token" sql:",user_token"`
}

// BeforeInsert hook executed before database insert operations
func (u *User) BeforeInsert(db orm.DB) error {
	now := time.Now()
	if u.CreatedAt.IsZero() {
		u.CreatedAt = now
		u.UpdatedAt = now
	}
	return u.Validate()
}

// BeforeUpdate updates the updated at field
func (u *User) BeforeUpdate(db orm.DB) error {
	u.UpdatedAt = time.Now()
	return u.Validate()
}

// Validate validates a User struct and returns validation errors
func (u *User) Validate() error {
	u.Email = strings.TrimSpace(u.Email)
	u.Email = strings.ToLower(u.Email)
	u.Name = strings.TrimSpace(u.Name)

	return validation.ValidateStruct(u, validation.Field(&u.Name, validation.Required))
}
