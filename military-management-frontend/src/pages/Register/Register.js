import { useEffect, useState } from "react";
import "./Register.css";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "Admin",
        baseId: "",
    });
    const [basesList, setBasesList] = useState([]);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const fetchBases = async () => {
        try {
            const data = await api.getBases();
            setBasesList(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const submit = async (event) => {
        event.preventDefault();
        setError(null);

        const { name, email, password, role, baseId } = formData;

        if (!name.trim() || !email.trim() || password.length < 8) {
            setError("Please provide name, valid email and password (min 8 chars).");
            return;
        }

        try {
            const payload = {
                name: name.trim(),
                email: email.trim(),
                password,
                role,
                baseId: baseId || null,
            };

            await api.register(payload);

            // Reset the form but keep role
            setFormData({
                name: "",
                email: "",
                password: "",
                role: role,
                baseId: "",
            });

            alert("User created successfully!");

            navigate("/login");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Registration failed");
        }
    };

    useEffect(() => {
        fetchBases();
    }, [])

    return (
        <div className="row justify-content-center px-2">
            <div className="col-md-6 auth-form">
                <h3 className="mb-3">Register User</h3>
                <form onSubmit={submit}>
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                            className="form-control"
                            name="name"
                            value={formData.name}
                            placeholder="Enter full name"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            placeholder="Enter email"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            placeholder="Min 8 characters"
                            minLength={8}
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Role</label>
                        <select
                            className="form-select"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="BaseCommander">BaseCommander</option>
                            <option value="LogisticsOfficer">LogisticsOfficer</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Base</label>
                        <select className="form-select" name="baseId" value={formData.baseId} onChange={handleChange} placeholder="Select base">
                            <option value="" disabled>Select base</option>
                            {basesList.map((base, index) => (
                                <option key={index} value={base._id}>{base.name}</option>
                            ))}
                        </select>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <div className="d-flex gap-2">
                        <button className="btn btn-primary" type="submit">
                            Create User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
