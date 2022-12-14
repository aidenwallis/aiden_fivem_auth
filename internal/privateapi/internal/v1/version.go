package v1

import (
	"github.com/aidenwallis/fivem-external-sessions/internal/backend"
	"github.com/go-chi/chi/v5"
	"go.uber.org/zap"
)

// Version represents the v1 API
type Version struct {
	b   backend.Backend
	log *zap.Logger
}

// NewVersion creates a new instance of the v1 APi
func NewVersion(b backend.Backend, log *zap.Logger) func(chi.Router) {
	v := &Version{
		b:   b,
		log: log,
	}

	return func(r chi.Router) {
		r.Post("/sessions", v.CreateSession)
		r.Post("/drop-session", v.DropSession)
		r.Post("/clear-sessions", v.ClearSessions)
	}
}
