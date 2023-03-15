import { useEffect, useState } from "react";
import { Container, Row, Col, Button, Modal, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { useAppSelector } from "../../redux/store";
import { ISingleMovieCarousel } from "../movies/SingleMovieCarousel";
import "./style.css";

interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  cover: string;
  email: string;
  role: string;
  movies: object[];
  friends: Array<{ _id: string; friend: string }>;
}

const SingleUserPage = () => {
  const params = useParams();
  const friendId = params.friendId;
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!", friendId);

  const [alreadyFollow, setAlreadyFollow] = useState<boolean>(false);
  const [sortedMovies, setSortedMovies] = useState<
    ISingleMovieCarousel[]
    // Array<{ _id: string; userRating: number; watchedMovie: object }>
  >([]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [currenUserInfo, setCurrentUserInfo] = useState<null | IUser>(null);

  const navigate = useNavigate();
  const fetchUserDetails = async () => {
    try {
      const beUrl = process.env.REACT_APP_BE_URL;
      const options: RequestInit = {
        method: "GET",
        credentials: "include",
      };

      const response = await fetch(`${beUrl}/users/${friendId}`, options);
      const user = await response.json();
      setCurrentUserInfo(user);
    } catch (error) {
      console.log(
        "error trying to fetch user's details from single user page component"
      );
      console.log(error);
    }
  };

  const fetchUserMoviesOrdered = async () => {
    try {
      const beUrl = process.env.REACT_APP_BE_URL;
      const options: RequestInit = {
        method: "GET",
        credentials: "include",
      };

      const response = await fetch(`${beUrl}/users/me/movies`, options);
      const sortedMovies = await response.json();
      setSortedMovies(sortedMovies);

      // return sortedMovies;
    } catch (error) {
      console.log("error trying to fetch user's sorted movies ");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserMoviesOrdered();
  }, []);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  //I am sending the mongoId of a user
  const addFriendForUser = async (id: string) => {
    try {
      const beUrl = process.env.REACT_APP_BE_URL;
      const optionsPost: RequestInit = {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ friendId: id }),
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(`${beUrl}/users/me/friends`, optionsPost);
      console.log(response);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log("error trying to add friend to user");
      console.log(error);
    }
  };

  const myProfile = useAppSelector((state) => state.user.myProfile);

  const checkIfAlreadyFriends = () => {
    if (myProfile && currenUserInfo) {
      const myFriends = myProfile.friends;
      const index = myFriends.findIndex(
        (f: any) => f.friend.toString() === friendId?.toString()
      );
      console.log("~~~~~~~~~~~~~index~~~~~~~~~~~~~~~~~~~~~~~~~~~`", index);
      if (index !== -1) {
        //so the user has this friend
        setAlreadyFollow(true);
      } else {
        setAlreadyFollow(false);
      }
    }
  };

  const deleteFriend = async (id: string) => {
    try {
      const beUrl = process.env.REACT_APP_BE_URL;
      const optionsPut: RequestInit = {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({ friendId: id }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(`${beUrl}/users/me/friends`, optionsPut);
    } catch (error) {
      console.log("error trying to delte friend from user");
      console.log(error);
    }
  };

  useEffect(() => {
    if (currenUserInfo) checkIfAlreadyFriends();
  }, [currenUserInfo]);

  return (
    <Container fluid className="bg-secondary usualContainer">
      <Row className="justify-content-center ">
        <Col className="d-flex justify-content-center bg-warning">
          <div className="friend-info-container">
            {currenUserInfo !== null && currenUserInfo.cover !== "" ? (
              <img
                className="coverImage"
                src={currenUserInfo.cover}
                alt="cover picture"
              />
            ) : (
              <img
                className="coverImage"
                src="https://res.cloudinary.com/dkdtopojb/image/upload/v1678716924/capstone-project/q4gg2jw7uqf3chw7fw0s.jpg
"
                alt="cover picture"
              />
            )}
            <div>profile image</div>
            <Button
              onClick={async () => {
                if (currenUserInfo && alreadyFollow === true) {
                  await deleteFriend(currenUserInfo._id.toString());
                  setAlreadyFollow(false);
                } else if (currenUserInfo && alreadyFollow === false) {
                  await addFriendForUser(currenUserInfo._id.toString());
                  setAlreadyFollow(true);
                }
              }}
            >
              {alreadyFollow === true ? "Following" : "Follow"}
            </Button>
          </div>
        </Col>
      </Row>
      <Row>
        {currenUserInfo !== null && (
          <Col>
            <h5>{currenUserInfo.firstName}'s list of movies</h5>
            {currenUserInfo.movies.length === 0 ? (
              "No movies yet"
            ) : (
              <>
                <ol>
                  {currenUserInfo.movies.slice(0, 5).map((m: any, index) => (
                    <li key={index}>{m.watchedMovie.title}</li>
                  ))}
                </ol>
                <Button onClick={handleShow}>see all</Button>
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {currenUserInfo.movies.map((m: any) => (
                      <div
                        className="singleMovieModal"
                        onClick={() => {
                          navigate(`/movies/${m.watchedMovie.imdbID}`);
                        }}
                      >
                        {m.watchedMovie.title}
                      </div>
                    ))}
                  </Modal.Body>
                  <Modal.Footer></Modal.Footer>
                </Modal>
              </>
            )}
          </Col>
        )}
      </Row>
      <Row>
        {currenUserInfo !== null && (
          <Col>
            <h5>{currenUserInfo.firstName}'s top 5 rated movies</h5>
            {sortedMovies.slice(0, 5).map((m) => (
              <div>{m.watchedMovie.title}</div>
            ))}
          </Col>
        )}
      </Row>
      <Row>
        {currenUserInfo !== null && (
          <>
            <h5>{currenUserInfo.firstName}'s recently watched movies</h5>

            <Row>
              {currenUserInfo.movies
                .slice(
                  currenUserInfo.movies.length - 5,
                  currenUserInfo.movies.length
                )
                .map((m: any) => {
                  return (
                    <Col className="d-flex">
                      <Card
                        onClick={() => {
                          navigate(`/movies/${m.watchedMovie.imdbID}`);
                        }}
                      >
                        <Card.Img variant="top" src={m.watchedMovie.poster} />
                        <Card.Body>
                          <Card.Title>{m.watchedMovie.title}</Card.Title>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
            </Row>
          </>
        )}
      </Row>
    </Container>
  );
};

export default SingleUserPage;
