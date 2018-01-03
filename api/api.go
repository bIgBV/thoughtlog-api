package api

import (
	"net/http"

	"github.com/bIgBV/thoughtlog-api/logging"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
)

// New configures the application resources
func New() (*chi.Mux, error) {
	logger := logging.NewLogger()

	r := chi.NewRouter()
	r.Use(middleware.Recoverer)
	r.Use(middleware.RequestID)
	r.Use(middleware.DefaultCompress)

	r.Use(logging.NewStructuredLogger(logger))

	r.Get("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("pong"))
	})

	return r, nil
}
