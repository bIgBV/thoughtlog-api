package app

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/go-chi/render"

	"github.com/bIgBV/thoughtlog-api/auth"
	"github.com/go-chi/chi"
)

// UserStore defines database operations for a User
type UserStore interface {
	Get(name string) (*auth.User, error)
}

// UserResource implements user management handler
type UserResource struct {
	Store UserStore
}

// NewUserResource instantiates a new User resource
func NewUserResource(store UserStore) *UserResource {
	return &UserResource{
		Store: store,
	}
}

func (rs *UserResource) router() *chi.Mux {
	r := chi.NewRouter()
	// need to add this in once I have a way to store sessions
	r.Use(rs.accountCtx)

	r.Post("/login", rs.post)

	return r
}

func (rs *UserResource) accountCtx(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("name")
		if err != nil {
			// Cookie not set yet
			next.ServeHTTP(w, r)
		} else {
			u, err := rs.Store.Get(cookie.Value)
			if err != nil {
				render.Render(w, r, ErrUnauthorized)
				return
			}
			ctx := context.WithValue(r.Context(), "user", u)
			next.ServeHTTP(w, r.WithContext(ctx))
		}
	})
}

type userRequest struct {
	*auth.User
}

func (u *userRequest) Bind(r *http.Request) error {
	return nil
}

type userResponse struct {
	*auth.User
}

func newUserResponse(u *auth.User) *userResponse {
	resp := &userResponse{User: u}
	return resp
}

func (rs *UserResource) post(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var u auth.User
	err := decoder.Decode(&u)
	if err != nil {
		render.Respond(w, r, ErrInvalidRequest(err))
		return
	}

	dbUser, err := rs.Store.Get(u.Name)
	if err != nil {
		render.Respond(w, r, ErrInvalidRequest(err))
		return
	}

	if dbUser.Password != u.Password {
		err = errors.New("Invalid password")
		render.Respond(w, r, ErrInvalidRequest(err))
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:  "user",
		Value: u.Name,
	})

	// Clear password before seiralization
	u.Password = ""

	render.Respond(w, r, newUserResponse(&u))
}
