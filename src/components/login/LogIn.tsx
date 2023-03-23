import "./styles.css";
import { Container, Row, Form } from "react-bootstrap";
import { FormEvent, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router";
import {
  successfullyLoggedInAction,
  successfullyLoggedOutAction,
} from "../../redux/actions";
import { useAppDispatch } from "../../redux/store";
import { Link } from "react-router-dom";
import * as Icon from "react-bootstrap-icons";

export interface LogInUserInfoInterface {
  email: string;
  password: string;
}

const LogIn = () => {
  const [show, setShow] = useState(true);
  const [loggedInSuccessfully, setLogInSuccessfully] = useState(false);
  const [logInButtonClicked, setLogInButtonClicked] = useState(false);
  const [userInfo, setUserInfo] = useState<LogInUserInfoInterface>({
    email: "",
    password: "",
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logInFunction = async (userCredentials: LogInUserInfoInterface) => {
    const beUrl = process.env.REACT_APP_BE_URL;

    const options: RequestInit = {
      method: "POST",
      body: JSON.stringify(userCredentials),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    };
    try {
      let response = await fetch(`${beUrl}/users/login`, options);
      if (response.ok) {
        let fetchedData = await response.json();
        dispatch(successfullyLoggedInAction(true));
        setLogInSuccessfully(true);
        dispatch(successfullyLoggedOutAction(false));
        navigate("/");
      } else {
        console.log("error while trying to log in");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement>,
    fieldToSet: keyof LogInUserInfoInterface
  ) => {
    setUserInfo((userInfo) => ({ ...userInfo, [fieldToSet]: e.target.value }));
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };
  return (
    <Container fluid className="loginContainer">
      <Row className="customRow justify-content-center align-items-center">
        <div className="formContainer">
          <div className="d-flex justify-content-center">
            <div className="loginUserIconContainer mb-3">
              <Icon.Person className="logInUserIcon" />
            </div>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <div className="loginInputContainer">
                <Icon.PersonFill className="loginIcons" />
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={userInfo.email}
                  className="loginInput"
                  onChange={(e) =>
                    onChangeHandler(e as ChangeEvent<HTMLInputElement>, "email")
                  }
                />
              </div>
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <div className="loginInputContainer">
                <Icon.LockFill className="loginIcons" />
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={userInfo.password}
                  className="loginInput"
                  onChange={(e) =>
                    onChangeHandler(
                      e as ChangeEvent<HTMLInputElement>,
                      "password"
                    )
                  }
                />
              </div>
            </Form.Group>
            <button
              className="logInButton"
              type="submit"
              onClick={() => {
                logInFunction(userInfo);
                setLogInButtonClicked(true);
              }}
            >
              LOG IN
            </button>
          </Form>
          <div className="pt-3">
            If you don't have an account click <Link to="/register">here </Link>
            to Register
          </div>
          {/* {!loggedInSuccessfully && logInButtonClicked && show && (
            <Alert
              variant="danger"
              onClose={() => setShow(false)}
              dismissible
              className="test"
            >
              Invalid mail or password.
            </Alert>
          )} */}
        </div>
      </Row>
    </Container>
  );
};

export default LogIn;
