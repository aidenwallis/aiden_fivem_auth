package authguard

import (
	"net/http"

	"github.com/aidenwallis/fivem-external-sessions/internal/middleware/auth"
	"github.com/aidenwallis/fivem-external-sessions/internal/schema"
	"github.com/aidenwallis/go-write/write"
)

// Middleware returns the authguard middleware, it stops requests from getting past the middleware
// if they do not have valid sessions.
func Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		if !auth.HasSession(req.Context()) {
			_ = write.Unauthorized(w).JSON(schema.InvalidTokenError)
			return
		}

		next.ServeHTTP(w, req)
	})
}
