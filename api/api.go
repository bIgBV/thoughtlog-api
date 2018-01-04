package api

import (
	"net/http"

	"github.com/bIgBV/thoughtlog-api/api/app"
	"github.com/bIgBV/thoughtlog-api/database"
	"github.com/bIgBV/thoughtlog-api/logging"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
)

// New configures the application resources
func New() (*chi.Mux, error) {
	logger := logging.NewLogger()

	db, err := database.DBConn()
	if err != nil {
		logger.WithField("module", "database").Error(err)
		return nil, err
	}

	loginAPI, err := app.NewAPI(db)

	r := chi.NewRouter()
	r.Use(middleware.Recoverer)
	r.Use(middleware.RequestID)
	r.Use(middleware.DefaultCompress)

	r.Use(logging.NewStructuredLogger(logger))

	r.Mount("/auth", loginAPI.Router())

	r.Get("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("pong"))
	})

	return r, nil
}
