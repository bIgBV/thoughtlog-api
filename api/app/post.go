package app

import (
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	log "github.com/sirupsen/logrus"

	"github.com/bIgBV/thoughtlog-api/models"
)

// PostStorer defines the database persistance interface for a Post
type PostStorer interface {
	Create(p *models.Post) error
	Get(createdDate time.Time) (*[]models.Post, error)
	Count(p *models.Post) (int, error)
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
	r.Get("/", rs.get)
	return r
}

type postRequest struct {
	*models.Post
}

type postResponse struct {
	Data       *[]models.Post `json:"data"`
	StatusCode int32          `json:"status_code"`
}

func newPostResponse(p *models.Post) *postResponse {
	return &postResponse{
		Data:       &[]models.Post{*p},
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

	p.CreatedAt = time.Now()
	count, err := rs.Store.Count(&p)
	if err != nil {
		log.WithField("Error", err).Debug("Something went wrong")
		render.Respond(w, r, ErrInternalError(err))
		return
	}

	if count != 0 {
		render.Respond(w, r, ErrInvalidData(errors.New("Post already exists")))
		return
	}

	err = rs.Store.Create(&p)
	if err != nil {
		render.Respond(w, r, ErrInvalidRequest(err))
		return
	}
	render.Respond(w, r, newPostResponse(&p))
}

func (rs *PostResource) get(w http.ResponseWriter, r *http.Request) {
	tsStr := chi.URLParam(r, "timestamp")
	i, err := strconv.ParseInt(tsStr, 10, 64)
	if err != nil {
		render.Respond(w, r, ErrInvalidRequest(err))
		return
	}

	timeStamp := time.Unix(i, 0)

	storedPost, err := rs.Store.Get(timeStamp)
	if err != nil {
		render.Respond(w, r, ErrInvalidRequest(err))
		return
	}

	// initialise an empty slice if no results were returned
	if len(*storedPost) == 0 {
		storedPost = &[]models.Post{}
	}

	render.Respond(w, r, &postResponse{
		Data:       storedPost,
		StatusCode: http.StatusOK,
	})
}
