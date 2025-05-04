import { Container, Row, Col, Image, Card } from 'react-bootstrap';

function UserBanner() {
  return (
    <Container 
  fluid 
  className="d-flex justify-content-center" 
  style={{ position: "relative", padding: "0", height: "300px" }}
>
  <Container 
    style={{ 
      width: "70%", 
      position: "relative", 
      padding: "0"
    }}
  >
    {/* Background Image */}
    <Image
      src="./sea.jpg"
      fluid
      style={{
        backgroundColor: "black",
        width: "100%",
        height: "100%",
        objectFit: "cover",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1
      }}
      alt="Background Image"
    />

    {/* Overlay User Info Section */}
    <Container
      style={{
        position: "absolute",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "80%",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: "10px",
        padding: "15px",
        zIndex: 2,
        textAlign: "center"
      }}
    >
      <Row className="align-items-start">
        <Col xs="auto">
          <Image
            src="sea.jpg"
            rounded
            style={{ backgroundColor: "pink", width: "80px", height: "80px", objectFit: "cover" }}
            alt="User Image"
          />
        </Col>
        <Col>
          <h5>Username</h5>
          <p style={{ margin: 0 }}>Short description about the user</p>
        </Col>
      </Row>
    </Container>
  </Container>
</Container>

  );
}

export default UserBanner;
