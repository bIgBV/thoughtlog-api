package api

import (
	"net/http"

	"github.com/bIgBV/thoughtlog-api/api/app"
	"github.com/bIgBV/thoughtlog-api/database"
	"github.com/bIgBV/thoughtlog-api/logging"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
)

// New configures the application resources
func New() (*chi.Mux, error) {
	logger := logging.NewLogger()

	db, err := database.DBConn()
	if err != nil {
		logger.WithField("module", "database").Error(err)
		return nil, err
	}

	API, err := app.NewAPI(db)

	r := chi.NewRouter()
	r.Use(middleware.Recoverer)
	r.Use(middleware.RequestID)
	r.Use(middleware.DefaultCompress)
	r.Use(corsConfig().Handler)

	r.Use(logging.NewStructuredLogger(logger))

	r.Mount("/", API.Router())

	r.Get("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("pong"))
	})

	return r, nil
}

func corsConfig() *cors.Cors {
	return cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-TOKEN"},
		AllowCredentials: true,
		MaxAge:           86400,
	})
}
