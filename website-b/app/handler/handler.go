package handler

import (
	"log/slog"

	"github.com/jmoiron/sqlx"
)

type Handler struct {
	log *slog.Logger
	db  *sqlx.DB
}

func New(log *slog.Logger, db *sqlx.DB) *Handler {
	return &Handler{
		log: log,
		db:  db,
	}
}
