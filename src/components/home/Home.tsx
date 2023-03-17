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
} from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
import "./style.css";
import { useNavigate } from "react-router";

const Home = () => {
  const myProfileId = useAppSelector((state) => state.user.myProfile._id);
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

  const fetchAllUsersFromDb = async () => {
    try {
      const beUrl = process.env.REACT_APP_BE_URL;
      const options: RequestInit = {
        method: "GET",
        credentials: "include",
      };

      const response = await fetch(`${beUrl}/users`, options);
      const users = await response.json();
      // return users;
      setAllUsers(users);
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

  return (
    <Container fluid className="mainContainer">
      <Row className="justify-content-center">
        <Col className="d-flex justify-content-center">
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
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
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
                      navigate(`/friends/${user._id}`);
                      // if (user._id.toString() === myProfileId.toString()) {
                      //   navigate(`/users/me/profile/${myProfileId}`);
                      // } else {
                      //   navigate(`/friends/${user._id}`);
                      // }
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
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
