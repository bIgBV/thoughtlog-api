// Package app ties together all application resources and handlers
package app

import (
	"github.com/go-chi/chi"
	"github.com/go-pg/pg"

	"github.com/bIgBV/thoughtlog-api/database"
)

// API proides application resources and handlers
type API struct {
	User *UserResource
}

// NewAPI configures and returns a new application API
func NewAPI(db *pg.DB) (*API, error) {
	userStore := database.NewUserStore(db)
	user := NewUserResource(userStore)

	api := &API{
		User: user,
	}

	return api, nil
}

// Router provides application routes
func (a *API) Router() *chi.Mux {
	r := chi.NewRouter()

	r.Mount("/", a.User.router())

	return r
}
