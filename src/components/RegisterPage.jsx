import { SignUp } from '@clerk/clerk-react';
import victorLogo from '../assets/victor.png';
import athletePng from '../assets/png.png';
import './AuthPage.css';

function RegisterPage() {
    return (
        <div className="auth-page">
            <div className="auth-split-card">
                {/* ── Left: Clerk form ── */}
                <div className="auth-left">
                    <div className="auth-brand-logo">
                        <img src={victorLogo} alt="Victor" />
                    </div>
                    <p className="auth-welcome">Join us today 🏸</p>
                    <h1 className="auth-title">Sign Up</h1>

                    <SignUp
                        routing="path"
                        path="/register"
                        signInUrl="/login"
                        afterSignUpUrl="/"
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
                                header:        { display: 'none' },
                                logoBox:       { display: 'none' },
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

                {/* Right: Athlete photo panel */}
                <div className="auth-right">
                    <div className="auth-right-bg" />
                    <img src={athletePng} alt="Athlete" className="auth-right-photo" />
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
