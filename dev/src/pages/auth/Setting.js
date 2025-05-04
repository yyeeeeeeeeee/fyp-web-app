import { Container, Form, Card, ListGroup, Button, Col, Row, Image } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { PencilSquare, CheckCircle, XCircle } from 'react-bootstrap-icons';

function Setting({ userId }) {  // ✅ Accept `userId` as a prop
    const [editingField, setEditingField] = useState('');
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [tempData, setTempData] = useState({ ...formData });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/user/${userId}`);  // ✅ Use `userId`
                const data = await response.json();
                setFormData({
                    username: data.username || "", // Ensure non-undefined default
                    email: data.email || "",
                    password: data.password || ""
                });
            } catch (error) {
                console.error("Error fetching user:", error.message);
            }
        };
        if (userId) fetchUser();  // ✅ Only fetch if `userId` is valid
    }, [userId]);  // ✅ Dependency is `userId`, not `id`

    const handleEdit = (field) => {
        setEditingField(field);
        setTempData({ ...formData }); // Store current data as temp backup
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSave = () => {
        setFormData({ ...tempData });
        setEditingField('');
    };

    const handleCancel = () => {
        setEditingField('');
        setTempData({ ...formData }); // Revert changes
    };

    const renderField = (fieldName, label, type = 'text') => (
        <ListGroup.Item>
            <strong>{label}:</strong>
            {editingField === fieldName ? (
                <Form.Control
                    type={type}
                    name={fieldName}
                    value={tempData[fieldName]}
                    onChange={handleInputChange}
                    className="d-inline w-50 ms-2"
                />
            ) : (
                <span className="ms-2">{formData[fieldName]}</span>
            )}

            {editingField === fieldName ? (
                <span className="float-end">
                    <CheckCircle
                        className="text-success me-2"
                        onClick={handleSave}
                        style={{ cursor: 'pointer' }}
                    />
                    <XCircle
                        className="text-danger"
                        onClick={handleCancel}
                        style={{ cursor: 'pointer' }}
                    />
                </span>
            ) : (
                <PencilSquare
                    className="float-end text-primary"
                    onClick={() => handleEdit(fieldName)}
                    style={{ cursor: 'pointer' }}
                />
            )}
        </ListGroup.Item>
    );

    return (
        <Container fluid className="d-flex justify-content-center" style={{ padding: "0" }}>
    {/* Main Container for Banner + Info */}
    <Container style={{ width: "100%", padding: "0" }}>
        {/* User Info Card */}
        <Container className="mt-4">
            <Card className="shadow-sm" style={{ width: "100%", boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)" }}>
                <ListGroup variant="flush">
                    {renderField('username', 'Username')}
                    {renderField('email', 'Email')}
                    {renderField('password', 'Password', 'password')}
                </ListGroup>
            </Card>
        </Container>
    </Container>
</Container>


    );
}

export default Setting;
