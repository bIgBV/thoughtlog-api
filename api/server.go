package api

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"strings"

	log "github.com/sirupsen/logrus"

	"github.com/spf13/viper"
)

// Server provides a http.Server
type Server struct {
	*http.Server
}

// NewServer configures a new API server
func NewServer() (*Server, error) {
	log.Info("configuring sever...")
	api, err := New()
	if err != nil {
		return nil, err
	}

	var addr string
	port := viper.GetString("port")

	// allow port ot be set as localhost:3000 in env during developmone to avoid
	// "accept incoming network connection" on restarts
	if strings.Contains(port, ":") {
		addr = port
	} else {
		addr = ":" + port
	}

	srv := http.Server{
		Addr:    addr,
		Handler: api,
	}

	return &Server{&srv}, nil
}

// Start runs ListenAndServe on the http.Server with a graceful shutdown
func (srv *Server) Start() {
	log.Info("Starting server...")
	go func() {
		if err := srv.ListenAndServe(); err != http.ErrServerClosed {
			panic(err)
		}
	}()

	log.WithFields(log.Fields{
		"Addr": srv.Addr,
	}).Info("Listning on")

	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)
	sig := <-quit
	log.WithFields(log.Fields{
		"reason": sig,
	}).Info("Shutting down for")

	if err := srv.Shutdown(context.Background()); err != nil {
		panic(err)
	}
	log.Info("Server gracefully stopped")
}
