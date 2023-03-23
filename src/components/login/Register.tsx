import "./styles.css";
import { Container, Row, Form } from "react-bootstrap";
import { FormEvent, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import {
  successfullyLoggedInAction,
  successfullyLoggedOutAction,
} from "../../redux/actions";
import { useAppDispatch } from "../../redux/store";
import * as Icon from "react-bootstrap-icons";

interface RegisterUserInfoInterface {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

const Register = () => {
  const [registeredSuccessfully, setRegisteredSuccessfully] = useState(false);
  const [userInfo, setUserInfo] = useState<RegisterUserInfoInterface>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const registerFunction = async (
    userCredentials: RegisterUserInfoInterface
  ) => {
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
      let response = await fetch(`${beUrl}/users/register`, options);
      if (response.ok) {
        let fetchedData = await response.json();
        dispatch(successfullyLoggedInAction(true));
        dispatch(successfullyLoggedOutAction(false));
        setRegisteredSuccessfully(true);
        navigate("/");
      } else {
        console.log("error while trying to register");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement>,
    fieldToSet: keyof RegisterUserInfoInterface
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
            <Form.Group className="mb-3">
              <div className="loginInputContainer">
                <Icon.PersonFill className="loginIcons" />
                <Form.Control
                  type="text"
                  placeholder="Type your first name here"
                  required
                  value={userInfo.firstName}
                  className="loginInput"
                  onChange={(e) =>
                    onChangeHandler(
                      e as ChangeEvent<HTMLInputElement>,
                      "firstName"
                    )
                  }
                />
              </div>
            </Form.Group>
            <Form.Group>
              <div className="loginInputContainer">
                <Icon.PersonFill className="loginIcons" />
                <Form.Control
                  type="text"
                  placeholder="Type your last name here"
                  required
                  value={userInfo.lastName}
                  className="loginInput"
                  onChange={(e) =>
                    onChangeHandler(
                      e as ChangeEvent<HTMLInputElement>,
                      "lastName"
                    )
                  }
                />
              </div>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <div className="loginInputContainer">
                <Icon.PersonFill className="loginIcons" />
                <Form.Control
                  type="email"
                  placeholder="Enter email"
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
                registerFunction(userInfo);
                setRegisteredSuccessfully(true);
              }}
            >
              REGISTER
            </button>
          </Form>
          <div className="pt-3">
            If you already have an account click <Link to="/login">here </Link>
            to Log in
          </div>
        </div>
      </Row>
    </Container>
  );
};

export default Register;
