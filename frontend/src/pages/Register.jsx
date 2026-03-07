import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import api from '../services/api';
import { FaEye, FaEyeSlash } from "react-icons/fa";


const ROLES = [
  { value: 'bidder', label: 'Bidder', description: 'Place bids on auctions' },
  { value: 'seller', label: 'Seller', description: 'Create and manage auctions' },
];

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'bidder',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
      setError('Please fill all fields.');
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      setIsSubmitting(false);
      return;
    }

    try {
      const res= await api.post('/auth/register',{username:formData.name,email:formData.email,password:formData.password,role:formData.role});
      
      
      
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="register-page" >
      <div className="register-page__container">
        <section className="register-page__card">
          <header className="register-page__header">
            <h1 id="register-heading" className="register-page__title">
              Create account
            </h1>
            <p className="register-page__subtitle">
              Sign up with your chosen role to get started.
            </p>
          </header>

          <form
            className="register-form"
            onSubmit={handleSubmit}
            noValidate
          >
            {error && (
              <div
                id="register-error"
                className="register-form__message register-form__message--error"
               
                
              >
                {error}
              </div>
            )}

            <div className="register-form__group">
              <label htmlFor="register-name" className="register-form__label register-form__label--required">
                Full name
              </label>
              <input
                id="register-name"
                type="text"
                name="name"
                className="register-form__input"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                
                required
                disabled={isSubmitting}
                
              />
            </div>

            <div className="register-form__group">
              <label htmlFor="register-email" className="register-form__label register-form__label--required">
                Email
              </label>
              <input
                id="register-email"
                type="email"
                name="email"
                className="register-form__input"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
                disabled={isSubmitting}
                aria-invalid={!!error}
              />
            </div>

            <div className="register-form__group">
              <label htmlFor="register-password" className="register-form__label register-form__label--required">
                Password
              </label>
              <div className="input-container">
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="register-form__input"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  required
                  minLength={6}
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

            <div className="register-form__group">
              <label htmlFor="register-confirmPassword" className="register-form__label register-form__label--required">
                Confirm password
              </label>
              <div className="input-container">
                <input
                  id="register-confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className="register-form__input"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  required
                  disabled={isSubmitting}
                  aria-invalid={!!error}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <fieldset className="register-form__group">
              <legend className="register-form__label">Register as</legend>
              <div className="register-form__roles" >
                {ROLES.map((role) => (
                  <label
                    key={role.value}
                    className={`register-form__role-option ${formData.role === role.value ? 'register-form__role-option--selected' : ''}`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      aria-describedby={`reg-role-desc-${role.value}`}
                    />
                    <span>
                      {role.label}
                      <small id={`reg-role-desc-${role.value}`}>{role.description}</small>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              className="register-form__submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <footer className="register-page__footer">
            <p>
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </footer>
        </section>
      </div>
    </main>
  );
}
