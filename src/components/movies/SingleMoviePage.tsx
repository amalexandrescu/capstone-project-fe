import "./style.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Col, Container, Row, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import * as Icon from "react-bootstrap-icons";

export interface IMovie {
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
  console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&", params);
  const [movieToAddForUser, setMovieToAddForUser] = useState<null | IMovie>(
    null
  );
  const [movie, setMovie] = useState<IMovie | null>(null);
  const [buttonClicked, setButtonClicked] = useState<boolean>(false);
  const [movieAlreadyAdded, setMovieAlreadyAdded] = useState<boolean>(false);
  const [movieAlreadyRated, setMovieAlreadyRated] = useState<boolean>(false);
  const [movieRating, setMovieRating] = useState<number>(-1);
  const [show, setShow] = useState<boolean>(false);
  const [mongoId, setMongoId] = useState<string>("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);

  const fetchAllMoviesFromDb = async () => {
    try {
      const beUrl = process.env.REACT_APP_BE_URL;
      const options: RequestInit = {
        method: "GET",
        credentials: "include",
      };
      const result = await fetch(`${beUrl}/movies`, options);
      const allMovies = await result.json();
      const searchedMovie = allMovies.find(
        (m: any) => m.imdbID === movie?.imdbID
      );
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", searchedMovie);
      if (searchedMovie) {
        const { _id } = searchedMovie;
        console.log("#########################", _id);
        setMongoId(_id);
      }
      console.log("all movies: ", allMovies);
    } catch (error) {
      console.log("error trying to fetch all movies form db");
      console.log(error);
    }
  };

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
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@", userMovies);
      const currentMovie = userMovies.find(
        (movie: any) => movie.watchedMovie.imdbID === params.movieId
        //params.movieId is imdbID of the movie
      );
      console.log("current movie: ", currentMovie);
      //undefined if there is no movie
      if (currentMovie === undefined) {
        setMovieAlreadyAdded(false);
        // setMovieToAddForUser(movie);
        setMovieAlreadyRated(false);
        setMovieRating(-1);
      } else {
        setMovieAlreadyAdded(true);
        if (currentMovie.userRating !== -1) {
          setMovieAlreadyRated(true);
          setMovieRating(currentMovie.userRating);
        } else {
          setMovieAlreadyRated(false);
          setMovieRating(-1);
        }
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
      // return movie;
    } catch (error) {
      console.log("error while trying to fetch movie by imdbID from omdp api");
      console.log(error);
    }
  };

  //mongoId as argument
  const addMovieForUser = async (id: string) => {
    try {
      const beUrl = process.env.REACT_APP_BE_URL;
      const optionsPost: RequestInit = {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ movieId: id }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(`${beUrl}/users/me/movies`, optionsPost);
      console.log(response);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log("error trying to add movie to user");
      console.log(error);
    }
  };

  //imdbID as argument
  const removeMovieFromUser = async (id: string) => {
    try {
      const beUrl = process.env.REACT_APP_BE_URL;
      const optionsPut: RequestInit = {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({ imdbID: id }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(`${beUrl}/users/me/movies`, optionsPut);
    } catch (error) {
      console.log("error trying to remove a movei from this user");
      console.log(error);
    }
  };

  useEffect(() => {
    if (movie) fetchUserMovies(movie.imdbID);
  }, [movie]);

  //fetches the current movie info from omdb api
  useEffect(() => {
    if (params.movieId !== undefined) {
      fetchMovieImdbId(params.movieId);
    }
  }, [params.movieId]);

  useEffect(() => {
    if (movie) fetchAllMoviesFromDb();
  }, [movie]);

  useEffect(() => {}, []);

  console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^", movieAlreadyRated);

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

            <div className="ratingSystemContainer">
              Your rating
              <Button onClick={() => setShowRatingModal(true)}>
                <Icon.Star /> Rate
              </Button>
              <Rating
                userRating={movieRating}
                show={showRatingModal}
                close={() => setShowRatingModal(false)}
                imdbID={movie?.imdbID ? movie.imdbID : ""}
                movieTitle={movie?.title ? movie.title : ""}
                mongoId={mongoId}
                movieAlreadyRated={movieAlreadyRated}
                movieAlreadyAdded={movieAlreadyAdded}
                handleRating={setMovieAlreadyRated}
                handleAlreadyAdded={setMovieAlreadyAdded}
                handleMovieRating={setMovieRating}
              />
              ;
            </div>
            <Button
              type="button"
              className={
                movieAlreadyAdded === true
                  ? "watchedMovieButton bg-success"
                  : "watchedMovieButton"
              }
              onClick={async () => {
                if (movieAlreadyAdded) {
                  handleShow();
                  //
                } else {
                  //add movie to user movie list
                  if (
                    movie?.imdbID !== null &&
                    movie?.imdbID !== undefined &&
                    mongoId !== ""
                  ) {
                    await addMovieForUser(mongoId);
                    setMovieAlreadyAdded(true);
                    setMovieAlreadyRated(false);
                    setMovieRating(-1);
                  }
                }
              }}
            >
              {!movieAlreadyAdded ? "Add to watched movie " : "Watched"}
            </Button>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{movie?.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete this movie from your list?
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  No
                </Button>
                <Button
                  variant="primary"
                  onClick={async () => {
                    if (movie?.imdbID) {
                      await removeMovieFromUser(movie?.imdbID);
                      setMovieAlreadyAdded(false);
                      setMovieAlreadyRated(false);
                      setMovieRating(-1);
                      handleClose();
                    }
                  }}
                >
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
