package privateapi

import (
	"net/http"

	"github.com/aidenwallis/fivem-external-sessions/internal/backend"
	v1 "github.com/aidenwallis/fivem-external-sessions/internal/privateapi/internal/v1"
	"github.com/go-chi/chi/v5"
	"go.uber.org/zap"
)

// NewServer creates a new privateapi server
func NewServer(backendImpl backend.Backend, log *zap.Logger) http.Handler {
	r := chi.NewRouter()

	r.Route("/v1", v1.NewVersion(backendImpl, log))

	return r
}
