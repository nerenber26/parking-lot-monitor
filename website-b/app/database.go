package app

import (
	"fmt"
	"log/slog"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/jmoiron/sqlx"
)

func (a *App) initDatabase() error {
	db, err := sqlx.Connect(a.opts.DatabaseDriver, fmt.Sprintf(
		"postgresql://%s:%d/%s?sslmode=%s&user=%s&password=%s",
		a.opts.DatabaseHost,
		a.opts.DatabasePort,
		a.opts.DatabaseName,
		a.opts.DatabaseSSLMode,
		a.opts.DatabaseUsername,
		a.opts.DatabasePassword,
	))
	if err != nil {
		return err
	}
	a.db = db

	createTableQuery := `
		CREATE TABLE IF NOT EXISTS events (
			timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
			lotname VARCHAR(255) NOT NULL,
			spotid INT NOT NULL,
			status INT NOT NULL
		);
	`
	_, err = db.Exec(createTableQuery)
	if err != nil {
		return fmt.Errorf("failed to create events table: %w", err)
	}

	a.log.Info("database initialized", slog.String("address", fmt.Sprintf("%s:%d", a.opts.DatabaseHost, a.opts.DatabasePort)))

	return nil
}
