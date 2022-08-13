package v1

import (
	"net/http"

	"github.com/aidenwallis/fivem-external-sessions/internal/middleware/auth"
	"github.com/aidenwallis/fivem-external-sessions/internal/schema"
	"github.com/aidenwallis/go-write/write"
	"go.uber.org/zap"
)

func (v *Version) GetSession(w http.ResponseWriter, req *http.Request) {
	if err := write.OK(w).JSON(schema.NewSession(auth.GetSession(req.Context()))); err != nil {
		v.log.Error("failed to write getSession", zap.Error(err))
	}
}
