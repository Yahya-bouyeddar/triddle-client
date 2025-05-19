import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function RegistrationPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      const res = await api.post('/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
    console.log(res.data)
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (error) {
      alert('Erreur à l inscription : ' + (error.response?.data?.message || 'Erreur serveur'));
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center">
      <div className="container">
        <div className="card border-0 rounded-4 shadow overflow-hidden" style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div className="row g-0">
            <div className="col-lg-6 d-none d-lg-block" style={{ background: 'linear-gradient(135deg, #6f42c1 0%, #6610f2 100%)' }}>
              <div className="d-flex flex-column h-100 justify-content-center text-white p-5">
                <h1 className="display-5 fw-bold text-center mb-3">Create, Share, Collect</h1>
                <p className="lead text-center opacity-75">Your forms, your data, simplified.</p>
              </div>
            </div>

            <div className="col-lg-6 col-md-12">
              <div className="d-flex align-items-center justify-content-center min-vh-100">
                <div className="bg-white rounded shadow-sm p-4 p-lg-5" style={{ maxWidth: '500px', width: '100%' }}>
                  <div className="text-center mb-4">
                    <span className="text-muted">Already a member?</span> <a href="/login" className="text-primary fw-bold">Login now</a>
                  </div>

                  <h2 className="fw-bold text-center mb-4">Join Us Today!</h2>
                  <p className="text-center text-muted mb-4">Create your account and get started</p>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <input type="text" className="form-control py-2" placeholder="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                      <input type="email" className="form-control py-2" placeholder="Email Address" name="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="mb-3 input-group">
                      <input type={showPassword ? "text" : "password"} className="form-control py-2" placeholder="Password" name="password" value={formData.password} onChange={handleChange} required />
                      <button className="input-group-text bg-white" type="button" onClick={() => setShowPassword(!showPassword)}>
                        <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-muted`}></i>
                      </button>
                    </div>

                    <div className="mb-4 input-group">
                      <input type={showConfirmPassword ? "text" : "password"} className="form-control py-2" placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                      <button className="input-group-text bg-white" type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} text-muted`}></i>
                      </button>
                    </div>

                    <div className="mb-4 form-check">
                      <input type="checkbox" className="form-check-input" id="terms" required />
                      <label className="form-check-label" htmlFor="terms">
                        I agree to all <a href="#" className="text-primary">Terms of Service</a>
                      </label>
                    </div>

                    <button type="submit" className="btn w-100 py-2 mb-4" style={{ background: 'linear-gradient(to right, #6f42c1, #6610f2)', color: 'white' }}>
                      Sign Up
                    </button>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
