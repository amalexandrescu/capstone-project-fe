import { Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router";
import { IMovie } from "./SingleMoviePage";

export interface ISingleMovieCarousel {
  // currentMovieObj: {
  _id: string;
  userRating: number;
  watchedMovie: {
    _id: string;
    actors: string;
    genre: string;
    imdbID: string;
    imdbRating: string;
    plot: string;
    poster: string;
    released: string;
    runtime: string;
    title: string;
    updatedAt: Date;
    createdAt: Date;
    _v: number;
  };
  // };
}

interface IThisComponent {
  key: string;
  currentMovieObj: ISingleMovieCarousel;
}

const SingleMovieCarousel = ({ currentMovieObj }: IThisComponent) => {
  const navigate = useNavigate();
  return (
    <div className="col-md-2 movieCarouselItem">
      <img
        className="movie-cover"
        src={currentMovieObj.watchedMovie.poster}
        alt={currentMovieObj.watchedMovie.title}
        onClick={() => {
          navigate(`/movies/${currentMovieObj.watchedMovie.imdbID}`);
        }}
      />
      <h6 className="badgeContainer">
        <Badge className="bg-secondary">
          {currentMovieObj.userRating > 0
            ? currentMovieObj.userRating
            : "Not rated yet"}
        </Badge>
      </h6>
    </div>
  );
};

export default SingleMovieCarousel;
