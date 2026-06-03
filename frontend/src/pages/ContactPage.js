import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { messagesAPI } from '../services/api';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    else if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setServerError('');
    try {
      await messagesAPI.create(form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }));
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Header title="Contact Form" subtitle="Preview & test the public contact form" />
        <div className="page-content">
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            
            <div style={{
              background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10,
              padding: '12px 16px', marginBottom: 24, display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p style={{ fontSize: 13, color: '#1e40af', fontWeight: 500 }}>
                This simulates the public contact form. Messages submitted here will appear in the Messages dashboard.
              </p>
            </div>

            <div className="card" style={{ padding: 32 }}>
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  Get in Touch
                </h2>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
                  Fill out the form and we'll get back to you as soon as possible.
                </p>
              </div>

              {success && (
                <div style={{
                  background: 'var(--success-light)', border: '1px solid #a7f3d0', borderRadius: 10,
                  padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 12,
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', background: 'var(--success)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#065f46' }}>Message sent successfully!</div>
                    <div style={{ fontSize: 13, color: '#047857', marginTop: 2 }}>
                      Your message has been submitted. Check the Messages dashboard to see it.
                    </div>
                  </div>
                </div>
              )}

              {serverError && (
                <div style={{
                  background: 'var(--danger-light)', border: '1px solid #fca5a5', borderRadius: 10,
                  padding: '12px 16px', marginBottom: 20, fontSize: 13, color: 'var(--danger)', fontWeight: 500,
                }}>
                  {serverError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" value={form.name} onChange={handleChange('name')}
                      placeholder="John Doe" className={`form-input ${errors.name ? 'error' : ''}`} />
                    {errors.name && <div className="form-error">{errors.name}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" value={form.email} onChange={handleChange('email')}
                      placeholder="john@example.com" className={`form-input ${errors.email ? 'error' : ''}`} />
                    {errors.email && <div className="form-error">{errors.email}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input type="text" value={form.subject} onChange={handleChange('subject')}
                    placeholder="What is this about?" className={`form-input ${errors.subject ? 'error' : ''}`} />
                  {errors.subject && <div className="form-error">{errors.subject}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea value={form.message} onChange={handleChange('message')}
                    placeholder="Write your message here… (minimum 10 characters)"
                    rows={5}
                    className={`form-input ${errors.message ? 'error' : ''}`}
                    style={{ resize: 'vertical', minHeight: 120 }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    {errors.message ? <div className="form-error">{errors.message}</div> : <span />}
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{form.message.length} chars</span>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: 15, borderRadius: 10 }}>
                  {loading ? (
                    <><div className="spinner" style={{ width: 18, height: 18 }} /> Sending…</>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
