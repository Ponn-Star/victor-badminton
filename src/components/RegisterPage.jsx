import { SignUp } from '@clerk/clerk-react';
import victorLogo from '../assets/victor.png';
import athletePng from '../assets/png.png';
import './AuthPage.css';

function RegisterPage() {
    return (
        <div className="auth-page auth-page--register">
            <div className="auth-split-card">
                <div className="auth-left">
                    <div className="auth-form-column">
                        <div className="auth-brand-logo">
                            <img src={victorLogo} alt="Victor" />
                        </div>
                        <p className="auth-welcome">Tham gia ngay hôm nay</p>
                        <h1 className="auth-title">Đăng Ký</h1>

                        <SignUp
                            routing="path"
                            path="/register"
                            signInUrl="/login"
                            afterSignUpUrl="/"
                            appearance={{
                                variables: {
                                    colorPrimary: '#d87499',
                                    colorBackground: 'transparent',
                                    colorInputBackground: '#c8dde8',
                                    colorInputText: '#1a1a2e',
                                    colorText: '#161616',
                                    colorTextSecondary: '#777',
                                    borderRadius: '4px',
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
                                    header: { display: 'none' },
                                    logoBox: { display: 'none' },
                                    formButtonPrimary: {
                                        background: '#d87499',
                                        borderRadius: '999px',
                                        fontWeight: '700',
                                        letterSpacing: '0.5px',
                                    },
                                    socialButtonsBlockButton: {
                                        borderRadius: '999px',
                                        border: '1px solid #7eb7df',
                                        backgroundColor: '#fff',
                                    },
                                    footerActionLink: { color: '#d87499', fontWeight: '600' },
                                },
                            }}
                        />
                    </div>
                </div>

                <div className="auth-right">
                    <div className="auth-right-bg" />
                    <img src={athletePng} alt="Victor badminton athlete" className="auth-right-photo" />
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
