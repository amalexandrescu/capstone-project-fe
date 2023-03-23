import "./style.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Col, Container, Row, Modal, Spinner } from "react-bootstrap";
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const params = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<IMovie | null>(null);
  const [movieAlreadyAdded, setMovieAlreadyAdded] = useState<boolean>(false);
  const [movieAlreadyRated, setMovieAlreadyRated] = useState<boolean>(false);
  const [movieRating, setMovieRating] = useState<number>(-1);
  const [show, setShow] = useState<boolean>(false);
  const [mongoId, setMongoId] = useState<string>("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [separatedActors, setSeparatedActors] = useState<string[]>([]);
  const [separatedGenre, setSeparatedGenre] = useState<string[]>([]);
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);

  const navigate = useNavigate();

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
      if (searchedMovie) {
        const { _id } = searchedMovie;
        setMongoId(_id);
      }
      // setIsLoading(true);
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
      const currentMovie = userMovies.find(
        (movie: any) => movie.watchedMovie.imdbID === params.movieId
      );

      //undefined if there is no movie
      if (currentMovie === undefined) {
        setMovieAlreadyAdded(false);
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
      // setIsLoading(false);
    } catch (error) {
      console.log("error trying to get the movies of the user");
      console.log(error);
    }
  };

  const fetchMovieImdbId = async (id: string) => {
    try {
      const response: any = await fetch(
        `http://www.omdbapi.com/?i=${id}&type=movie&plot=full&apikey=${process.env.REACT_APP_OMDB_API_KEY}`,
        { credentials: "include" }
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
      setIsLoading(false);
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
      const data = await response.json();
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
    if (movie) {
      fetchUserMovies(movie.imdbID);
    }
  }, [movie]);

  //fetches the current movie info from omdb api
  useEffect(() => {
    if (params.movieId !== undefined) {
      fetchMovieImdbId(params.movieId);
    }
  }, [params.movieId]);

  useEffect(() => {
    if (movie) {
      fetchAllMoviesFromDb();
      setSeparatedActors(movie.actors.split(","));
      setSeparatedGenre(movie.genre.split(","));
    }
  }, [movie]);

  return (
    <Container fluid className="mainContainer">
      <Container className="contentContainer">
        <Row className="justify-content-center mt-3">
          <Col className="d-flex justify-content-start">
            <div className="goBackButtonContainer">
              <span onClick={() => navigate(-1)}>
                <Icon.ArrowLeft className="goBackIcon" />
              </span>
            </div>
          </Col>
        </Row>
        {isLoading && (
          <Row className="justify-content-center mt-5">
            <Col className="d-flex justify-content-center align-items-center flex-column">
              <Spinner animation="border" />
            </Col>
          </Row>
        )}
        {isLoading === false && (
          <>
            <Row className="justify-content-center mb-3">
              <Col className="d-flex justify-content-center">
                <div className="moviePosterContainer">
                  <div className="moviePoster">
                    {movie && movie?.poster !== "N/A" ? (
                      <img src={movie.poster} alt="movie poster" />
                    ) : (
                      <div>no poster</div>
                    )}
                  </div>
                  <div className="movieDetailsContainer ">
                    <div className="titleAndRatingContainer d-flex justify-content-between">
                      <h2 className="">{movie?.title}</h2>
                      <div className="">
                        <button
                          className="rateButton"
                          onClick={() => setShowRatingModal(true)}
                        >
                          {movieAlreadyAdded && movieRating > 0 ? (
                            <div className="d-flex align-items-center justify-content-center">
                              {" "}
                              <Icon.StarFill className="ratedStar" />{" "}
                              <div className="ml-2 ratingButtonContainer">
                                <span className="myRating">{movieRating}</span>
                                /10
                              </div>
                            </div>
                          ) : (
                            <div className="d-flex align-items-center justify-content-center">
                              <Icon.Star className="unratedStar" />{" "}
                              <span className="ml-2 rateMovie">Rate</span>
                            </div>
                          )}
                        </button>
                        <Rating
                          userRating={movieRating}
                          show={showRatingModal}
                          close={() => setShowRatingModal(false)}
                          imdbID={movie?.imdbID ? movie.imdbID : ""}
                          movieTitle={movie?.title ? movie.title : ""}
                          mongoId={mongoId}
                          movieAlreadyRated={movieAlreadyRated}
                          movieAlreadyAdded={movieAlreadyAdded}
                          handleRatingStatus={setMovieAlreadyRated}
                          handleAlreadyAdded={setMovieAlreadyAdded}
                          handleMovieRating={setMovieRating}
                          addMovieForUser={addMovieForUser}
                        />
                      </div>
                    </div>
                    <div className="titleAndRatingContainer">
                      <div className="d-flex flex-column">
                        <h5 className="">Story</h5>
                        <p className="plotText">{movie?.plot}</p>
                      </div>
                      <div className="d-felx flex-column">
                        <h5 className="">Actors</h5>
                        <div className="actorsNames mb-3">
                          {separatedActors.length !== 0 &&
                            separatedActors.map((actor, index: number) => {
                              return (
                                <span className="mr-4" key={index}>
                                  {actor}
                                </span>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                    <div className="titleAndRatingContainer">
                      <button
                        type="button"
                        className={
                          movieAlreadyAdded === true
                            ? "watchedMovieButton"
                            : "addToWatchedMovieButton"
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
                        {!movieAlreadyAdded
                          ? "Add to watched movie "
                          : "Watched"}
                      </button>
                    </div>
                  </div>

                  <Modal
                    className="watchMovieModal"
                    show={show}
                    onHide={handleClose}
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>{movie?.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Are you sure you want to delete this movie from your list?
                    </Modal.Body>
                    <Modal.Footer>
                      <button className="yesNoButton" onClick={handleClose}>
                        No
                      </button>
                      <button
                        className="yesNoButton"
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
                      </button>
                    </Modal.Footer>
                  </Modal>
                </div>
              </Col>
            </Row>
            <Row className="justify-content-center mb-3">
              <Col>
                <div className="moreInfoContainer">
                  <h4 className="d-flex justify-content-center mt-2">
                    More information
                  </h4>
                  <div className="d-flex">
                    <div className="moreInfoLeftSide">
                      <div className="mb-2">
                        <h6 className="mb-0">Genre</h6>
                        <span>
                          {separatedGenre.length !== 0 &&
                            separatedGenre.map((genre, index) => {
                              if (separatedGenre.length - 1 !== index)
                                return (
                                  <span className="mr-2" key={index}>
                                    {genre} |
                                  </span>
                                );
                              else
                                return (
                                  <span className="mr-2" key={index}>
                                    {genre}
                                  </span>
                                );
                            })}
                        </span>
                      </div>
                      <div>
                        <h6 className="mb-0">Release date</h6>
                        <span>{movie?.released}</span>
                      </div>
                    </div>
                    <div className="moreInfoRightSide">
                      <div className="mb-2">
                        <h6 className="mb-0">Duration</h6>
                        <span>{movie?.runtime}</span>
                      </div>
                      <div>
                        <h6 className="mb-0">IMDB Rating </h6>
                        <div className=" d-flex align-items-center">
                          <span>{movie?.imdbRating}</span>
                          <span className="ml-2 d-flex align-items-center">
                            <Icon.Star />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex justify-content-center my-2">
                    Click&nbsp;
                    <Link
                      to={`https://www.imdb.com/title/${params.movieId}`}
                      target="_blank"
                    >
                      <span className="imdbLink">here</span>
                    </Link>
                    &nbsp;for imdb trailer
                  </div>
                </div>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </Container>
  );
};

export default SingleMoviePage;
