import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    <main className="flex min-h-screen items-center justify-center bg-[#37477a] p-6 text-white max-[480px]:items-stretch max-[480px]:p-4" role="main">
      <div className="mx-auto w-full max-w-md">
        <section className="rounded-xl border-2 border-[#7CA8DC] bg-[rgba(44,61,115,0.95)] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
          <header className="mb-7 text-center">
            <h1 id="login-heading" className="mb-1 text-2xl font-semibold text-[#FFD372] max-[480px]:text-xl">
              Sign in
            </h1>
            <p className="m-0 text-[15px] text-[#7CA8DC]">
              Sign in with your account for your selected role.
            </p>
          </header>

          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit}
            noValidate
          >
            {error && (
              <div
                id="login-error"
                className="mb-1 rounded-lg border-2 border-[#F15B42] bg-[rgba(241,91,66,0.2)] px-4 py-3 text-sm text-white"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-sm font-medium text-[#FFD372] after:text-[#F15B42] after:content-['_*']">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                className="w-full rounded-lg border-2 border-[#7CA8DC] bg-[rgba(255,255,255,0.95)] px-3.5 py-2.5 pr-10 text-base text-[#2C3D73] placeholder:text-[#5a6a8a] focus:border-[#FFD372] focus:outline-none focus:ring-4 focus:ring-[rgba(255,211,114,0.3)]"
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

            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-password" className="text-sm font-medium text-[#FFD372] after:text-[#F15B42] after:content-['_*']">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="w-full rounded-lg border-2 border-[#7CA8DC] bg-[rgba(255,255,255,0.95)] px-3.5 py-2.5 pr-10 text-base text-[#2C3D73] placeholder:text-[#5a6a8a] focus:border-[#FFD372] focus:outline-none focus:ring-4 focus:ring-[rgba(255,211,114,0.3)]"
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
                  className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center border-none bg-transparent p-0 text-base text-black"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isSubmitting}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <fieldset className="flex flex-col gap-1.5">
              <legend className="text-sm font-medium text-[#FFD372]">Sign in as</legend>
              <div className="flex flex-col gap-2">
                {ROLES.map((role) => (
                  <label
                    key={role.value}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 px-4 py-3 transition max-[480px]:px-3.5 max-[480px]:py-2.5 ${
                      formData.role === role.value
                        ? 'border-[#FFD372] bg-[rgba(255,211,114,0.25)]'
                        : 'border-[#7CA8DC] bg-[rgba(124,170,220,0.15)] hover:border-[#FFD372] hover:bg-[rgba(255,211,114,0.15)]'
                    }`}
                  >
                    <input
                      className="m-0 h-[1.125rem] w-[1.125rem] cursor-pointer accent-[#F15B42]"
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      aria-describedby={`role-desc-${role.value}`}
                    />
                    <span className="text-[15px] text-[#FFD372]">
                      {role.label}
                      <small id={`role-desc-${role.value}`} className="mt-0.5 block text-xs text-[#7CA8DC]">{role.description}</small>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              className="mt-1 rounded-lg border-none bg-[#F15B42] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#d94a32] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <footer className="mt-6 text-center text-[15px] text-[#7CA8DC]">
            <p>
              Don&apos;t have an account? <Link to="/register" className="font-medium text-[#FFD372] no-underline hover:text-[#F49CC4] hover:underline">Create one</Link>
            </p>
          </footer>
        </section>
      </div>
    </main>
  );
}
