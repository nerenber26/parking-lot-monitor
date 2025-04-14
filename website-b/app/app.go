package app

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/nerenber26/parking-lot-monitor/website/app/middleware"
)

var (
	DefaultServerHost = "0.0.0.0"
	DefaultServerPort = uint16(3000)

	DefaultLogLevel  = slog.LevelInfo
	DefaultLogTarget = os.Stdout
)

type AppOptions struct {
	ServerHost string
	ServerPort uint16

	LogLevel  slog.Level
	LogTarget *os.File

	DatabaseDriver                 string
	DatabaseName                   string
	DatabaseHost                   string
	DatabasePort                   uint16
	DatabaseUsername               string
	DatabasePassword               string
	DatabaseSSLMode                string
	DatabaseMaxConnectionPool      uint
	DatabaseMaxIdleConnections     uint
	DatabaseConnectionsMaxLifetime string
}

type App struct {
	opts *AppOptions

	ctx context.Context
	log *slog.Logger
	mux *http.ServeMux
	db  *sqlx.DB
}

func New(ctx context.Context, opts *AppOptions) *App {
	if opts == nil {
		opts = &AppOptions{}
	}

	if opts.ServerHost == "" {
		opts.ServerHost = DefaultServerHost
	}

	if opts.ServerPort == 0 {
		opts.ServerPort = DefaultServerPort
	}

	switch opts.LogLevel {
	case slog.LevelDebug, slog.LevelInfo, slog.LevelWarn, slog.LevelError:
	default:
		opts.LogLevel = DefaultLogLevel
	}

	if opts.LogTarget == nil {
		opts.LogTarget = DefaultLogTarget
	}

	// UPDATE
	opts.DatabaseDriver = "pgx"
	opts.DatabaseName = "pas-website"
	opts.DatabaseHost = "postgres"
	opts.DatabasePort = 5432
	opts.DatabaseUsername = "postgres"
	opts.DatabasePassword = "password"
	opts.DatabaseSSLMode = "disable"
	opts.DatabaseMaxConnectionPool = 4
	opts.DatabaseMaxIdleConnections = 4
	opts.DatabaseConnectionsMaxLifetime = "300s"

	return &App{
		opts: opts,

		ctx: ctx,
		log: slog.New(slog.NewTextHandler(opts.LogTarget, &slog.HandlerOptions{Level: opts.LogLevel})),
		mux: http.NewServeMux(),
	}
}

func (a *App) Start() {
	if err := a.initDatabase(); err != nil {
		a.log.Error("failed to initialize database", slog.Any("error", err))
		return
	}

	a.initHandlerRoutes()

	addr := fmt.Sprintf("%s:%d", a.opts.ServerHost, a.opts.ServerPort)
	server := &http.Server{
		Addr:    addr,
		Handler: middleware.Logging(a.log, a.mux),
	}

	done := make(chan struct{})
	go func() {
		err := server.ListenAndServe()
		if err != nil && !errors.Is(err, http.ErrServerClosed) {
			a.log.Error("failed to listen and serve", slog.String("error", err.Error()))
		}
		close(done)
	}()
	a.log.Info("server is ready and listening", slog.String("address", addr))

	select {
	case <-done:
		break
	case <-a.ctx.Done():
		ctx, cancel := context.WithTimeout(context.Background(), time.Second*30)
		defer cancel()

		if err := server.Shutdown(ctx); err != nil {
			a.log.Error("failed to shutdown server", slog.String("error", err.Error()))
		}
	}
}
