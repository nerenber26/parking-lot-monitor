package app

import (
	"net/http"

	"github.com/nerenber26/parking-lot-monitor/website/app/handler"
)

func (a *App) initHandlerRoutes() {
	h := handler.New(a.log, a.db)

	a.mux.Handle("POST /", http.HandlerFunc(h.ChirpStackUpdate))
	a.mux.Handle("GET /{lot}/{id}/{status}", http.HandlerFunc(h.InsertEvent))
}
