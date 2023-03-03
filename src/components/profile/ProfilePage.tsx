import { Container, Row, Col, Form, Button } from "react-bootstrap";
import * as Icon from "react-bootstrap-icons";
// import { Input } from "@mantine/core";
import "./style.css";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { profile } from "console";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../redux/store";
import EditProfileInput from "./EditProfileInput";
import { useNavigate } from "react-router";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: string;
  _id: string;
}

const ProfilePage = () => {
  const [profileInfo, setProfileInfo] = useState<null | User>(null);
  const myProfile = useAppSelector((state) => state.user.myProfile);
  const [editButtonClicked, setEditButtonClicked] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {}, []);

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
          </div>
          {!editButtonClicked && (
            <div className="profileInfoContainer">
              <h6 className="mb-0">First name</h6>
              <div>{myProfile.firstName}</div>
              <h6 className="mb-0 mt-1">Last name</h6>
              <div>{myProfile.lastName}</div>
              <h6 className="mb-0 mt-1"> Email address</h6>
              <div>{myProfile.email}</div>
              <Button
                type="button"
                onClick={(e) => {
                  setEditButtonClicked(true);
                  navigate("/me/profile/edit");

                  console.log("after click: ", editButtonClicked);
                }}
                className="mt-3"
              >
                Edit profile
              </Button>
            </div>
          )}
          {/* {editButtonClicked && <EditProfileInput />} */}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
