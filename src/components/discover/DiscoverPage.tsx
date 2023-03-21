import { FormEvent, useEffect, useState, ChangeEvent } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import SingleMovieCard from "../movies/SingleMovieCard";
import "./style.css";

const DiscoverPage = () => {
  const [selectedFirstName, setSelectedFirstName] = useState<string>("");
  const [selectedLastName, setSelectedLastName] = useState<string>("");
  const [selectedUserRating, setSelectedUserRating] = useState<string>("");
  const [selectedImdbRating, setSelectedImdbRating] = useState<string>("");
  const [friendsWithMovies, setFriendsWithMovies] = useState<any>([]);
  const [friendsNames, setFriendsNames] = useState<any>([]);
  const [selectedFriendId, setSelectedFriendId] = useState<string>("");
  const [selectedMovieGenre, setSelectedMovieGenre] = useState<string>("");
  const [moviesToShow, setMoviesToShow] = useState<any>([]);
  const [clickedButton, setClickedButton] = useState<boolean>(false);

  const fetchFriendsWithMovies = async () => {
    try {
      const beUrl = process.env.REACT_APP_BE_URL;
      const options: RequestInit = {
        method: "GET",
        credentials: "include",
      };

      const response = await fetch(`${beUrl}/users/movies/discover`, options);
      const data = await response.json();
      setFriendsWithMovies(data);
      return data;
      // return users;
    } catch (error) {
      console.log(
        "error trying to fetch my friends with movies for discover page"
      );
      console.log(error);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  // const onChangeHandler = (e: ChangeEvent<HTMLInputElement>, fieldToSet) => {
  //   // setUserInfo((userInfo) => ({ ...userInfo, [fieldToSet]: e.target.value }));
  // };

  const onChangeHandlerImdbRating = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedImdbRating(e.target.value);
  };

  const onChangeHandlerFriendRating = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedUserRating(e.target.value);
  };

  const onChangeHandlerMovieGenre = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedMovieGenre(e.target.value);
  };

  const onChangeHandlerFriendName = (e: ChangeEvent<HTMLInputElement>) => {
    const searchedFriendIndex = friendsNames.find((friend: any) => {
      const fullName = `${friend.firstName} ${friend.lastName}`;
      console.log("full name", fullName);
      if (fullName === e.target.value) {
        return friend;
      }
    });
    console.log("teeeest", searchedFriendIndex);
    if (searchedFriendIndex) {
      setSelectedFirstName(searchedFriendIndex.firstName);
      setSelectedLastName(searchedFriendIndex.lastName);
      setSelectedFriendId(searchedFriendIndex.friendId);
    }
  };

  const discoverMovies = () => {
    const result = friendsWithMovies
      .filter((el: any) => el.friendInfo._id === selectedFriendId)
      .filter((m: any) => {
        return m.movie.userRating === parseInt(selectedUserRating);
      });

    const final = result.filter((el: any) => {
      const genreArray = el.movieData.genre.split(",");
      const lowerCase = genreArray.map((genre: any) =>
        genre.toLowerCase().trim()
      );
      console.log("genre array: ", lowerCase);
      if (lowerCase.includes(selectedMovieGenre)) {
        return el;
      }
    });

    setMoviesToShow(final);
    console.log("hellllo", final);
    console.log("result", result);
  };

  useEffect(() => {
    const updateFriendsWithMovies = async () => {
      const data = await fetchFriendsWithMovies();
      setFriendsWithMovies(data);
    };
    updateFriendsWithMovies();
  }, []);

  useEffect(() => {
    const result = Array.from(
      new Set(friendsWithMovies.map((el: any) => el.friendInfo._id))
    ).map((friendId) => {
      return {
        friendId: friendId,
        firstName: friendsWithMovies.find(
          (el: any) => el.friendInfo._id === friendId
        ).friendInfo.firstName,
        lastName: friendsWithMovies.find(
          (el: any) => el.friendInfo._id === friendId
        ).friendInfo.lastName,
      };
    });

    setFriendsNames(result);

    // console.log("resuuuult", result);
  }, [friendsWithMovies]);

  const navigate = useNavigate();
  return (
    <Container fluid className="mainContainer">
      <Container className="contentContainer d-flex flex-column">
        <Row className="justify-content-center mt-3">
          <Col className="d-flex justify-content-start">
            <div className="goBackButtonContainer">
              <span onClick={() => navigate(-1)}>
                <Icon.ArrowLeft className="goBackIcon" />
              </span>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-center mt-3">
          <Col className="d-flex justify-content-center align-items-center flex-column">
            <div className="filtersContainer">
              <Form onSubmit={handleSubmit}>
                <div className="d-lg-flex">
                  <Form.Group className="mr-lg-4">
                    <Form.Label>Select a friend</Form.Label>
                    <Form.Control
                      as="select"
                      value={`${selectedFirstName} ${selectedLastName}`}
                      onChange={async (e) => {
                        onChangeHandlerFriendName(
                          e as ChangeEvent<HTMLInputElement>
                        );
                      }}
                    >
                      <option>Open this select menu</option>

                      {friendsNames.length !== 0 &&
                        friendsNames.map((entry: any) => {
                          return (
                            <option
                              key={entry.friendId}
                            >{`${entry.firstName} ${entry.lastName}`}</option>
                          );
                        })}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Movie genre</Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedMovieGenre}
                      onChange={async (e) => {
                        onChangeHandlerMovieGenre(
                          e as ChangeEvent<HTMLInputElement>
                        );
                      }}
                    >
                      <option>Open to select movie genre</option>
                      <option>action</option>
                      <option>adventure</option>
                      <option>comedy</option>
                      <option>romance</option>
                      <option>drama</option>
                      <option>thriller</option>
                      <option>animation</option>
                      <option>biography</option>
                      <option>documentary</option>
                      <option>horror</option>
                      <option>family</option>
                      <option>fantasy</option>
                    </Form.Control>
                  </Form.Group>
                </div>
                <Form.Group>
                  <Form.Label>Friend's rating</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedUserRating}
                    onChange={async (e) => {
                      onChangeHandlerFriendRating(
                        e as ChangeEvent<HTMLInputElement>
                      );
                    }}
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                    <option>9</option>
                    <option>10</option>
                  </Form.Control>
                </Form.Group>

                <button
                  className="logInButton"
                  type="button"
                  onClick={() => {
                    setClickedButton(true);
                    discoverMovies();
                  }}
                >
                  SEARCH
                </button>
              </Form>
            </div>
          </Col>
        </Row>
        <Row className="justify-content-center mt-5">
          <Col className="d-flex justify-content-center align-items-center flex-column">
            <div className="recentlySearchedMoviesContainer topRatedMovies">
              {clickedButton === false ? (
                <h5>Please select filters first</h5>
              ) : moviesToShow.length === 0 ? (
                <h5>No movies found. Please try again with other filters.</h5>
              ) : (
                <h5>Results</h5>
              )}
              <div className="fiveRecentCardsContainer">
                {moviesToShow.length !== 0 &&
                  moviesToShow.map((m: any, index: number) => {
                    return (
                      <SingleMovieCard
                        key={index}
                        id={m.movieData.imdbID}
                        poster={m.movieData.poster}
                      />
                    );
                    // <div className="d-flex">
                    //   <div className="mb-3 mr-2">
                    //     <div>{m.movieData.title}</div>
                    //     <div>
                    //       <img src={m.movieData.poster} />
                    //     </div>
                    //   </div>
                    // </div>
                  })}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default DiscoverPage;
