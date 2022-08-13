package v1

import (
	"github.com/aidenwallis/fivem-external-sessions/internal/backend"
	"github.com/aidenwallis/fivem-external-sessions/internal/middleware/auth"
	"github.com/aidenwallis/fivem-external-sessions/internal/middleware/authguard"
	"github.com/go-chi/chi/v5"
	"go.uber.org/zap"
)

// Version represents the v1 version of the API
type Version struct {
	b   backend.Backend
	log *zap.Logger
}

// NewVersion creates a new v1 API version
func NewVersion(b backend.Backend, log *zap.Logger) func(chi.Router) {
	v := &Version{
		b:   b,
		log: log,
	}

	return func(r chi.Router) {
		r.Use(auth.Middleware(b, log))
		r.Use(authguard.Middleware)

		r.Get("/sessions", v.GetSession)
	}
}
