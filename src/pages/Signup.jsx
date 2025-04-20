import React, { useState } from 'react';
import { signUp } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await signUp({
        username: email,
        password,
        options: { userAttributes: { email } },
      });
      alert('Signup successful! Redirecting to login...');
      navigate('/login');
    } catch (err) {
      alert(err.message);
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Sign Up</h2>
        <input
          type="email"
          placeholder="Email"
          style={styles.input}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          onChange={e => setPassword(e.target.value)}
        />
        <button style={styles.button} onClick={handleSignup}>
          Create Account
        </button>
        <p style={styles.linkText}>
          Already have an account? <span onClick={() => navigate('/signin')} style={styles.link}>SignIn
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f4f8',
  },
  card: {
    padding: '2rem',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    width: '300px',
    textAlign: 'center',
  },
  title: {
    marginBottom: '1rem',
  },
  input: {
    width: '100%',
    padding: '0.6rem',
    marginBottom: '1rem',
    border: '1px solid #ccc',
    borderRadius: '6px',
  },
  button: {
    width: '100%',
    padding: '0.6rem',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  linkText: {
    marginTop: '1rem',
    fontSize: '0.9rem',
  },
  link: {
    color: '#007bff',
    cursor: 'pointer',
  },
};

export default Signup;
