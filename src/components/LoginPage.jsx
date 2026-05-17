import { SignIn } from '@clerk/clerk-react';
import './AuthPage.css';

function LoginPage() {
    return (
        <div className="auth-page">
            <SignIn
                routing="path"
                path="/login"
                signUpUrl="/register"
                afterSignInUrl="/"
                appearance={{
                    elements: {
                        rootBox: { width: '100%', display: 'flex', justifyContent: 'center' },
                    }
                }}
            />
        </div>
    );
}

export default LoginPage;
