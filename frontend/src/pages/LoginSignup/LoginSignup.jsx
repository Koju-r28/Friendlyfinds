import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './LoginSignup.css';
import logo from '../../Components/Assets/logo.png';
import hero from '../../Components/Assets/hero.png';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const [termsChecked, setTermsChecked] = useState(false); 
  const [showPassword, setShowPassword] = useState(false);

  const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        if (!formData.email || !formData.password) {
          setError('Please enter both email and password');
          setLoading(false);
          return;
        }

        if(!isValidEmail(formData.email)){
          setError('Please enter the valid email address');
          setLoading(false);
          return;
        }

        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          console.log('Login successful');
          
        } else {
          setError(result.message);
        }
      } else {
        // Signup
        if (!formData.username || !formData.email || !formData.password) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }
        if (!isValidEmail(formData.email)) {
           setError('Please enter a valid email address');
           setLoading(false);
           return;}

        if(!termsChecked){
          setError('You must agree to the terms and conditions');
          setLoading(false);
          return;
        }

        const result = await signup(formData.username, formData.email, formData.password);
        
        if (result.success) {
          console.log('Registration successful');
          // User will be redirected automatically by ProtectedRoute
        } else {
          setError(result.message);
        }
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      username: '',
      email: '',
      password: ''
    });
  };

  return (
    
     <div className="login-page">
      {/* Green Hero Section at TOP */}
      <div className="login-hero">
        <div className="hero-content-center">
          <img src={logo} alt="Friendly Finds Logo" className="hero-logo" />
          <h1 className="hero-title-main">
            Turn your old items into <span className="highlight-white">new possibilities.</span>
          </h1>
          <p className="hero-subtitle-main">Join the most trusted student-to-student marketplace</p>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="login-container">
        <div className="auth-form-wrapper">
          <div className="form-header">
            <h2>Get Started</h2>
            <div className="tab-buttons">
              <button 
                className={`tab-btn ${isLogin ? 'active' : ''}`}
                onClick={() => toggleMode()}
                disabled={loading}
              >
                Log In
              </button>
              <button 
                className={`tab-btn ${!isLogin ? 'active' : ''}`}
                onClick={() => toggleMode()}
                disabled={loading}
              >
                Register
              </button>
            </div>
          </div>

          <div className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label>Username</label>
                <div className="input-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="ABC"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Email</label>
              <div className="input-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                  disabled={loading}
                />
                 <button
                  type="button"
                  className="show-hide-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="terms-checkbox">
                <input type="checkbox" id="terms" checked={termsChecked} onChange={(e)=> setTermsChecked(e.target.checked)} required disabled={loading} />
                <label htmlFor="terms">
                  I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                </label>
              </div>
            )}

            <button 
              onClick={handleSubmit} 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" opacity="0.25"/>
                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
                  </svg>
                  {isLogin ? 'Logging in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Log In' : 'Create Account'}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>

            <p className="switch-mode">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={toggleMode} disabled={loading}>
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </p>
          </div>
        </div>

        
        <div className="info-section-bottom">
          <div className="info-header">
            <h2 className="info-main-title">Why Choose Friendly Finds?</h2>
            <p className="info-subtitle">Your trusted campus marketplace for student essentials</p>
          </div>
          
          <div className="info-cards">
            <div className="info-card">
              <div className="info-card-icon">🎓</div>
              <h4>Student-Verified</h4>
              <p>Exclusive community of verified university students only</p>
            </div>
            
            <div className="info-card">
              <div className="info-card-icon">💰</div>
              <h4>Zero Fees</h4>
              <p>No hidden charges. Keep 100% of your earnings</p>
            </div>
            
            <div className="info-card">
              <div className="info-card-icon">🤝</div>
              <h4>Safe Meetups</h4>
              <p>Meet sellers on campus in secure, public locations</p>
            </div>
            
            <div className="info-card">
              <div className="info-card-icon">♻️</div>
              <h4>Eco-Friendly</h4>
              <p>Reduce waste by giving items a second life</p>
            </div>
          </div>
          
        
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;