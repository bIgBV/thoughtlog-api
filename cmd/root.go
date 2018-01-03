package cmd

import (
	"log"
	"os"

	homedir "github.com/mitchellh/go-homedir"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var cfgFile string

// RootCmd represents the base command when called without any subcommands
var RootCmd = &cobra.Command{
	Use:   "thoughtlog-api",
	Short: "Serves the API for Ashima and Bhargav's thoughtlog",
	Long: `
	This application serves the API for Ashima and Bhargav's though-log
	a personal, private slice of their own internet.
	`,
}

// Execute is the entry point for all commands in our application. This is called by main.main()
func Execute() {
	if err := RootCmd.Execute(); err != nil {
		log.Println(err)
		os.Exit(1)
	}
}

func init() {
	cobra.OnInitialize(initConfig)

	// Here we dfine our flags and configuration settings.
	RootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file (default is $HOME/.go-base.yaml)")

	viper.SetDefault("database_url", "postgres://postgres:postgres@localhost:5432/thoughlog")

}

// initConfig reads the config file and the ENV variables if set.
func initConfig() {
	if cfgFile != "" {
		viper.SetConfigFile(cfgFile)
	} else {
		//find the home directory
		home, err := homedir.Dir()
		if err != nil {
			log.Fatal(err)
		}

		// Search for the config in the home dir with name ".go-base"
		viper.AddConfigPath(home)
		viper.SetConfigName(".go-base")
	}

	viper.AutomaticEnv()

	// if a config file is found, read it in
	if err := viper.ReadInConfig(); err == nil {
		log.Println("Using config file:", viper.ConfigFileUsed())
	}
}
