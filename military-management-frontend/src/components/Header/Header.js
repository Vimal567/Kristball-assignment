import { Link, useLocation } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';

export default function Header({ user, onLogout }) {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <Navbar bg="dark" variant="dark" expand="lg" sticky='top'>
            <Container>
                <Navbar.Brand as={Link} to="/">Military Management</Navbar.Brand>
                <Navbar.Toggle aria-controls="main-nav" />
                <Navbar.Collapse id="main-nav">
                    <Nav className="me-auto">
                        {user && user.name && <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>}
                        {user && user.name && <Nav.Link as={Link} to="/purchases">Purchases</Nav.Link>}
                        {user && user.name && <Nav.Link as={Link} to="/transfers">Transfers</Nav.Link>}
                        {user && user.name && user.role !== "BaseCommander" && <Nav.Link as={Link} to="/expenditures">Expenditures</Nav.Link>}
                    </Nav>
                    <Nav>
                        {user && user.name ? (
                            <>
                                <Navbar.Text className="me-3">
                                    {user.name} ({user.role})
                                </Navbar.Text>
                                <Button variant="outline-light" size="sm" onClick={onLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                {currentPath !== '/login' && (
                                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                )}
                                {currentPath !== '/register' && (
                                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                                )}
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
