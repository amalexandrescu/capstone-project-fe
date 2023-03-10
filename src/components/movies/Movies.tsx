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
} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { IMovie } from "./SingleMoviePage";
import CarouselManager from "./CarouselManager";
import { ISingleMovieCarousel } from "./SingleMovieCarousel";

const Movies = () => {
  const [currentSearchedMovie, setCurrentSearchedMovie] = useState<string>("");
  const [movie, setMovie] = useState<IMovie | null>(null);
  const [createdOk, setCreatedOk] = useState<boolean>(false);
  const [userMovies, setUserMovies] = useState<ISingleMovieCarousel[]>([]);
  const [moviesCounter, setMoviesCounter] = useState<number>(0);
  const [recentlySearchedMovies, setRecentlySearchedMovies] = useState<
    string[]
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

  const fetchAllUserMovies = async () => {
    try {
      const beUrl = process.env.REACT_APP_BE_URL;
      const options: RequestInit = {
        method: "GET",
        credentials: "include",
      };
      const result = await fetch(`${beUrl}/users/me/movies`, options);
      const allUserMovies = await result.json();
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

  console.log(
    "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~",
    recentlySearchedMovies
  );

  return (
    <Container fluid className="bg-info">
      <Row>
        <Col>
          <div className="pt-2 flex-grow-1  mr-2 pb-0">
            <InputGroup>
              <InputGroup.Text id="basic-addon1">
                <Icon.Search />
              </InputGroup.Text>
              <Form.Control
                className="input-search-bg"
                placeholder="Search movies by title"
                value={currentSearchedMovie}
                onChange={async (e) => {
                  onChangeHandler(e as ChangeEvent<HTMLInputElement>);
                  if (currentSearchedMovie.length >= 4) {
                    const movies = await fetchMovieByQuery(
                      currentSearchedMovie
                    );
                    setFetechedMovies(movies);
                  }
                }}
              />
            </InputGroup>
          </div>
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
                      setRecentlySearchedMovies((recentlySearchedMovies) => [
                        ...recentlySearchedMovies,
                        m.imdbID,
                      ]);
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
        </Col>
      </Row>
      <Row>
        <Col>Recently searched movies</Col>
      </Row>
      <Row>
        <div>{recentlySearchedMovies}</div>
        <Col className="d-flex">
          <div className="mr-2">test</div>
          <div className="mr-2">test</div>
          <div className="mr-2">test</div>
          <div className="mr-2">test</div>
          <div>test</div>
        </Col>
      </Row>
      <Row>
        <Col>Your movies</Col>
      </Row>
      <Row>
        <Col>
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
    </Container>
  );
};

export default Movies;
