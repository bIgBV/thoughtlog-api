package app

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"

	"github.com/bIgBV/thoughtlog-api/models"
)

// PostStorer defines the database persistance interface for a Post
type PostStorer interface {
	Create(p *models.Post) error
}

// PostResource implements all Post handlers
type PostResource struct {
	Store PostStorer
}

// NewPostResource instantiates a new Post Resource
func NewPostResource(store PostStorer) *PostResource {
	return &PostResource{
		Store: store,
	}
}

func (rs *PostResource) router() *chi.Mux {
	r := chi.NewRouter()
	r.Post("/", rs.post)
	return r
}

type postRequest struct {
	*models.Post
}

type postResponse struct {
	*models.Post
	StatusCode int32 `json:"status_code"`
}

func newPostResponse(p *models.Post) *postResponse {
	return &postResponse{
		Post:       p,
		StatusCode: http.StatusCreated,
	}
}

func (rs *PostResource) post(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var p models.Post
	err := decoder.Decode(&p)
	if err != nil {
		render.Respond(w, r, ErrInvalidRequest(err))
		return
	}

	err = rs.Store.Create(&p)
	if err != nil {
		render.Respond(w, r, ErrInvalidRequest(err))
		return
	}
	render.Respond(w, r, newPostResponse(&p))
}
