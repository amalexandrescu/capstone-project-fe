import "./style.css";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { MyProfileInterface } from "../../redux/reducers/userReducer";
import {
  editProfileInfoAction,
  editProfilePhotoAction,
  getMyProfileAction,
} from "../../redux/actions";
import { useNavigate } from "react-router";
import * as Icon from "react-bootstrap-icons";

const EditProfileInput = () => {
  const myProfile = useAppSelector((state) => state.user.myProfile);
  const [userInfo, setUserInfo] = useState<MyProfileInterface>(myProfile);
  const [image, setImage] = useState<null | File>(null);
  const profileInfoEditSuccessfully = useAppSelector(
    (state) => state.user.editProfileInfoSuccessfully
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement>,
    fieldToSet: keyof MyProfileInterface
  ) => {
    if (fieldToSet === "avatar") {
      if (e.target.files !== null) {
        setImage(e.target.files[0]);
        setUserInfo((userInfo) => ({ ...userInfo, [fieldToSet]: image }));
      }
    }
    setUserInfo((userInfo) => ({ ...userInfo, [fieldToSet]: e.target.value }));
  };

  const editProfilePhoto = async () => {
    const formData = new FormData();
    if (image !== null) {
      formData.append("avatar", image);
    }
    const beUrl = process.env.REACT_APP_BE_URL;
    const optionsPost: RequestInit = {
      method: "POST",
      body: formData,
      credentials: "include",
    };

    try {
      const response = await fetch(`${beUrl}/users/me/avatar`, optionsPost);
      console.log("response from avatar", response);

      if (response.ok) {
        editProfilePhotoAction(true);
      } else {
        editProfilePhotoAction(false);
      }
    } catch (error) {
      console.log(error);
    }
    dispatch(getMyProfileAction());
  };

  useEffect(() => {
    if (image !== null) {
      editProfilePhoto();
    }
  }, [image]);

  const editProfileInfo = async (userInfo: MyProfileInterface) => {
    const beUrl = process.env.REACT_APP_BE_URL;
    delete userInfo.avatar;
    const optionsPut: RequestInit = {
      method: "PUT",
      body: JSON.stringify(userInfo),
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    };

    try {
      const response = await fetch(`${beUrl}/users/me`, optionsPut);
      if (response.ok) {
        console.log("edit user info with success");
      } else {
        console.log("Error trying to edit profile info");
      }
    } catch (error) {
      console.log(error);
    }
    dispatch(getMyProfileAction());
  };

  return (
    <Container fluid className="mainPageContainer">
      <Row className="justify-content-center">
        <Col className="bg-success  d-flex align-items-center justify-content-between mt-5">
          <div className="profileImageContainer">
            {myProfile.avatar === "" ? (
              <Icon.PersonFill className="profileIcon" />
            ) : (
              <img src={myProfile.avatar} alt="avatar" />
            )}

            <div>
              <Form.Group controlId="formFile" className="mb-3 test">
                <Form.Control
                  type="file"
                  name="avatar"
                  onChange={(e) =>
                    onChangeHandler(
                      e as ChangeEvent<HTMLInputElement>,
                      "avatar"
                    )
                  }
                />
              </Form.Group>
              {/* <Icon.Image
                className="test"
                onClick={() => {
                  editProfilePhoto();
                }}
              /> */}
            </div>
          </div>
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
            <Button
              variant="primary"
              type="submit"
              onClick={() => {
                editProfileInfo(userInfo);
                editProfilePhoto();
                // dispatch(editProfileInfoAction(true));
                navigate("/me/profile");
              }}
            >
              Save changes
            </Button>
            <Button
              type="button"
              onClick={() => {
                navigate("/me/profile");
              }}
            >
              Cancel
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProfileInput;
