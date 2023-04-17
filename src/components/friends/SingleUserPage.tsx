import { ChangeEvent, useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { ISingleMovieCarousel } from "../movies/SingleMovieCarousel";
import "./style.css";
import * as Icon from "react-bootstrap-icons";
import EditProfileModal from "../profile/EditProfileModal";
import { editProfilePhotoAction } from "../../redux/actions";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showEditProfileModal, setShowEditProfileModal] =
    useState<boolean>(false);
  const params = useParams();
  const friendId = params.friendId;
  const myProfile = useAppSelector((state) => state.user.myProfile);
  const [alreadyFollow, setAlreadyFollow] = useState<boolean>(false);
  const [sortedMovies, setSortedMovies] = useState<ISingleMovieCarousel[]>([]);
  const [clickedButton, setClickedButton] = useState<boolean>(false);
  const myProfileId = useAppSelector((state) => state.user.myProfile._id);
  const handleCloseEditProfile = () => setShowEditProfileModal(false);
  const handleShowEditProfile = () => setShowEditProfileModal(true);
  const [currenUserInfo, setCurrentUserInfo] = useState<null | IUser>(null);
  const [userInfo, setUserInfo] = useState<any>(myProfile);

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
      setIsLoading(false);
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

      // const response = await fetch(`${beUrl}/users/me/movies`, options);
      if (friendId === myProfileId) {
        const response = await fetch(`${beUrl}/users/me/movies`, options);
        const sortedMovies = await response.json();
        setSortedMovies(sortedMovies);
      } else {
        const response = await fetch(
          `${beUrl}/users/movies/${friendId}`,
          options
        );
        const sortedMovies = await response.json();
        setSortedMovies(sortedMovies);
      }
    } catch (error) {
      console.log("error trying to fetch user's sorted movies ");
      console.log(error);
    }
  };

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
      const data = await response.json();
    } catch (error) {
      console.log("error trying to add friend to user");
      console.log(error);
    }
  };

  const checkIfAlreadyFriends = () => {
    if (myProfile && currenUserInfo) {
      const myFriends = myProfile.friends;
      const index = myFriends.findIndex(
        (f: any) => f.friend.toString() === friendId?.toString()
      );
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

  const dispatch = useAppDispatch();

  const editCoverImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    if (event.target.files !== null) {
      formData.append("cover", event.target.files[0]);
    }
    const beUrl = process.env.REACT_APP_BE_URL;
    const optionsPost: RequestInit = {
      method: "POST",
      body: formData,
      credentials: "include",
    };

    try {
      const response = await fetch(`${beUrl}/users/me/cover`, optionsPost);

      const data = await response.json();
      dispatch(editProfilePhotoAction(data.cover));
    } catch (error) {
      console.log("Error trying to edit cover image");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserMoviesOrdered();
  }, []);

  useEffect(() => {
    fetchUserDetails();
  }, [myProfile]);

  // useEffect(() => {
  //   fetchUserDetails();
  //   // console.log(currenUserInfo);
  // }, [currenUserInfo]);

  useEffect(() => {
    if (currenUserInfo) checkIfAlreadyFriends();
  }, [currenUserInfo]);

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInfo((userInfo: any) => ({
      ...userInfo,
      ["cover"]: e.target.value,
    }));
  };

  return (
    <Container fluid className="usualContainer">
      <Container className="contentContainer">
        <Row className="justify-content-center mt-3">
          <Col className="d-flex justify-content-start">
            <div className="goBackButtonContainer">
              <span onClick={() => navigate(-1)}>
                <Icon.ArrowLeft className="goBackIcon" />
              </span>
            </div>
          </Col>
        </Row>
        {isLoading && (
          <Row className="justify-content-center mt-5">
            <Col className="d-flex justify-content-center align-items-center flex-column">
              <Spinner animation="border" />
            </Col>
          </Row>
        )}
        {!isLoading && (
          <>
            <Row className="justify-content-center mt-3">
              <Col className="d-flex justify-content-center">
                <div className="friendInfoContainer mb-3">
                  <div
                    className={
                      myProfileId === currenUserInfo?._id
                        ? "editCoverImageIcon"
                        : "d-none"
                    }
                  >
                    <Icon.PencilFill />
                  </div>
                  <Form.Group
                    controlId="formFile"
                    className={
                      myProfileId === currenUserInfo?._id ? "zzz" : "d-none"
                    }
                  >
                    <Form.Control
                      type="file"
                      name="cover"
                      onChange={async (e) => {
                        await editCoverImage(
                          e as ChangeEvent<HTMLInputElement>
                        );
                      }}
                    />
                  </Form.Group>
                  {currenUserInfo !== null && currenUserInfo.cover !== "" ? (
                    <div className="coverImageContainer">
                      <img
                        className="coverImage"
                        src={currenUserInfo.cover}
                        alt="cover picture"
                      />
                    </div>
                  ) : (
                    <div className="coverImageContainer">
                      <img
                        className="coverImage"
                        src="https://res.cloudinary.com/dkdtopojb/image/upload/v1678974876/capstone-project/l7hpyz50ryi3qye7vau8.jpg"
                        alt="cover picture"
                      />
                    </div>
                  )}
                  <div className="profileImageContainer d-flex">
                    <div className="d-flex">
                      <div className="profileImage ml-2">
                        {currenUserInfo !== null &&
                        currenUserInfo.avatar !== "" ? (
                          <img
                            className="avatarImage"
                            src={currenUserInfo.avatar}
                            alt="cover picture"
                          />
                        ) : (
                          <Icon.PersonFill className="profileIconFriendPage" />
                        )}
                      </div>
                      <div className="profileName">
                        {currenUserInfo?.firstName} {currenUserInfo?.lastName}
                      </div>
                    </div>
                    {myProfileId === currenUserInfo?._id && (
                      <button
                        className="followButton mr-2"
                        onClick={() => {
                          setShowEditProfileModal(true);
                        }}
                      >
                        Edit
                      </button>
                    )}
                    <EditProfileModal
                      show={showEditProfileModal}
                      close={() => setShowEditProfileModal(false)}
                    />
                    {myProfileId !== currenUserInfo?._id && (
                      <button
                        className="followButton mr-2"
                        onClick={async () => {
                          if (currenUserInfo && alreadyFollow === true) {
                            await deleteFriend(currenUserInfo._id.toString());
                            setAlreadyFollow(false);
                          } else if (
                            currenUserInfo &&
                            alreadyFollow === false
                          ) {
                            await addFriendForUser(
                              currenUserInfo._id.toString()
                            );
                            setAlreadyFollow(true);
                          }
                        }}
                      >
                        {alreadyFollow === true ? "Following" : "Follow"}
                      </button>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
            <Row className="justify-content-center mt-2">
              {currenUserInfo !== null && (
                <Col className="d-flex justify-content-center">
                  <div className="topRatedMovies darkBackground">
                    <h5>{currenUserInfo.firstName}'s top 5 rated movies</h5>
                    {sortedMovies.length !== 0 &&
                      sortedMovies.slice(0, 5).map((m, index) => (
                        <div className="fiveMoviesList" key={index}>
                          <span
                            className="cursorPointer watchedMoviesWriteJustOnOneLine"
                            onClick={() => {
                              navigate(`/movies/${m.watchedMovie.imdbID}`);
                            }}
                          >
                            {index + 1}.{m.watchedMovie.title}
                          </span>
                          <span className="d-flex align-items-center justify-content-center">
                            {m.userRating !== -1 ? m.userRating : "NRY"}{" "}
                            <Icon.StarFill className="ml-1" />
                          </span>
                        </div>
                      ))}
                    {sortedMovies.length === 0 && <span>No movies yet</span>}
                  </div>
                </Col>
              )}
            </Row>
            <Row className="justify-content-center mt-3">
              {currenUserInfo !== null && (
                <Col className="d-flex justify-content-center">
                  <div className="topRatedMovies">
                    <h5>
                      {currenUserInfo.firstName}'s recently watched movies
                    </h5>
                    <div className="fiveCardsContainer">
                      {currenUserInfo.movies.length !== 0 &&
                        currenUserInfo.movies
                          .slice(
                            currenUserInfo.movies.length - 5,
                            currenUserInfo.movies.length
                          )
                          .map((m: any, index: number) => {
                            return (
                              <Card
                                key={index}
                                className="mb-3 mr-2"
                                onClick={() => {
                                  navigate(`/movies/${m.watchedMovie.imdbID}`);
                                }}
                              >
                                <Card.Img
                                  variant="top"
                                  src={m.watchedMovie.poster}
                                />
                                <Card.Body>
                                  <Card.Title>
                                    {m.watchedMovie.title}
                                  </Card.Title>
                                </Card.Body>
                              </Card>
                            );
                          })}
                      {currenUserInfo.movies.length === 0 && (
                        <span>No movies yet</span>
                      )}
                    </div>
                  </div>
                </Col>
              )}
            </Row>
            <Row className="justify-content-center mt-3 mb-3">
              {currenUserInfo !== null && (
                <Col className="d-flex justify-content-center">
                  <div className="topRatedMovies darkBackground">
                    <h5>{currenUserInfo.firstName}'s list of movies</h5>
                    <div className="fiveCardsContainer">
                      {currenUserInfo.movies.length === 0 ? (
                        "No movies yet"
                      ) : (
                        <div className="d-flex flex-column">
                          <ol>
                            {currenUserInfo.movies.map((m: any, index) => (
                              <li
                                key={index}
                                className={
                                  clickedButton === true
                                    ? "d-block"
                                    : clickedButton === false && index < 5
                                    ? "d-block"
                                    : "d-none"
                                }
                              >
                                {index < 9 ? (
                                  <span>
                                    &nbsp;{index + 1}.&nbsp;
                                    {m.watchedMovie.title}
                                  </span>
                                ) : (
                                  <span>
                                    {index + 1}.{m.watchedMovie.title}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ol>
                          <div className="mx-auto">
                            <button
                              className="cursor-pointer "
                              onClick={() => setClickedButton(!clickedButton)}
                            >
                              {clickedButton === true
                                ? "Click to see less"
                                : "Click to see more"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              )}
            </Row>
          </>
        )}
      </Container>
    </Container>
  );
};

export default SingleUserPage;
