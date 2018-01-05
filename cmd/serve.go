package cmd

import (
	"github.com/bIgBV/thoughtlog-api/api"
	log "github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var serveCmd = &cobra.Command{
	Use:   "serve",
	Short: "Start http server with configured API",
	Long:  "Starts a http server and serves the configured API",
	Run: func(cmd *cobra.Command, args []string) {
		server, err := api.NewServer()
		if err != nil {
			log.Fatal(err)
		}
		server.Start()
	},
}

func init() {
	RootCmd.AddCommand(serveCmd)

	viper.SetDefault("port", "localhost:3001")
	viper.SetDefault("log_level", "debug")
}
