import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  editReduxStateOnLogoutAction,
  successfullyLoggedInAction,
  successfullyLoggedOutAction,
} from "../../redux/actions";
import { useAppDispatch } from "../../redux/store";
import * as Icon from "react-bootstrap-icons";
import "./style.css";

const LogOut = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const logOut = async () => {
    // console.log("trying to log out");
    const beUrl = process.env.REACT_APP_BE_URL;

    const options: RequestInit = {
      method: "PUT",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };
    try {
      let response = await fetch(`${beUrl}/users/me/logout`, options);

      const updatedUser = {
        myProfile: {
          _id: "",
          firstName: "",
          lastName: "",
          email: "",
          avatar: "",
          cover: "",
        },
        successfullyLoggedIn: false,
        editProfileInfoSuccessfully: false,
        editProfilePhotoSuccessfully: false,
        recentlySearchedMovies: [],
        successfullyLoggedOut: true,
      };

      dispatch(successfullyLoggedOutAction(true));
      dispatch(successfullyLoggedInAction(false));
      dispatch(editReduxStateOnLogoutAction());
      navigate("/login");
    } catch (error) {
      console.log("error while trying to log out");

      console.log(error);
    }
  };
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
            <div className="logOutContainer">
              <h4>Are you sure you want to log out?</h4>
              <button
                className="logOutButton"
                onClick={() => {
                  logOut();
                }}
              >
                LOG OUT
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default LogOut;
