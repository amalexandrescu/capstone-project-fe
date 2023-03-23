import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

export interface IMovieCard {
  id: string;
  key: number | string;
  poster: string;
  onClick: Function;
}

const SingleMovieCard = ({ id, poster }: IMovieCard) => {
  const navigate = useNavigate();
  return (
    <Card className="mb-3 mr-2">
      <Card.Img
        variant="top"
        src={poster}
        onClick={() => {
          navigate(`/movies/${id}`);
        }}
      />
    </Card>
  );
};

export default SingleMovieCard;
