import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import api from '../services/api';
import { FaEye, FaEyeSlash } from "react-icons/fa";



const ROLES = [
  { value: 'admin', label: 'Admin', description: 'Platform administration' },
  { value: 'bidder', label: 'Bidder', description: 'Place bids on auctions' },
  { value: 'seller', label: 'Seller', description: 'Create and manage auctions' },
];

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'bidder',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!formData.email.trim() || !formData.password) {
      setError('Please enter email and password.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await api.post('/auth/login', { 
        email: formData.email, 
        password: formData.password, 
        role: formData.role 
      });
    
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('username', res.data.username);
      
      console.log('Login successful, token stored:');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page" role="main">
      <div className="login-page__container">
        <section className="login-page__card">
          <header className="login-page__header">
            <h1 id="login-heading" className="login-page__title">
              Sign in
            </h1>
            <p className="login-page__subtitle">
              Sign in with your account for your selected role.
            </p>
          </header>

          <form
            className="login-form"
            onSubmit={handleSubmit}
            noValidate
          >
            {error && (
              <div
                id="login-error"
                className="login-form__message login-form__message--error"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}

            <div className="login-form__group">
              <label htmlFor="login-email" className="login-form__label login-form__label--required">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                className="login-form__input"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={isSubmitting}
                aria-invalid={!!error}
                aria-describedby={error ? 'login-error' : undefined}
              />
            </div>

            <div className="login-form__group">
              <label htmlFor="login-password" className="login-form__label login-form__label--required">
                Password
              </label>
              <div className="input-container">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="login-form__input"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  disabled={isSubmitting}
                  aria-invalid={!!error}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isSubmitting}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <fieldset className="login-form__group">
              <legend className="login-form__label">Sign in as</legend>
              <div className="login-form__roles">
                {ROLES.map((role) => (
                  <label
                    key={role.value}
                    className={`login-form__role-option ${formData.role === role.value ? 'login-form__role-option--selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      aria-describedby={`role-desc-${role.value}`}
                    />
                    <span>
                      {role.label}
                      <small id={`role-desc-${role.value}`}>{role.description}</small>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              className="login-form__submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <footer className="login-page__footer">
            <p>
              Don&apos;t have an account? <Link to="/register">Create one</Link>
            </p>
          </footer>
        </section>
      </div>
    </main>
  );
}
