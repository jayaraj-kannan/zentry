import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Github, Chrome, ArrowRight, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { login, signup, loginWithGoogle } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password, displayName);
            }
        } catch (err) {
            setError(err.message.replace('Firebase:', '').replace('Error (auth/', '').replace(').', ''));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        setLoading(true);
        try {
            await loginWithGoogle();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-overlay"></div>

            <div className="auth-card-wrapper">
                <div className="auth-glass-card">
                    <div className="auth-header">
                        <div className="auth-logo">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span className="mdi mdi-zend pulse" style={{ fontSize: '28px', color: 'var(--primary)' }}></span>
                                <h1 style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: 0, letterSpacing: '0.5px' }}>Zentry</h1>
                            </div>
                        </div>
                        <p className="auth-subtitle">
                            {isLogin ? 'Welcome back to the smart stadium' : 'Join the next generation of event management'}
                        </p>
                    </div>

                    {error && (
                        <div className="auth-error-banner">
                            <ShieldCheck size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="input-group">
                                <label>Full Name</label>
                                <div className="input-wrapper">
                                    <User size={18} />
                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        required={!isLogin}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="input-group">
                            <label>Email Address</label>
                            <div className="input-wrapper">
                                <Mail size={18} />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <div className="input-wrapper">
                                <Lock size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? (
                                <Loader2 className="spin" size={20} />
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-divider">
                        <span>OR CONTINUE WITH</span>
                    </div>

                    <div className="social-auth-grid">
                        <button onClick={handleGoogleLogin} className="social-btn google" disabled={loading}>
                            <Chrome size={20} />
                            <span>Google</span>
                        </button>
                        <button className="social-btn github" disabled={true} title="Coming soon">
                            <Github size={20} />
                            <span>GitHub</span>
                        </button>
                    </div>

                    <div className="auth-footer">
                        <p>
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button onClick={() => setIsLogin(!isLogin)} className="toggle-auth-btn">
                                {isLogin ? 'Sign Up' : 'Sign In'}
                            </button>
                        </p>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="auth-decoration-blobs">
                    <div className="blob blob-1"></div>
                    <div className="blob blob-2"></div>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;
