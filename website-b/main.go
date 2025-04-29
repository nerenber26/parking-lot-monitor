package main

import (
	"context"
	"os"
	"os/signal"

	"github.com/nerenber26/parking-lot-monitor/website/app"
)

func main() {
	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt)
	defer cancel()

	app.New(ctx, nil).Start()
}
