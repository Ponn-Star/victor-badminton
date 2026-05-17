import { SignUp } from '@clerk/clerk-react';
import './AuthPage.css';

function RegisterPage() {
    return (
        <div className="auth-page">
            <SignUp
                routing="path"
                path="/register"
                signInUrl="/login"
                afterSignUpUrl="/"
                appearance={{
                    elements: {
                        rootBox: { width: '100%', display: 'flex', justifyContent: 'center' },
                    }
                }}
            />
        </div>
    );
}

export default RegisterPage;
