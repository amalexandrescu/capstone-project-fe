import "./style.css";
import * as Icon from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";

interface IRatingComponentProps {
  userRating: number;
  show: any;
  close: any;
  movieTitle: string;
  imdbID: string;
  mongoId: string;
  movieAlreadyRated: boolean;
  movieAlreadyAdded: boolean;
  handleRating: any;
  handleAlreadyAdded: any;
  handleMovieRating: any;
}

const Rating = ({
  userRating,
  show,
  close,
  movieTitle,
  imdbID,
  mongoId,
  movieAlreadyRated,
  movieAlreadyAdded,
  handleRating,
  handleAlreadyAdded,
  handleMovieRating,
}: IRatingComponentProps) => {
  const newArray = Array.from({ length: 10 }, (value, index) => index);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    if (!movieAlreadyAdded) {
      setRating(-1);
      setHover(0);
    }
  }, [movieAlreadyAdded]);

  useEffect(() => {
    if (movieAlreadyRated) {
      setRating(userRating);
    }
  }, [userRating]);

  console.log("^^^^^^^^^^alreadyadded^^^^^^^^^^^^^", movieAlreadyAdded);

  //id is the mongoId of the watchedMovie
  const rateMovie = async (id: string, rating: number) => {
    try {
      const beUrl = process.env.REACT_APP_BE_URL;
      const optionsPut: RequestInit = {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({ mongoId: id, newRating: rating }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(
        `${beUrl}/users/me/movies/rating`,
        optionsPut
      );
    } catch (error) {
      console.log("error trying to rate a movie");
      console.log(error);
    }
  };

  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Rate {movieTitle}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="star-rating">
          {newArray.map((star, index) => {
            index += 1;
            return (
              <button
                type="button"
                key={index}
                className={index <= (hover || rating) ? "on" : "off"}
                onClick={() => setRating(index)}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(rating)}
              >
                <span className="star">&#9733;</span>
                {/* &#9733 is the html code for star */}
              </button>
            );
          })}
          <div>the rating is: {rating} </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          disabled={rating <= 0 ? true : false}
          onClick={async () => {
            await rateMovie(mongoId, rating);
            handleRating(true);
            // handleMovieRating(rating);
            // setRating(0);
            close();
            // if (movie?.imdbID) {
            //   await removeMovieFromUser(movie?.imdbID);
            //   setMovieAlreadyAdded(false);
            //   setMovieAlreadyRated(false);
            //   setMovieRating(-1);
            //   handleClose();
            // }
          }}
        >
          Rate
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Rating;
