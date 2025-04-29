package handler

import (
	"encoding/hex"
	"io"
	"log/slog"
	"net/http"
	"strconv"

	"github.com/chirpstack/chirpstack/api/go/v4/integration"
	"github.com/nerenber26/parking-lot-monitor/website/models"
	"google.golang.org/protobuf/encoding/protojson"
	"google.golang.org/protobuf/proto"
)

func (h *Handler) ChirpStackUpdate(w http.ResponseWriter, r *http.Request) {
	b, err := io.ReadAll(r.Body)
	if err != nil {
		h.log.Error("failed to ready request body", slog.Any("error", err))
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	h.log.Info("Dump", slog.Any("json", r.URL.Query()))

	event := r.URL.Query().Get("event")
	switch event {
	case "up":
		err = h.uplink_event(b)
	case "join":
		err = h.join_event(b)
	default:
		h.log.Error("handler for event is not implemented", slog.String("event", event))
		return
	}

	if err != nil {
		h.log.Error("handled event", slog.String("event", event))
	}
}

func (h *Handler) uplink_event(b []byte) error {
	var up integration.UplinkEvent
	if err := h.unmarshal(b, &up); err != nil {
		return err
	}
	h.log.Info("Uplink message received", slog.String("device", up.GetDeviceInfo().DevEui), slog.String("payload", hex.EncodeToString(up.Data)))
	return nil
}

func (h *Handler) join_event(b []byte) error {
	var join integration.JoinEvent
	if err := h.unmarshal(b, &join); err != nil {
		return err
	}
	h.log.Info("Join message received", slog.String("device", join.GetDeviceInfo().DevEui), slog.String("address", join.DevAddr))
	return nil
}

func (h *Handler) unmarshal(b []byte, v proto.Message) error {
	return protojson.UnmarshalOptions{
		DiscardUnknown: true,
		AllowPartial:   true,
	}.Unmarshal(b, v)
}

// TESTING PURPOSES ONLY //
func (h *Handler) InsertEvent(w http.ResponseWriter, r *http.Request) {
	name := r.PathValue("lot")
	if len(name) <= 0 {
		h.log.Error("invalid lot name provided")
		return
	}

	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		h.log.Error("invalid status provided")
		return
	}

	status, err := strconv.Atoi(r.PathValue("status"))
	if err != nil {
		h.log.Error("invalid status provided")
		return
	} else if status != 0 && status != 1 {
		h.log.Error("invalid status provided2")
		return
	}

	err = models.InsertEvent(h.db, name, id, status)
	if err != nil {
		h.log.Error("Failed to insert event to database", slog.Any("error", err))
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}
