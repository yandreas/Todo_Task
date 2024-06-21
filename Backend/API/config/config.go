package config

import (
	"os"
)

//Configuration for database connection
type EnvDBConfig struct {
    host     string
    port     string
    username string
    password string
    database string
    key      string
}

func NewEnvDBConfig() *EnvDBConfig {
    return &EnvDBConfig{
        host:     os.Getenv("DB_HOST"),
        port:     os.Getenv("DB_PORT"),
        username: os.Getenv("DB_USER"),
        password: os.Getenv("DB_PASSWORD"),
        database: os.Getenv("DB_DATABASE"),
        key:      os.Getenv("JWT_SECRET"),
    }
}

func (c *EnvDBConfig) GetHost() string {
    return c.host
}

func (c *EnvDBConfig) GetPort() string {
    return c.port
}

func (c *EnvDBConfig) GetUsername() string {
    return c.username
}

func (c *EnvDBConfig) GetPassword() string {
    return c.password
}

func (c *EnvDBConfig) GetDatabase() string {
    return c.database
}

func (c *EnvDBConfig) GetKey() string {
    return c.key
}