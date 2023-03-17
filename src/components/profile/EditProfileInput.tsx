const EditProfileInput = () => {
  return <div>hello</div>;
};

export default EditProfileInput;
// import "./style.css";
// import { Form, Button, Container, Row, Col } from "react-bootstrap";
// import { ChangeEvent, FormEvent, useState } from "react";
// import { useAppDispatch, useAppSelector } from "../../redux/store";
// import { MyProfileInterface } from "../../redux/reducers/userReducer";
// import {
//   editProfileInfoAction,
//   editProfilePhotoAction,
// } from "../../redux/actions";
// import { useNavigate } from "react-router";
// import * as Icon from "react-bootstrap-icons";

// type IEditForm = Pick<MyProfileInterface, "firstName" | "lastName" | "email">;

// const EditProfileInput = () => {
//   const myProfile = useAppSelector((state) => state.user.myProfile);
//   const [userInfo, setUserInfo] = useState<IEditForm>(myProfile);

//   const dispatch = useAppDispatch();
//   const navigate = useNavigate();

//   const handleSubmit = (e: FormEvent) => {
//     e.preventDefault();
//   };

//   const onChangeHandler = (
//     e: ChangeEvent<HTMLInputElement>,
//     fieldToSet: keyof IEditForm
//   ) => {
//     setUserInfo((userInfo) => ({ ...userInfo, [fieldToSet]: e.target.value }));
//   };

//   const editProfilePhoto = async (event: ChangeEvent<HTMLInputElement>) => {
//     const formData = new FormData();
//     if (event.target.files !== null) {
//       formData.append("avatar", event.target.files[0]);
//     }
//     const beUrl = process.env.REACT_APP_BE_URL;
//     const optionsPost: RequestInit = {
//       method: "POST",
//       body: formData,
//       credentials: "include",
//     };

//     try {
//       const response = await fetch(`${beUrl}/users/me/avatar`, optionsPost);

//       const data = await response.json();
//       dispatch(editProfilePhotoAction(data.avatar));
//     } catch (error) {
//       console.log("Error trying to edit profile image");
//       console.log(error);
//     }
//   };

//   const editProfileInfo = async () => {
//     const beUrl = process.env.REACT_APP_BE_URL;
//     const { firstName, lastName, email } = userInfo;
//     const optionsPut: RequestInit = {
//       method: "PUT",
//       body: JSON.stringify({ firstName, lastName, email }),
//       headers: {
//         "Content-type": "application/json",
//       },
//       credentials: "include",
//     };

//     try {
//       const response = await fetch(`${beUrl}/users/me`, optionsPut);
//       const data = await response.json();
//       dispatch(editProfileInfoAction(data)); // updates entire profile
//     } catch (error) {
//       console.log("Error trying to edit profile info");
//       console.log(error);
//     }
//   };

//   return (
//     <Container fluid className="mainPageContainer">
//       <Row className="justify-content-center">
//         <Col className="bg-success  d-flex align-items-center justify-content-between mt-5">
//           {/* <div className="profileImageContainer">
//             {myProfile.avatar === "" ? (
//               <Icon.PersonFill className="profileIcon" />
//             ) : (
//               <img src={myProfile.avatar} alt="avatar" />
//             )}

//             <div>
//               <Form.Group controlId="formFile" className="mb-3 test">
//                 <Form.Control
//                   type="file"
//                   name="avatar"
//                   onChange={async (e) => {
//                     await editProfilePhoto(e as ChangeEvent<HTMLInputElement>);
//                   }}
//                 />
//               </Form.Group>

//             </div>
//           </div> */}
//           <Form onSubmit={handleSubmit}>
//             <Form.Group>
//               <Form.Label>First name</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Type your first name here"
//                 required
//                 value={userInfo.firstName}
//                 onChange={(e) =>
//                   onChangeHandler(
//                     e as ChangeEvent<HTMLInputElement>,
//                     "firstName"
//                   )
//                 }
//               />
//             </Form.Group>
//             <Form.Group>
//               <Form.Label>Last name</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Type your last name here"
//                 required
//                 value={userInfo.lastName}
//                 onChange={(e) =>
//                   onChangeHandler(
//                     e as ChangeEvent<HTMLInputElement>,
//                     "lastName"
//                   )
//                 }
//               />
//             </Form.Group>
//             <Form.Group className="mb-3" controlId="formBasicEmail">
//               <Form.Label>Email address</Form.Label>
//               <Form.Control
//                 type="email"
//                 placeholder="Enter email"
//                 value={userInfo.email}
//                 onChange={(e) =>
//                   onChangeHandler(e as ChangeEvent<HTMLInputElement>, "email")
//                 }
//               />
//               <Form.Text className="text-muted">
//                 We'll never share your email with anyone else.
//               </Form.Text>
//             </Form.Group>
//             <Button
//               variant="primary"
//               type="submit"
//               onClick={async () => {
//                 await editProfileInfo();
//                 navigate("/me/profile");
//               }}
//             >
//               Save changes
//             </Button>
//             <Button
//               type="button"
//               onClick={() => {
//                 navigate("/me/profile");
//               }}
//             >
//               Cancel
//             </Button>
//           </Form>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default EditProfileInput;
