import "./style.css";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  ListGroup,
  Carousel,
  Card,
} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { IMovie } from "./SingleMoviePage";
import CarouselManager from "./CarouselManager";
import { ISingleMovieCarousel } from "./SingleMovieCarousel";
import { addNewRecentMovieAction, IRecentlyAdded } from "../../redux/actions";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { useSelector } from "react-redux";
import SingleMovieCard from "./SingleMovieCard";
import { groupBy } from "lodash";
import { UNSAFE_convertRoutesToDataRoutes } from "@remix-run/router";

const Movies = () => {
  const [currentSearchedMovie, setCurrentSearchedMovie] = useState<string>("");
  const [movie, setMovie] = useState<IMovie | null>(null);
  const [createdOk, setCreatedOk] = useState<boolean>(false);
  const [userMovies, setUserMovies] = useState<ISingleMovieCarousel[]>([]);
  const [moviesCounter, setMoviesCounter] = useState<number>(0);
  const [recents, setRecents] = useState<Array<IRecentlyAdded>>([]);

  const [adventureMovies, setAdventureMovies] = useState<
    ISingleMovieCarousel[]
  >([]);

  const [allM, setAllM] = useState<ISingleMovieCarousel[]>([]);

  const [moviesByGenre, setMoviesByGenre] = useState<any>([]);
  const [movieGenres, setMovieGenres] = useState<any>([]);

  const [clikedGenreManager, setClikedGenreManager] = useState<
    Array<{ genre: string; clicked: boolean }>
  >([]);

  const [fetchedMovies, setFetechedMovies] = useState<
    Array<{
      Title: string;
      Poster: string;
      imdbID: string;
      Type: string;
      Year: string;
    }>
  >([]);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const recentlySearchedMovies = useAppSelector(
    (state) => state.user.recentlySearchedMovies
  );

  const addNewMovieToDb = async (movieInfo: IMovie) => {
    try {
      const beUrl = process.env.REACT_APP_BE_URL;
      const optionsPOST: RequestInit = {
        method: "POST",
        body: JSON.stringify(movieInfo),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      };

      const response = await fetch(`${beUrl}/movies`, optionsPOST);
      const data = await response.json();
      console.log("movie added to my db: ", data);
      setCreatedOk(true);
      // navigate(`/movies/${movieInfo.imdbID}`);
    } catch (error) {
      console.log("error trying to add new movie to db");
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
      const movieToAdd: IMovie = {
        actors: Actors,
        title: Title,
        genre: Genre,
        plot: Plot,
        poster: Poster,
        released: Released,
        runtime: Runtime,
        imdbID: imdbID,
        imdbRating: imdbRating,
      };
      await addNewMovieToDb(movieToAdd);
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

  const fetchMovieByQuery = async (query: string) => {
    try {
      const response = await fetch(
        `http://www.omdbapi.com/?s=${query}&type=movie&apikey=${process.env.REACT_APP_OMDB_API_KEY}`
      );
      const movie = await response.json();

      console.log("ul list of movies ", movie);
      if (movie.Search.length < 10) {
        return movie.Search;
      } else {
        return movie.Search.slice(0, 10);
      }
    } catch (error) {
      console.log("error while trying to fetch movie from omdp api");
      console.log(error);
    }
  };

  const testFunction = (allMovies: any) => {
    if (allMovies.length !== 0) {
      setClikedGenreManager([]);
      // let currentGenre = "";
      //Andrei + Alexis

      const result = groupBy(allMovies, (movie) =>
        movie.watchedMovie.genre.split(",")[0].trim()
      );
      console.log("VOILA: ", Object.values(result));
      console.log("VOILA: ", Object.keys(result));
      setMoviesByGenre(Object.values(result));
      setMovieGenres(Object.keys(result));

      const genres = Object.keys(result);
      const filteredArray = genres.filter(
        (g) => g !== "Action" && g !== "Adventure" && g !== "Comedy"
      );

      filteredArray.map((g) =>
        setClikedGenreManager((clickedGenreManager) => [
          ...clickedGenreManager,
          { genre: g, clicked: false },
        ])
      );

      //end Andrei si alexis
    }
  };

  const fetchAllM = async () => {
    try {
      const beUrl = process.env.REACT_APP_BE_URL;
      const options: RequestInit = {
        method: "GET",
        credentials: "include",
      };
      const result = await fetch(`${beUrl}/users/me/movies`, options);
      const allUserMovies = await result.json();
      setAllM(allUserMovies);
    } catch (error) {
      console.log("error trying to get the movies of the user");
      console.log(error);
    }
  };

  const fetchAllUserMovies = async () => {
    try {
      const beUrl = process.env.REACT_APP_BE_URL;
      const options: RequestInit = {
        method: "GET",
        credentials: "include",
      };
      const result = await fetch(`${beUrl}/users/me/movies`, options);
      const allUserMovies = await result.json();

      // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@ - allM", allM);
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@", allUserMovies);
      if (allUserMovies.length > 6) {
        setUserMovies([...allUserMovies, ...allUserMovies]);
        setMoviesCounter(Math.floor(allUserMovies.length / 6) + 1);
      } else {
        setUserMovies(allUserMovies);
      }

      console.log("user movies: ", allUserMovies);
    } catch (error) {
      console.log("error trying to get the movies of the user");
      console.log(error);
    }
  };

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentSearchedMovie(e.target.value);
  };

  useEffect(() => {
    fetchAllUserMovies();
  }, []);

  useEffect(() => {
    if (recentlySearchedMovies.length <= 5) {
      setRecents([...recentlySearchedMovies]);
    } else {
      setRecents([
        ...recentlySearchedMovies.slice(
          recentlySearchedMovies.length - 5,
          recentlySearchedMovies.length
        ),
      ]);
    }
  }, [recentlySearchedMovies]);

  console.log(
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    recentlySearchedMovies
  );

  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", recents);

  useEffect(() => {
    fetchAllM();
  }, []);

  useEffect(() => {
    if (allM.length !== 0) {
      testFunction(allM);
    }
  }, [allM]);

  return (
    <Container fluid className="mainContainer">
      <Container className="contentContainer d-flex flex-column">
        <Row className="justify-content-center mt-3">
          <Col className="d-flex justify-content-start">
            <div className="goBackButtonContainer">
              <span onClick={() => navigate(-1)}>
                <Icon.ArrowLeft className="goBackIcon" />
              </span>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col className="d-flex justify-content-center align-items-center flex-column">
            <div className="pt-3 mr-2 pb-0 testing">
              <InputGroup>
                <InputGroup.Text id="search-icon-container">
                  <Icon.Search />
                </InputGroup.Text>
                <Form.Control
                  className="homeInputSearch"
                  placeholder="Search movies by title"
                  value={currentSearchedMovie}
                  onChange={async (e) => {
                    onChangeHandler(e as ChangeEvent<HTMLInputElement>);
                    if (currentSearchedMovie.length >= 4) {
                      const movies = await fetchMovieByQuery(
                        currentSearchedMovie
                      );
                      console.log(
                        "################################################",
                        fetchedMovies
                      );
                      setFetechedMovies(movies);
                    }
                  }}
                />
              </InputGroup>
              <ListGroup as="ul" className="movieSearchlistGroup">
                {fetchedMovies &&
                  fetchedMovies.map((m) => {
                    return (
                      <ListGroup.Item
                        as="li"
                        key={m.imdbID}
                        className="movieSearchLi d-flex align-items-center"
                        onClick={async () => {
                          await fetchMovieImdbId(m.imdbID);
                          dispatch(
                            addNewRecentMovieAction({
                              imdbId: m.imdbID,
                              poster: m.Poster,
                            })
                          );
                          setCurrentSearchedMovie("");
                          navigate(`/movies/${m.imdbID}`);
                        }}
                      >
                        <span className="moviePosterSearchLi mr-2">
                          {m.Poster !== "N/A" ? (
                            <img src={m.Poster} alt="movie poster" />
                          ) : (
                            <Icon.ImageFill className="moviePosterSearchIcon" />
                          )}
                        </span>
                        <span>{m.Title}</span>
                      </ListGroup.Item>
                    );
                  })}
              </ListGroup>
            </div>
          </Col>
        </Row>
        <div className="position-on-top">
          <Row className="justify-content-center mt-3">
            <Col className="d-flex justify-content-center">
              <div className="recentlySearchedMoviesContainer topRatedMovies">
                <h5>Recently searched movies</h5>
                <div className="fiveRecentCardsContainer">
                  {recents &&
                    recents.map((recent: IRecentlyAdded, index) => {
                      return (
                        <SingleMovieCard
                          key={index}
                          id={recent.imdbId}
                          poster={recent.poster}
                        />
                      );
                    })}
                </div>
              </div>
            </Col>
          </Row>
          {movieGenres.length !== 0 &&
            movieGenres.map((genre: string, index: number) => (
              <Row
                key={index}
                className={
                  genre !== "Action" &&
                  genre !== "Adventure" &&
                  genre !== "Comedy"
                    ? "justify-content-center mt-3 flexOrder"
                    : "justify-content-center mt-3"
                }
              >
                <Col className="d-flex justify-content-center">
                  <div className="recentlySearchedMoviesContainer topRatedMovies">
                    <h5
                      className="cursorPointer"
                      onClick={() => {
                        if (
                          genre !== "Action" &&
                          genre !== "Comedy" &&
                          genre !== "Adventure"
                        ) {
                          const index = clikedGenreManager.findIndex(
                            (entry) => entry.genre === genre
                          );
                          clikedGenreManager[index] = {
                            genre: genre,
                            clicked: !clikedGenreManager[index].clicked,
                          };

                          setClikedGenreManager([...clikedGenreManager]);
                        }
                      }}
                    >
                      {genre}
                    </h5>
                    <div className="fiveRecentCardsContainer">
                      {genre !== "Action" &&
                        genre !== "Comedy" &&
                        genre !== "Adventure" &&
                        moviesByGenre.length !== 0 &&
                        moviesByGenre[index].map((m: any, inedx: number) => {
                          const searched = clikedGenreManager.find(
                            (entry) => entry.genre === genre
                          );

                          if (searched) {
                            return (
                              <div key={index}>
                                <Card
                                  className={
                                    searched.clicked === true
                                      ? "mb-3 mr-2"
                                      : "d-none"
                                  }
                                  onClick={() => {
                                    navigate(
                                      `/movies/${m.watchedMovie.imdbID}`
                                    );
                                  }}
                                >
                                  <Card.Img
                                    variant="top"
                                    src={m.watchedMovie.poster}
                                  />
                                </Card>
                              </div>
                            );
                          }
                        })}
                      {(genre === "Action" ||
                        genre === "Comedy" ||
                        genre === "Adventure") &&
                        moviesByGenre.length !== 0 &&
                        moviesByGenre[index].map((m: any, index: number) => (
                          <div key={index}>
                            <Card
                              className="mb-3 mr-2"
                              onClick={() => {
                                navigate(`/movies/${m.watchedMovie.imdbID}`);
                              }}
                            >
                              <Card.Img
                                variant="top"
                                src={m.watchedMovie.poster}
                              />
                            </Card>
                          </div>
                        ))}
                    </div>
                  </div>
                </Col>
              </Row>
            ))}

          {/* <div className="recentlySearchedMoviesContainer topRatedMovies"></div> */}
          <Row className="justify-content-center mt-3">
            <Col className="d-flex justify-content-center">
              <h5>Your movies</h5>
            </Col>
          </Row>
          <Row className="justify-content-center mt-3">
            <Col className="d-flex justify-content-center">
              {userMovies.length !== 0 ? (
                <CarouselManager
                  moviesCounter={moviesCounter}
                  userMovies={userMovies}
                />
              ) : (
                <></>
              )}
            </Col>
          </Row>
        </div>
      </Container>
    </Container>
  );
};

export default Movies;
