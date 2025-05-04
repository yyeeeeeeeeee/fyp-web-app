
import { Modal, Button } from "react-bootstrap";

const [show, setShow] = useState(false);

return (
  <>
    <Card.Text as="button" onClick={() => setShow(true)} style={{ cursor: "pointer", textDecoration: "underline", background: "none", border: "none", color: "blue" }}>
      Info
    </Card.Text>

    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header closeButton>
        <Modal.Title>User Info</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <UserInfoPage />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>Close</Button>
      </Modal.Footer>
    </Modal>
  </>
);
