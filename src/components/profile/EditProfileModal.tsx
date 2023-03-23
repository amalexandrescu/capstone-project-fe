import { Modal, Button, Form } from "react-bootstrap";
import { useState, ChangeEvent, FormEvent } from "react";
import {
  editProfileInfoAction,
  editProfilePhotoAction,
} from "../../redux/actions";
import { MyProfileInterface } from "../../redux/reducers/userReducer";
import { useAppDispatch, useAppSelector } from "../../redux/store";

type IEditForm = Pick<MyProfileInterface, "firstName" | "lastName" | "email">;

interface IEditProfileModal {
  show: any;
  close: any;
}

const EditProfileModal = ({ show, close }: IEditProfileModal) => {
  const myProfile = useAppSelector((state) => state.user.myProfile);
  const [userInfo, setUserInfo] = useState<IEditForm>(myProfile);

  const dispatch = useAppDispatch();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement>,
    fieldToSet: keyof IEditForm
  ) => {
    setUserInfo((userInfo) => ({ ...userInfo, [fieldToSet]: e.target.value }));
  };

  const editProfilePhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    if (event.target.files !== null) {
      formData.append("avatar", event.target.files[0]);
    }
    const beUrl = process.env.REACT_APP_BE_URL;
    const optionsPost: RequestInit = {
      method: "POST",
      body: formData,
      credentials: "include",
    };

    try {
      const response = await fetch(`${beUrl}/users/me/avatar`, optionsPost);

      const data = await response.json();
      dispatch(editProfilePhotoAction(data.avatar));
    } catch (error) {
      console.log("Error trying to edit profile image");
      console.log(error);
    }
  };

  const editProfileInfo = async () => {
    const beUrl = process.env.REACT_APP_BE_URL;
    const { firstName, lastName, email } = userInfo;
    const optionsPut: RequestInit = {
      method: "PUT",
      body: JSON.stringify({ firstName, lastName, email }),
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    };

    try {
      const response = await fetch(`${beUrl}/users/me`, optionsPut);
      const data = await response.json();
      dispatch(editProfileInfoAction(data)); // updates entire profile
    } catch (error) {
      console.log("Error trying to edit profile info");
      console.log(error);
    }
  };

  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Edit profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>First name</Form.Label>
            <Form.Control
              className="editProfileInput"
              type="text"
              placeholder="Type your first name here"
              required
              value={userInfo.firstName}
              onChange={(e) =>
                onChangeHandler(e as ChangeEvent<HTMLInputElement>, "firstName")
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Last name</Form.Label>
            <Form.Control
              className="editProfileInput"
              type="text"
              placeholder="Type your last name here"
              required
              value={userInfo.lastName}
              onChange={(e) =>
                onChangeHandler(e as ChangeEvent<HTMLInputElement>, "lastName")
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              className="editProfileInput"
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
          <Form.Group controlId="formFile">
            <Form.Label>Select your profile picture</Form.Label>
            <Form.Control
              type="file"
              name="avatar"
              onChange={async (e) => {
                await editProfilePhoto(e as ChangeEvent<HTMLInputElement>);
              }}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button
          style={{ width: "200px" }}
          className="ratingModalButton"
          type="submit"
          onClick={async () => {
            await editProfileInfo();
            close();
          }}
        >
          Save Changes
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileModal;
