import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    sendPasswordResetEmail
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyAo9_wgopj8ava2BZVqGtqjvPiGNkLd_Pw",
    authDomain: "rayopro7-academy.firebaseapp.com",
    projectId: "rayopro7-academy",
    storageBucket: "rayopro7-academy.appspot.com",
    messagingSenderId: "473143198992",
    appId: "1:473143198992:web:9cd9e0d5536ee7ad501195"
};

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const auth = getAuth(initializeApp(firebaseConfig));

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await setPersistence(auth, 
                rememberMe ? browserLocalPersistence : browserSessionPersistence
            );
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = '/dashboard';
        } catch (error) {
            let errorMsg = 'Login failed. Please check your credentials.';
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMsg = 'No account found with this email.';
                    break;
                case 'auth/wrong-password':
                    errorMsg = 'Incorrect password.';
                    break;
                // ... existing error cases ...
            }
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError('Please enter your email address first.');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            alert('Password reset email sent! Please check your inbox.');
        } catch (error) {
            setError('Failed to send reset email. Please try again.');
        }
    };

    return (
        <div className="container">
            <h1>🎓 Login to Rayopro7 Academy</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your Email"
                    required
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Your Password"
                    required
                />
                <div className="form-group">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="rememberMe">Remember me</label>
                </div>
                {error && <div className="error-message">{error}</div>}
                {loading && <div className="loading-spinner" />}
                <button type="submit" disabled={loading}>Login</button>
            </form>
            <div className="auth-links">
                <p>
                    <a href="#" onClick={handleForgotPassword}>
                        Forgot Password?
                    </a>
                </p>
                <p>
                    Don't have an account? <a href="/signup">Sign Up Here</a>
                </p>
            </div>
        </div>
    );
}

export default Login;