import "./style.css";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  ListGroup,
} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router";

const Movies = () => {
  const [currentSearchedMovie, setCurrentSearchedMovie] = useState<string>("");
  // const [fetchedMovies, setFetechedMovies] = useState<Array<{ poster: string, title: string, imdbID: string }>>([]);
  const [fetchedMovies, setFetechedMovies] = useState<
    Array<{
      Title: string;
      Poster: string;
      imdbID: string;
      Type: string;
      Year: string;
    }>
  >([]);
  const [finishedQuery, setFinishedQuery] = useState<boolean>(false);

  const navigate = useNavigate();

  const fetchMovieByQuery = async (query: string) => {
    try {
      const response = await fetch(
        `http://www.omdbapi.com/?s=${query}&type=movie&apikey=${process.env.REACT_APP_OMDB_API_KEY}`
      );
      const movie = await response.json();

      console.log("harry potter: ", movie);
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

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentSearchedMovie(e.target.value);
  };

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
              fetchedMovies.map((movie) => {
                return (
                  <ListGroup.Item
                    as="li"
                    key={movie.imdbID}
                    className="movieSearchLi d-flex align-items-center"
                    onClick={() => {
                      setCurrentSearchedMovie("");
                      navigate(`/movies/${movie.imdbID}`);
                    }}
                  >
                    <span className="moviePosterSearchLi mr-2">
                      {movie.Poster !== "N/A" ? (
                        <img src={movie.Poster} alt="movie poster" />
                      ) : (
                        <Icon.ImageFill className="moviePosterSearchIcon" />
                      )}
                    </span>
                    <span>{movie.Title}</span>
                  </ListGroup.Item>
                );
              })}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default Movies;
