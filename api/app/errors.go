package app

import (
	"net/http"

	"github.com/go-chi/render"
)

// ErrResponse renderer type encapsulates all API error responses
type ErrResponse struct {
	Err            error `json:"-"`
	HTTPStatusCode int   `json:"status_code"`

	StatusText string `json:"status"`
	AppCode    int64  `json:"code,omitempty"`
	ErrorText  string `json:"error,omitempty"`
}

// Render sets the status code for a given error
func (e *ErrResponse) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, e.HTTPStatusCode)
	return nil
}

// ErrInvalidRequest returns status 422 Unprocessable Entity including error message
func ErrInvalidRequest(err error) render.Renderer {
	return &ErrResponse{
		Err:            err,
		HTTPStatusCode: http.StatusUnprocessableEntity,
		StatusText:     http.StatusText(http.StatusUnprocessableEntity),
		ErrorText:      err.Error(),
	}
}

var (
	// ErrUnauthorized returns 401 unauthorized
	ErrUnauthorized = &ErrResponse{
		HTTPStatusCode: http.StatusUnauthorized,
		StatusText:     http.StatusText(http.StatusUnauthorized),
	}
)
