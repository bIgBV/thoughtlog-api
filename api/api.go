package api

import (
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"path"

	"github.com/bIgBV/thoughtlog-api/api/app"
	"github.com/bIgBV/thoughtlog-api/controllers"
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

	controller := controllers.NewLoginController(API.User.Store)

	r := chi.NewRouter()
	r.Use(middleware.Recoverer)
	r.Use(middleware.RequestID)
	r.Use(middleware.DefaultCompress)
	r.Use(corsConfig().Handler)

	r.Use(logging.NewStructuredLogger(logger))

	r.Get("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("pong"))
	})

	proxy := NewProxy("http://localhost:3000")
	r.Group(func(r chi.Router) {
		r.Use(app.AuthenticateUser)
		r.Get("/*", proxy.handle)
		r.Mount("/api", API.Router())
	})

	r.Group(func(r chi.Router) {
		r.Get("/login", controller.LoginController)
		r.Post("/login", controller.LoginController)
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

// Prox aliases httputil.ReversePRoxy and adds target information
type Prox struct {
	target *url.URL
	proxy  *httputil.ReverseProxy
}

// NewProxy creates a new proxy for the given target
func NewProxy(target string) *Prox {
	url, _ := url.Parse(target)

	return &Prox{
		target: url,
		proxy:  httputil.NewSingleHostReverseProxy(url),
	}
}

func (p *Prox) handle(w http.ResponseWriter, r *http.Request) {
	p.proxy.ServeHTTP(w, r)
}

// SPAHandler serves the public directory with the SPA
func SPAHandler(publicDir string) http.HandlerFunc {
	handler := http.FileServer(http.Dir(publicDir))

	return func(w http.ResponseWriter, r *http.Request) {
		indexPage := path.Join(publicDir, "index.html")

		requestedAsset := path.Join(publicDir, r.URL.Path)
		if _, err := os.Stat(requestedAsset); err != nil {
			http.ServeFile(w, r, indexPage)
		}

		handler.ServeHTTP(w, r)
	}
}
