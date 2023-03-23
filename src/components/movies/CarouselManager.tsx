import { Row, Carousel } from "react-bootstrap";
import SingleMovieCarousel, {
  ISingleMovieCarousel,
} from "./SingleMovieCarousel";

interface ICarousel {
  moviesCounter: number;
  userMovies: ISingleMovieCarousel[];
}

const CarouselManager = ({ moviesCounter, userMovies }: ICarousel) => {
  const template = [];
  if (moviesCounter === 0) {
    template.push(
      <Carousel.Item key={0}>
        <div className="movie-row">
          <Row>
            {userMovies.length !== 0 &&
              userMovies.map((movie) => {
                return (
                  <SingleMovieCarousel
                    key={movie.watchedMovie.imdbID}
                    currentMovieObj={movie}
                  />
                );
              })}
          </Row>
        </div>
      </Carousel.Item>
    );
  } else {
    for (let i = 0; i < moviesCounter; i++) {
      template.push(
        <Carousel.Item key={i}>
          <div className="movie-row">
            <Row>
              {userMovies.length !== 0 &&
                userMovies.slice(i * 6, (i + 1) * 6).map((movie) => {
                  return (
                    <SingleMovieCarousel
                      key={movie.watchedMovie.imdbID}
                      currentMovieObj={movie}
                    />
                  );
                })}
            </Row>
          </div>
        </Carousel.Item>
      );
    }
  }

  return <Carousel indicators={false}>{template}</Carousel>;
};

export default CarouselManager;
