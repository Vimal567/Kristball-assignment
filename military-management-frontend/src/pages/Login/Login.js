import { useState } from 'react';
import "./Login.css";
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('alpha@example.com');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const submit = async (event) => {
        event.preventDefault();
        setError(null);
        try {
            const data = await api.auth(email, password);
            const token = data.token;
            const user = data.user;
            api.setToken(token);
            onLogin(token, user);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="row justify-content-center px-2">
            <div className="col-md-5 auth-form">
                <h3 className="mb-3">Login</h3>
                <form onSubmit={submit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input className="form-control" value={email} placeholder='Enter email' onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input type="password" className="form-control" placeholder='Min 8 characters' minLength={8} value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <button className="btn btn-primary" type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}
