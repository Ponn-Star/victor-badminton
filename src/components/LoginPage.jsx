import { SignIn } from '@clerk/clerk-react';
import victorLogo from '../assets/victor.png';
import './AuthPage.css';

function LoginPage() {
    return (
        <div className="auth-page">
            <div className="auth-split-card">
                {/* Left: Clerk form */}
                <div className="auth-left">
                    <div className="auth-brand-logo">
                        <img src={victorLogo} alt="Victor" />
                    </div>
                    <p className="auth-welcome">Welcome back !!!</p>
                    <h1 className="auth-title">Log In</h1>

                    <SignIn
                        routing="path"
                        path="/login"
                        signUpUrl="/register"
                        afterSignInUrl="/"
                        appearance={{
                            variables: {
                                colorPrimary: '#d45c7a',
                                colorBackground: 'transparent',
                                colorInputBackground: '#c8dde8',
                                colorInputText: '#1a1a2e',
                                colorText: '#1a1a2e',
                                colorTextSecondary: '#666',
                                borderRadius: '8px',
                                fontFamily: 'inherit',
                            },
                            elements: {
                                rootBox: { width: '100%' },
                                card: {
                                    boxShadow: 'none',
                                    padding: '0',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    width: '100%',
                                },
                                header:    { display: 'none' },
                                logoBox:   { display: 'none' },
                                formButtonPrimary: {
                                    background: 'linear-gradient(90deg, #e879a8 0%, #d45c7a 100%)',
                                    borderRadius: '50px',
                                    fontWeight: '700',
                                    letterSpacing: '2px',
                                },
                                socialButtonsBlockButton: {
                                    borderRadius: '50px',
                                    border: '1.5px solid #d8d8d8',
                                    backgroundColor: '#fff',
                                },
                                footerActionLink: { color: '#d45c7a', fontWeight: '700' },
                            },
                        }}
                    />
                </div>

                {/* Right: Decoration panel */}
                <div className="auth-right">
                    <div className="auth-bubble auth-bubble--1" />
                    <div className="auth-bubble auth-bubble--2" />
                    <div className="auth-bubble auth-bubble--3" />
                    <div className="auth-bubble auth-bubble--4" />
                    <div className="auth-right-content">
                        <img src={victorLogo} alt="Victor" />
                        <h2>VICTOR</h2>
                        <p>Trang bị tốt nhất<br />cho đam mê cầu lông của bạn</p>
                        <div className="auth-right-badge">🏸 Badminton Equipment</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
