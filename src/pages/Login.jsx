import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Eye, EyeOff } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', {
        email,
        password,
      });

      login(res.data.token, res.data.user); // Update context
      localStorage.setItem('user', JSON.stringify(res.data.user));

      navigate('/dashboard');
    } catch (error) {
      console.error('Erreur de connexion', error.response?.data?.message || error.message);
      alert('Connexion échouée : ' + (error.response?.data?.message || 'Erreur serveur'));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center">
      <div className="container">
        <div className="card border-0 rounded-4 shadow overflow-hidden" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="row g-0">
            <div className="col-lg-6 d-none d-lg-block position-relative">
              <div className="h-100 d-flex align-items-center justify-content-center p-5" style={{ background: 'linear-gradient(135deg, #6c63ff 0%, #8e7cff 100%)' }}>
                <div className="text-center p-4 text-white">
                  <h3 className="fw-bold">Create, Share, Collect</h3>
                  <p className="opacity-75">Your forms, your data, simplified.</p>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <span className="text-secondary">Not a member?</span>
                  <Link to="/register" className="ms-2 text-primary text-decoration-none">Register now</Link>
                </div>

                <div className="mb-5">
                  <h2 className="fw-bold mb-2 text-center">Hello Again!</h2>
                  <p className="text-center">Welcome back, you've been missed!</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <input
                      type="email"
                      className="form-control form-control-lg rounded-3 py-3"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3 position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control form-control-lg rounded-3 py-3"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button type="button" className="btn position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent pe-3" onClick={togglePasswordVisibility}>
                      {showPassword ? <EyeOff size={20} className="text-secondary" /> : <Eye size={20} className="text-secondary" />}
                    </button>
                  </div>

                  <div className="text-end mb-4">
                    <Link to="/forgot-password" className="text-secondary text-decoration-none">Recovery Password</Link>
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg w-100 rounded-3 py-3" style={{ backgroundColor: '#6c63ff' }}>
                    Sign In
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
