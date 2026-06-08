import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Auth.module.css';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors

    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    
    try {
      // Send the data to your Flask backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        }),
      });

      const data = await response.json();

      // Check if registration was successful
      if (response.ok) {
        console.log('Success:', data.message);
        navigate('/login'); // Send them to the login page
      } else {
        // Show the error from the backend (e.g., "User already exists")
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      console.error(err);
      setError('Could not connect to the server. Is Flask running?');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>TRAVELM<span>Ai</span>T</div>
        <h1 className={styles.heading}>Create account</h1>
        <p className={styles.sub}>Start planning your dream trip</p>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Anshuman Dev"
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className={styles.btn}>Create Account</button>
        </form>

        <p className={styles.switch}>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}

