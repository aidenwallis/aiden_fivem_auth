package backend

import (
	"context"
	"encoding/json"

	"github.com/aidenwallis/fivem-external-sessions/internal/config"
	"github.com/aidenwallis/fivem-external-sessions/internal/db"
	"github.com/aidenwallis/fivem-external-sessions/internal/db/models"
	"go.uber.org/zap"
)

// Backend represents all functions available from the backend.
type Backend interface {
	CreateSession(ctx context.Context, identifiers []string, metadata json.RawMessage) (*models.Session, string, error)
	ValidateSession(ctx context.Context, token string) (*models.Session, error)
}

// backendImpl implements backend
type backendImpl struct {
	sessionCfg *config.SessionsConfig
	db         db.DB
	log        *zap.Logger
}

func NewBackend(dbImpl db.DB, log *zap.Logger, sessionCfg *config.SessionsConfig) Backend {
	return &backendImpl{
		db:         dbImpl,
		log:        log,
		sessionCfg: sessionCfg,
	}
}
