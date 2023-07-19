import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';

function Login() {
  const baseUrl = process.env.NODE_ENV === 'production'
    ? 'https://platepal-chef.azurewebsites.net'
    : 'http://localhost:8000';

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const [isLogin, setLogin] = useState(true);
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const username = formData.username.trim();
    const password = formData.password.trim();

    // Verify that both form fields are filled in.
    if (!username || !password) {
      setError('Please fill out both fields.');
      return;
    }

    // Verify password length when signing up.
    if (!isLogin && password.length < 5) {
      setError('Password must be at least 5 characters long.');
      return;
    }

    try {
      const endpoint = isLogin ? 'token' : 'users';
      const response = await fetch(`${baseUrl}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData),
      });
      if (response.ok) {
        if (isLogin) {
          const data = await response.json();
          localStorage.setItem('token', data.access_token);
          navigate('/');
        } else {
          setIsRegistrationSuccess(true)
        }
        setError(null);
      } else if (response.status === 401) {
        setError('Incorrect username or password.');
      } else if (response.status === 409) {
        setError('That username is taken.');
      } else {
        setError('Unknown error occurred.');
        const data = await response.json();
        console.log(`Code: ${response.status}`);
      }
    } catch (error) {
      console.log("Network error.");
    }
  };

  const handleLinkClick = () => {
    setLogin(!isLogin);
    setError(null);
    setFormData({
      username: '',
      password: '',
    });
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
  }

  return (
    <div className="row align-items-center justify-content-center h-50 w-100">
      <h1 className="platepal-secondary">{isLogin ? 'Login' : 'Register'}</h1>
      <div className="col-10 col-sm-7 col-lg-6 ol-md-7 col-xl-4">
        <Card className="p-5">
          {isRegistrationSuccess ? (
            <>
              <p>Registration successful! Click <a href="/login">here</a> to go to the login page.</p>
            </>
          ) : (
            <>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="form-label" htmlFor="username">Username</Form.Label>
                  <Form.Control
                    id="username"
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    onChange={(event) =>
                      setFormData({ ...formData, username: event.target.value })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={(event) =>
                      setFormData({ ...formData, password: event.target.value })
                    }
                  />
                </Form.Group>
                {error && (
                  <div className="m-0 alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <Button className="mt-5 platepal-button-primary" type="submit" variant="primary">
                  {isLogin ? 'Login' : 'Register'}
                </Button>
              </Form>
              <Link className="mt-5" onClick={handleLinkClick} to="#">
                {isLogin ? "Don't have an account? Register." : 'Already have an account? Login.'}
              </Link>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Login;
