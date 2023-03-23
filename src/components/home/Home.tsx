import { useEffect, useState, ChangeEvent } from "react";
import { getMyProfileAction } from "../../redux/actions";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  Container,
  Row,
  Col,
  InputGroup,
  Form,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import "./style.css";
import { useNavigate } from "react-router";
import { parseISO, format } from "date-fns";
import { sortBy } from "lodash";

const Home = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const myProfileId = useAppSelector((state) => state.user.myProfile._id);
  const [allMyFriends, setAllMyFriends] = useState<Array<any>>([]);
  const [allMyFriendsWatchedMovies, setAllMyFriendsWatchedMovies] = useState<
    Array<any>
  >([]);
  const [allUsers, setAllUsers] = useState<
    Array<{
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      avatar: string;
      movies: object[];
    }>
  >([]);
  const [currentSearch, setCurrentSearch] = useState<string>("");

  const [usersThatMatchSearch, setUsersThatMatchSearch] = useState<
    Array<{
      _id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      avatar: string;
      movies: object[];
    }>
  >([]);

  const navigate = useNavigate();

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentSearch(e.target.value);
  };

  const fetchAllMyFriends = async () => {
    try {
      const beUrl = process.env.REACT_APP_BE_URL;
      const options: RequestInit = {
        method: "GET",
        credentials: "include",
      };
      const result = await fetch(`${beUrl}/users/me/friends`, options);
      const friends = await result.json();
      return friends;
    } catch (error) {
      console.log("error trying to get the movies of the user");
      console.log(error);
    }
  };

  const fetchSingleFriend = async (friendId: string) => {
    try {
      const beUrl = process.env.REACT_APP_BE_URL;
      const options: RequestInit = {
        method: "GET",
        credentials: "include",
      };
      const result = await fetch(
        `${beUrl}/users/me/friends/${friendId}`,
        options
      );
      const friend = await result.json();
      return friend;
    } catch (error) {
      console.log("error trying to get the movies of the user");
      console.log(error);
    }
  };

  const fetchAllUsersFromDb = async () => {
    try {
      const beUrl = process.env.REACT_APP_BE_URL;
      const options: RequestInit = {
        method: "GET",
        credentials: "include",
      };

      const response = await fetch(`${beUrl}/users`, options);
      const users = await response.json();
      setAllUsers(users);
      setIsLoading(true);
    } catch (error) {
      console.log("error during fetch users on home page");
      console.log(error);
    }
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getMyProfileAction());
  }, []);

  useEffect(() => {
    fetchAllUsersFromDb();
  }, []);

  useEffect(() => {
    const filteredUsers = allUsers.filter((user: any) => {
      const fullName = user.firstName + " " + user.lastName;
      if (
        currentSearch !== "" &&
        fullName.toLowerCase().includes(currentSearch)
      ) {
        return user;
      }
    });

    setUsersThatMatchSearch(filteredUsers);
  }, [currentSearch]);

  useEffect(() => {
    const updateFriends = async () => {
      const myFriends: any = await fetchAllMyFriends();
      if (myFriends !== allMyFriends) {
        setAllMyFriends(myFriends);
      }
    };

    updateFriends();
  }, []);

  useEffect(() => {
    const updateFriendsMovies = async () => {
      if (allMyFriends.length !== 0) {
        // promise.ALL()
        const allFriendsFullInfo = await Promise.all(
          allMyFriends.map((friend) =>
            fetchSingleFriend(friend.friend._id.toString())
          )
        );

        const result = allFriendsFullInfo
          .filter((friendWithMovies) => friendWithMovies.movies.length !== 0)
          .map((friendWithMovies) => {
            return friendWithMovies.movies.map((m: any) => ({
              ...m,
              friendInfo: {
                friendId: friendWithMovies._id,
                name:
                  friendWithMovies.firstName + " " + friendWithMovies.lastName,
              },
            }));
          })
          .flat();

        setAllMyFriendsWatchedMovies(
          sortBy(
            result,
            (item) => -new Date(item.watchedMovie.createdAt).getTime()
          )
        );
        setIsLoading(false);
      }
    };

    updateFriendsMovies();
  }, [allMyFriends]);

  return (
    <Container fluid className="mainContainer">
      <Container className="contentContainer d-flex flex-column">
        <Row className="justify-content-center">
          <Col className="d-flex justify-content-center align-items-center flex-column">
            <div className="pt-3 mr-2 pb-0 testing">
              <InputGroup>
                <InputGroup.Text id="search-icon-container">
                  <Icon.Search />
                </InputGroup.Text>
                <Form.Control
                  className="homeInputSearch"
                  placeholder="Search user by name"
                  value={currentSearch}
                  onChange={async (e) => {
                    onChangeHandler(e as ChangeEvent<HTMLInputElement>);
                  }}
                />
              </InputGroup>
              <ListGroup as="ul" className="movieSearchlistGroup">
                {usersThatMatchSearch &&
                  usersThatMatchSearch.length !== 0 &&
                  usersThatMatchSearch.map((user, index) => {
                    return (
                      <ListGroup.Item
                        as="li"
                        key={index}
                        className="movieSearchLi d-flex align-items-center"
                        onClick={() => {
                          setCurrentSearch("");
                          if (user._id.toString() === myProfileId.toString()) {
                            navigate(`/me/profile/${myProfileId}`);
                          } else {
                            navigate(`/friends/${user._id}`);
                          }
                        }}
                      >
                        <span className="moviePosterSearchLi mr-2">
                          {user.avatar !== "" ? (
                            <img src={user.avatar} alt="movie poster" />
                          ) : (
                            <Icon.ImageFill className="moviePosterSearchIcon" />
                          )}
                        </span>
                        <span>
                          {user.firstName} {user.lastName}
                        </span>
                      </ListGroup.Item>
                    );
                  })}
              </ListGroup>
            </div>
          </Col>
        </Row>

        <div className="position-on-top">
          <Row className={isLoading ? "justify-content-center" : "d-none"}>
            <Col className="d-flex justify-content-center align-items-center flex-column">
              <Spinner animation="border" />
            </Col>
          </Row>
          <Row className={isLoading ? "d-none" : "justify-content-center mt-3"}>
            <Col className="d-flex justify-content-center flex-column">
              {allMyFriendsWatchedMovies.length !== 0 &&
                allMyFriendsWatchedMovies.map((i: any, index: number) => (
                  <div
                    className="singlePostNewsFeedContainer mb-3 py-3 px-3"
                    key={index}
                  >
                    <div className="newsFeedNameAndDateContainer d-flex justify-content-between">
                      <h6
                        className="mb-0 cursorPointer"
                        onClick={() => {
                          navigate(`/friends/${i.friendInfo.friendId}`);
                        }}
                      >
                        {i.friendInfo.name}
                      </h6>
                      <div>
                        {format(
                          parseISO(i.watchedMovie.createdAt),
                          "dd MMM yyyy"
                        )}{" "}
                        - {format(parseISO(i.watchedMovie.createdAt), " HH:mm")}
                      </div>
                    </div>
                    <p className="mt-2 mb-2">Added a new movie to his list</p>
                    <div className="d-flex">
                      <div
                        className="newsFeedMovieContainer mr-2 cursorPointer"
                        onClick={() => {
                          navigate(`/movies/${i.watchedMovie.imdbID}`);
                        }}
                      >
                        <img src={i.watchedMovie.poster} alt="movie photo" />
                      </div>
                      <div className="newsFeedMovieInfo ">
                        <span
                          className="newsFeedMovieTitle cursorPointer"
                          onClick={() => {
                            navigate(`/movies/${i.watchedMovie.imdbID}`);
                          }}
                        >
                          {i.watchedMovie.title}
                        </span>
                        <span className="d-flex align-items-center">
                          IMDB Rating: {i.watchedMovie.imdbRating}
                          &nbsp;
                          <Icon.StarFill className="newsFeedStarIcon" />
                        </span>
                        {i.userRating !== -1 ? (
                          <span>
                            User rating: {i.userRating} &nbsp;
                            <Icon.StarFill className="newsFeedYourRatingStarIcon" />
                          </span>
                        ) : (
                          <span>Not rated yet</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </Col>
          </Row>
        </div>
      </Container>
    </Container>
  );
};

export default Home;
