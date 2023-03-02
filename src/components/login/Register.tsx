import "./styles.css";
import { Container, Row, Form, Button } from "react-bootstrap";
import { FormEvent, useState, ChangeEvent } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { successfullyLoggedInAction } from "../../redux/actions";
import { useAppDispatch } from "../../redux/store";

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
    console.log("trying to register");
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
        dispatch(successfullyLoggedInAction());
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
      <Row className="justify-content-center">
        <div className="formContainer bg-success">
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>First name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type your first name here"
                required
                value={userInfo.firstName}
                onChange={(e) =>
                  onChangeHandler(
                    e as ChangeEvent<HTMLInputElement>,
                    "firstName"
                  )
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Last name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type your last name here"
                required
                value={userInfo.lastName}
                onChange={(e) =>
                  onChangeHandler(
                    e as ChangeEvent<HTMLInputElement>,
                    "lastName"
                  )
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={userInfo.email}
                onChange={(e) =>
                  onChangeHandler(e as ChangeEvent<HTMLInputElement>, "email")
                }
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={userInfo.password}
                onChange={(e) =>
                  onChangeHandler(
                    e as ChangeEvent<HTMLInputElement>,
                    "password"
                  )
                }
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              onClick={() => {
                registerFunction(userInfo);
                setRegisteredSuccessfully(true);
              }}
            >
              Register
            </Button>
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
