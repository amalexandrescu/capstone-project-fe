import "./style.css";
import * as Icon from "react-bootstrap-icons";
import { useState } from "react";

interface IRatingComponentProps {
  userRating: number;
}

const Rating = ({ userRating }: IRatingComponentProps) => {
  const newArray = Array.from({ length: 10 }, (value, index) => index);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  return (
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
      <div>the rating is: `${rating}` </div>
    </div>
  );
};

export default Rating;
