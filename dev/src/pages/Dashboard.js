import { useEffect, useState } from "react";
import { Container, Table, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const fetchUsers = async() => {
        try {
            const response = await fetch("http://localhost:5000/api/user");
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error("error while fetching users:", error.message);
        }
    }

    useEffect(() => {
        fetchUsers();
    },[]);

    const handleUpdate = (userId) => {
        navigate(`/user/${userId}`);
    }

    const handleDelete = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/user/${userId}`, {
                method: "DELETE"
            });
            if (response.ok) {
                fetchUsers();
            }
        } catch (error) {
            console.error("error while deleting user:", error.message);
        }
    }

    return(
        <>
        <Container className="mt-5">
            <Row>
                <Col>
                <h1 className="text-center">Dashboard component</h1>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.password}</td>
                                <td>
                                    <Button variant="dark" 
                                    onClick={() => handleUpdate(user._id)}>
                                        Update
                                        </Button>{" "}
                                    <Button variant="danger" 
                                    onClick={() => handleDelete(user._id)}>
                                        Delete
                                        </Button>{" "}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                </Col>
            </Row>           
        </Container>   
        </>
    )
};

export default Dashboard;