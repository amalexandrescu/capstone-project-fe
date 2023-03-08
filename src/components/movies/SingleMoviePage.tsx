import "./style.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Col, Container, Row, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import * as Icon from "react-bootstrap-icons";

interface IMovie {
  title: string;
  actors: string;
  genre: string;
  plot: string;
  poster: string;
  released: string;
  runtime: string;
  imdbID: string;
  imdbRating: string;
}

const SingleMoviePage = () => {
  const params = useParams<{ movieId: string }>();
  // console.log("params: ", params.movieId);
  const [movie, setMovie] = useState<IMovie | null>(null);
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const [movieAlreadyAdded, setMovieAlreadyAdded] = useState<boolean>(false);
  const [movieAlreadyRated, setMovieAlreadyRated] = useState<boolean>(false);
  const [movieRating, setMovieRating] = useState<number>(-1);
  const [show, setShow] = useState<boolean>(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //this will be used with the imdbID as argument
  const fetchUserMovies = async (id: string) => {
    try {
      const beUrl = process.env.REACT_APP_BE_URL;
      const options: RequestInit = {
        method: "GET",
        credentials: "include",
      };
      const result = await fetch(`${beUrl}/users/me/movies`, options);
      const userMovies = await result.json();
      const currentMovie = userMovies.find(
        (movie: any) => movie.imdbID === params.movieId
      );
      if (currentMovie) {
        setMovieAlreadyAdded(true);
      } else {
        setMovieAlreadyAdded(false);
      }

      if (currentMovie.userRating !== -1) {
        setMovieAlreadyRated(true);
        setMovieRating(currentMovie.userRating);
      } else {
        setMovieAlreadyRated(false);
      }

      console.log("user movies: ", userMovies);
    } catch (error) {
      console.log("error trying to get the movies of the user");
      console.log(error);
    }
  };

  const fetchMovieImdbId = async (id: string) => {
    try {
      const response: any = await fetch(
        `http://www.omdbapi.com/?i=${id}&type=movie&apikey=${process.env.REACT_APP_OMDB_API_KEY}`
      );
      const {
        Actors,
        Genre,
        Plot,
        Poster,
        Released,
        Runtime,
        Title,
        imdbID,
        imdbRating,
      } = await response.json();
      setMovie({
        actors: Actors,
        title: Title,
        genre: Genre,
        plot: Plot,
        poster: Poster,
        released: Released,
        runtime: Runtime,
        imdbID: imdbID,
        imdbRating: imdbRating,
      });
      return movie;
    } catch (error) {
      console.log("error while trying to fetch movie by imdbID from omdp api");
      console.log(error);
    }
  };

  useEffect(() => {
    if (params.movieId !== undefined) fetchUserMovies(params.movieId);
  }, [params.movieId]);

  useEffect(() => {
    if (params.movieId !== undefined) fetchMovieImdbId(params.movieId);
  }, [params.movieId]);

  return (
    <Container fluid className="bg-info">
      <Row className="justify-content-center mb-3">
        <Col className="d-flex justify-content-center">
          <div className="moviePosterContainer">
            {movie && movie?.poster !== "N/A" ? (
              <img src={movie.poster} alt="movie poster" />
            ) : (
              <div>no poster</div>
            )}

            <Button
              type="button"
              className={
                movieAlreadyAdded === true
                  ? "watchedMovieButton bg-success"
                  : "watchedMovieButton"
              }
              onClick={() => {
                setButtonClicked(!buttonClicked);
                handleShow();
                //get all the movies of the current user
                //check by imdbID if the movie is already there
                //maybe use movieAlready there
                //if there is, the button should be green and "Watched"
                //if the movie is not there, the button should be blue with "add to watched movie"
                //onClick, perform a post
              }}
            >
              {!movieAlreadyAdded ? "Add to watched movie " : "Watched"}
            </Button>
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{movie?.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Rating userRating={movieRating} />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  No
                </Button>
                <Button variant="primary" onClick={() => {}}>
                  Yes
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex flex-column align-items-center">
          <div className="movieInfoContainer mb-2">Title: {movie?.title}</div>
          <div className="movieInfoContainer mb-2">Genre: {movie?.genre}</div>
          <div className="movieInfoContainer mb-2">Actors: {movie?.actors}</div>
          <div className="movieInfoContainer mb-2">
            Release date: {movie?.released}
          </div>
          <div className="movieInfoContainer mb-2">
            Duration: {movie?.runtime}
          </div>
          <div>
            Click
            <Link
              to={`https://www.imdb.com/title/${params.movieId}`}
              target="_blank"
            >
              here
            </Link>
            for imdb trailer
          </div>
          <div className="movieInfoContainer mb-2">Plot: {movie?.plot}</div>
        </Col>
      </Row>
    </Container>
  );
};

export default SingleMoviePage;
