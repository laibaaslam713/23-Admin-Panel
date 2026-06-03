import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPass, setShowPass] = useState(false);

  if (admin) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setServerError('');
    try {
      const data = await login(form.email, form.password);
      if (data.success) navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }));
    if (serverError) setServerError('');
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 50%, #f5f0ff 100%)',
      padding: 16, position: 'relative', overflow: 'hidden',
    }}>
      {[
        { top: '-10%', left: '-5%', w: 400, h: 400, c: 'rgba(37,99,235,0.06)' },
        { bottom: '-10%', right: '-5%', w: 350, h: 350, c: 'rgba(124,58,237,0.06)' },
        { top: '40%', left: '60%', w: 250, h: 250, c: 'rgba(14,165,233,0.05)' },
      ].map((b, i) => (
        <div key={i} style={{
          position: 'absolute', borderRadius: '50%',
          width: b.w, height: b.h, background: b.c,
          top: b.top, bottom: b.bottom, left: b.left, right: b.right,
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
      ))}

      <div style={{ width: '100%', maxWidth: 440, position: 'relative' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>
            AdminHub
          </h1>
          <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>
            Sign in to manage your messages
          </p>
        </div>

        
        <div className="card" style={{ padding: 32 }}>
          {serverError && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8,
              padding: '12px 16px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span style={{ fontSize: 13, color: '#dc2626', fontWeight: 500 }}>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email" value={form.email} onChange={handleChange('email')}
                placeholder="admin@example.com"
                className={`form-input ${errors.email ? 'error' : ''}`}
                autoComplete="email" autoFocus
              />
              {errors.email && <div className="form-error">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {errors.email}
              </div>}
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password} onChange={handleChange('password')}
                  placeholder="Enter your password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPass(s => !s)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4,
                }}>
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              {errors.password && <div className="form-error">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {errors.password}
              </div>}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, borderRadius: 10 }}>
              {loading ? (
                <><div className="spinner" style={{ width: 18, height: 18 }} /> Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: 20, padding: '14px', background: '#f8fafc', borderRadius: 8, border: '1px dashed #e2e8f0' }}>
            <p style={{ fontSize: 12, color: '#64748b', fontWeight: 500, marginBottom: 4 }}>Demo credentials:</p>
            <p style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: '#475569' }}>admin@example.com / Admin@123</p>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#94a3b8' }}>
          © 2024 AdminHub. Secure admin access only.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
