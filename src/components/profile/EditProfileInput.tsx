import "./style.css";
import { Form, Button } from "react-bootstrap";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { MyProfileInterface } from "../../redux/reducers/userReducer";
import { editProfileInfoAction } from "../../redux/actions";
import { useNavigate } from "react-router";

const EditProfileInput = () => {
  const myProfile = useAppSelector((state) => state.user.myProfile);
  const [userInfo, setUserInfo] = useState<MyProfileInterface>(myProfile);
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
    setUserInfo((userInfo) => ({ ...userInfo, [fieldToSet]: e.target.value }));
  };

  const editProfileInfo = async (userInfo: MyProfileInterface) => {
    const beUrl = process.env.REACT_APP_BE_URL;
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
        // const result = await response.json();
        // console.log("Resulllllt", result);
      } else {
        console.log("Error trying to edit profile info");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>First name</Form.Label>
        <Form.Control
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
          dispatch(editProfileInfoAction(true));
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
  );
};

export default EditProfileInput;
