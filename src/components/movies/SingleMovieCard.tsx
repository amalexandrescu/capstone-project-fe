import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

export interface IMovieCard {
  id: string;
  key: number;
}

const SingleMovieCard = ({ id }: IMovieCard) => {
  const navigate = useNavigate();
  return (
    <Card>
      {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
      <Card.Body>
        <Card.Title
          onClick={() => {
            navigate(`/movies/${id}`);
          }}
        >
          {id}
        </Card.Title>
        {/* <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text> */}
        {/* <Button variant="primary">Go somewhere</Button> */}
      </Card.Body>
    </Card>
  );
};

export default SingleMovieCard;
