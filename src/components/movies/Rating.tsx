import "./style.css";
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
  handleRatingStatus: any; //setState for alreadyRated
  handleAlreadyAdded: any; //setState for alreadyAdded
  handleMovieRating: any; //setState for the rating from -1 to 10
  addMovieForUser: any;
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
  handleRatingStatus,
  handleAlreadyAdded,
  handleMovieRating,
  addMovieForUser,
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
            if (movieAlreadyAdded) {
              await rateMovie(mongoId, rating);
              handleRatingStatus(true);
            } else {
              await addMovieForUser(mongoId);
              await rateMovie(mongoId, rating);
              handleRatingStatus(true);
              handleAlreadyAdded(true);
            }
            close();
          }}
        >
          Rate
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Rating;
