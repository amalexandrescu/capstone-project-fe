import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Input } from "@mantine/core";
import "./style.css";

const ProfilePage = () => {
  return (
    <Container fluid className="mainPageContainer">
      <Row className="justify-content-center">
        <Col className="bg-success col-md-6 col-lg-8">
          <Form>
            <Form.Group>
              <Form.Label>First name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type your first name here"
                required
                value=""
                // onChange={(e) => this.onChangeHandler(e.target.value, 'name')}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Last name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Type your last name here"
                required
                value=""
                // onChange={(e) => this.onChangeHandler(e.target.value, 'name')}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            {/* <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group> */}
            <Button variant="primary" type="submit">
              Edit profile
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;
