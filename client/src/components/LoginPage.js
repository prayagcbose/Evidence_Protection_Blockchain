import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (email && password) {
            try {
                const response = await fetch('http://localhost:5000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.token);

                    // Show success popup
                    setIsSuccessPopupVisible(true);

                    // Hide popup and navigate after a short delay
                    setTimeout(() => {
                        setIsSuccessPopupVisible(false);
                        navigate('/file');
                    }, 2000);
                } else {
                    const error = await response.text();
                    alert(error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Login failed. Please try again later.');
            }
        } else {
            alert('Please enter valid credentials.');
        }
    };

    return (
        <div className="login-page">
            {/* Overlay and Success Popup */}
            {isSuccessPopupVisible && (
                <>
                    <div className="overlay active"></div>
                    <div className="success-popup">
                        <div className="popup-content">
                            <i className="fas fa-check-circle checkmark-icon"></i>
                            <span>Login Successful!</span>
                        </div>
                    </div>
                </>
            )}

            {/* Login Form */}
            <div className="login-container">
                <div className="login-form">
                    <i className="fas fa-shield-alt security-icon"></i>
                    <h2>Login</h2>
                    <form onSubmit={handleSubmit}>
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="off"
                        />

                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="off"
                        />

                        <button type="submit" className="login-button">LOGIN</button>
                    </form>

                    <div className="forgot-password">
                        <span className="link-text" onClick={() => navigate('/forgot-password')}>
                            Forgot Password?
                        </span>
                    </div>

                    <p className="sign-up">
                        Don't have an account yet?
                        <Link to="/account-creation" className="link-text"> Sign Up</Link>

                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;