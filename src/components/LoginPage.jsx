import { useState } from 'react';
import { useSignIn } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import victorLogo from '../assets/victor.png';
import athletePng from '../assets/png.png';
import './AuthPage.css';

function getClerkErrorMessage(error) {
    return (
        error?.errors?.[0]?.longMessage ||
        error?.errors?.[0]?.message ||
        error?.message ||
        'Unable to sign in. Please check your email and password.'
    );
}

function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="auth-google-icon">
            <path fill="#4285F4" d="M21.6 12.23c0-.77-.07-1.51-.2-2.23H12v4.22h5.38a4.6 4.6 0 0 1-1.99 3.02v2.51h3.23c1.89-1.74 2.98-4.3 2.98-7.52Z" />
            <path fill="#34A853" d="M12 22c2.7 0 4.97-.89 6.62-2.25l-3.23-2.51c-.9.6-2.04.95-3.39.95-2.6 0-4.8-1.76-5.59-4.12H3.08v2.59A10 10 0 0 0 12 22Z" />
            <path fill="#FBBC05" d="M6.41 14.07A6 6 0 0 1 6.1 12c0-.72.12-1.42.31-2.07V7.34H3.08A10 10 0 0 0 2 12c0 1.61.39 3.13 1.08 4.46l3.33-2.39Z" />
            <path fill="#EA4335" d="M12 5.81c1.47 0 2.79.51 3.83 1.5l2.87-2.87C16.96 2.82 14.69 2 12 2a10 10 0 0 0-8.92 5.34l3.33 2.59C7.2 7.57 9.4 5.81 12 5.81Z" />
        </svg>
    );
}

function EyeIcon({ isOpen }) {
    return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className="auth-eye-icon">
            <path d="M2.6 12s3.4-6 9.4-6 9.4 6 9.4 6-3.4 6-9.4 6-9.4-6-9.4-6Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
            {!isOpen && <path d="M4 20 20 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />}
        </svg>
    );
}

function LoginPage() {
    const navigate = useNavigate();
    const { isLoaded, signIn, setActive } = useSignIn();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isLoaded || isSubmitting) return;

        setErrorMessage('');
        setIsSubmitting(true);

        try {
            const result = await signIn.create({
                identifier: email,
                password,
                strategy: 'password',
            });

            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId });
                navigate('/');
                return;
            }

            setErrorMessage('This account needs another verification step before signing in.');
        } catch (error) {
            setErrorMessage(getClerkErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        if (!isLoaded || isSubmitting) return;

        setErrorMessage('');
        setIsSubmitting(true);

        try {
            await signIn.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/',
            });
        } catch (error) {
            setErrorMessage(getClerkErrorMessage(error));
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-page auth-page--login">
            <div className="auth-split-card">
                <div className="auth-left">
                    <div className="auth-form-column">
                        <div className="auth-brand-logo">
                            <img src={victorLogo} alt="Victor" />
                        </div>
                        <p className="auth-welcome">Chào mừng trở lại !!!</p>
                        <h1 className="auth-title">Đăng Nhập</h1>

                        <form className="auth-login-form" onSubmit={handleSubmit}>
                            <label className="auth-field">
                                <span>Email</span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="login@gmail.com"
                                    autoComplete="email"
                                    required
                                />
                            </label>

                            <label className="auth-field auth-password-field">
                                <span>Password</span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    placeholder="************"
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="auth-password-toggle"
                                    onClick={() => setShowPassword((current) => !current)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    <EyeIcon isOpen={showPassword} />
                                </button>
                                <a className="auth-forgot-link" href="/login">Forgot Password ?</a>
                            </label>

                            {errorMessage && <p className="auth-error">{errorMessage}</p>}

                            <button type="submit" className="auth-login-button" disabled={!isLoaded || isSubmitting}>
                                <span>{isSubmitting ? 'WAIT' : 'LOGIN'}</span>
                            </button>
                        </form>

                        <div className="auth-divider">or continue with</div>

                        <button type="button" className="auth-google-button" onClick={handleGoogleSignIn} disabled={!isLoaded || isSubmitting}>
                            <GoogleIcon />
                            <span>Google</span>
                        </button>

                        <p className="auth-switch">
                            Don&apos;t have an account yet?
                            <Link to="/register">Sign up for free</Link>
                        </p>
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

export default LoginPage;
