import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccountCreation.css';

const AccountCreation = () => {
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [captcha, setCaptcha] = useState('');
    const [userCaptcha, setUserCaptcha] = useState('');
    const [generatedOtp, setGeneratedOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [userOtp, setUserOtp] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const passwordRequirements = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    // Generate CAPTCHA value
    useEffect(() => {
        generateCaptcha();
    }, []);

    const generateCaptcha = () => {
        const newCaptcha = Math.random().toString(36).substring(2, 8).toUpperCase();
        setCaptcha(newCaptcha);
    };

    // Generate OTP function
    const generateOtp = () => {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(otp);
        alert(`OTP sent: ${otp}`);
        setIsOtpSent(true);
        setUserOtp('');
        setIsOtpVerified(false);
    };

    // Verify OTP function
    const verifyOtp = () => {
        if (userOtp === generatedOtp) {
            alert('OTP verified successfully!');
            setIsOtpVerified(true);
        } else {
            alert('Invalid OTP, please try again.');
        }
    };

    // Handle account creation
    const handleCreateAccount = async () => {
        setErrorMessage('');

        // Check if password meets security requirements
        if (!passwordRequirements.test(password)) {
            setErrorMessage('Password must meet the security requirements.');
            return;
        }

        // Ensure password and confirm password match
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match!');
            return;
        }

        // Ensure CAPTCHA is correct
        if (userCaptcha !== captcha) {
            setErrorMessage('Invalid CAPTCHA, please try again.');
            return;
        }

        const userData = {
            firstName,
            middleName,
            lastName,
            email,
            password,
            captcha: userCaptcha,
        };

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            // Log the raw response to check its content
            const textResponse = await response.text();
            console.log('Raw response:', textResponse);

            // Try to parse the response as JSON
            const result = JSON.parse(textResponse); // Replace response.json() with JSON.parse

            if (response.ok && result.success) {
                setShowSuccessModal(true); // Show success modal on success
                resetForm();
            } else {
                setErrorMessage(result.error || 'Error creating account');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error creating account');
        }
    };

    // Reset the form after account creation
    const resetForm = () => {
        setFirstName('');
        setMiddleName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setUserOtp('');
        setIsOtpSent(false);
        setIsOtpVerified(false);
        setUserCaptcha('');
        generateCaptcha();
        setErrorMessage('');
    };

    // Success Modal
    const SuccessModal = ({ onClose }) => {
        const handleOk = () => {
            onClose();
            navigate('/login'); // Navigate to login page
        };

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h3>Account Created Successfully!</h3>
                    <button onClick={handleOk}>Go to Login</button>
                </div>
            </div>
        );
    };

    return (
        <div className="account-creation-container">
            <h2>Create Account</h2>
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <div className="form-row">
                <div className="form-group">
                    <label>First Name</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Middle Name</label>
                    <input
                        type="text"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="show-hide-button"
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="form-group">
                <label>CAPTCHA</label>
                <div className="captcha-container">
                    <input
                        type="text"
                        value={userCaptcha}
                        onChange={(e) => setUserCaptcha(e.target.value)}
                        placeholder="Enter CAPTCHA"
                        required
                    />
                    <span className="captcha">{captcha}</span>
                    <button className="refresh-captcha-button" onClick={generateCaptcha}>
                        Refresh
                    </button>
                </div>
            </div>

            <div className="form-group">
                <label>OTP</label>
                <div className="otp-container">
                    <input
                        type="text"
                        value={userOtp}
                        onChange={(e) => setUserOtp(e.target.value)}
                        placeholder="Enter OTP"
                        required
                    />
                    <button className="otp-button" onClick={generateOtp}>
                        Send OTP
                    </button>
                </div>
            </div>

            {isOtpSent && !isOtpVerified && (
                <button className="submit-button" onClick={verifyOtp}>
                    Verify OTP
                </button>
            )}
            
            {isOtpVerified && (
                <button className="create-account-button" onClick={handleCreateAccount}>
                    Create Account
                </button>
            )}

            {showSuccessModal && <SuccessModal onClose={() => setShowSuccessModal(false)} />}

            <div className="signup-prompt">
                <p>
                    Already have an account?{' '}
                    <button className="login-button" onClick={() => navigate('/login')}>
                        Login here
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AccountCreation;
