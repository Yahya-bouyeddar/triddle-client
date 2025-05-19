import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ArrowRight } from 'lucide-react';

const HomePage = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      <nav className={`navbar navbar-expand-lg navbar-dark bg-dark ${scrolled ? 'shadow' : ''}`} style={{ transition: 'all 0.3s' }}>
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">
            <span style={{ color: '#6c63ff' }}>Form</span>Builder
          </a>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav align-items-center">
              {isLoggedIn && (
                <li className="nav-item me-3">
                  <button className="btn btn-outline-light fw-bold" onClick={() => navigate("/dashboard")}>
                    Dashboard
                  </button>
                </li>
              )}
              {!isLoggedIn ? (
                <>
                  <li className="nav-item me-3">
                    <button className="btn btn-outline-light fw-bold" onClick={() => navigate("/login")}>Login</button>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-primary fw-bold" onClick={() => navigate("/register")}>
                      Sign Up
                    </button>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <button
                    className="btn btn-danger fw-bold"
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/");
                      window.location.reload();
                    }}
                  >
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-5 py-5">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h1 className="display-4 fw-bold mb-4 text-dark">Create Powerful Forms with Ease</h1>
            <p className="lead mb-4 text-secondary">Fast, modern, and intuitive platform to create and manage forms effortlessly.</p>
            <button
              className="btn btn-primary btn-lg px-4 py-2 d-inline-flex align-items-center"
              onClick={() => navigate("/create-form")}
            >
              Get Started <ArrowRight className="ms-2" size={20} />
            </button>
          </div>
          <div className="col-lg-6 d-flex justify-content-center">
            <div className="position-relative" style={{ width: '100%', maxWidth: '500px' }}>
              <div className="bg-primary rounded-4 p-4 shadow-lg">
                <div className="bg-white rounded-3 p-3 mb-3">
                  <div className="mb-3">
                    <div className="bg-light rounded p-2 mb-2" style={{ width: '70%' }}></div>
                    <div className="bg-light rounded p-4"></div>
                  </div>
                  <div className="mb-3">
                    <div className="bg-light rounded p-2 mb-2" style={{ width: '40%' }}></div>
                    <div className="bg-light rounded p-4"></div>
                  </div>
                  <div className="d-flex justify-content-end">
                    <div className="bg-primary rounded px-4 py-2" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <h2 className="text-center mb-5 fw-bold text-dark">Features That Make Us Stand Out</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="card-title">Custom Forms</h5>
                <p className="card-text text-secondary">Build beautiful, interactive forms easily with our drag-and-drop interface.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="card-title">Analytics</h5>
                <p className="card-text text-secondary">Get real-time insights and visualizations of your form data.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <h5 className="card-title">Easy Sharing</h5>
                <p className="card-text text-secondary">Share your forms via link or embed them on your website easily.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary text-white py-5 mt-5">
        <div className="container text-center py-3">
          <h2 className="fw-bold mb-4">Ready to Get Started?</h2>
          <p className="lead mb-4">Join thousands of users who are already creating amazing forms</p>
          <button
            className="btn btn-light btn-lg px-4"
            onClick={() => navigate("/create-form")}
          >
            Create Your First Form
          </button>
        </div>
      </div>

      
      <footer className="bg-dark text-white py-4 mt-auto">
        <div className="container text-center">
          <p className="mb-0">© {new Date().getFullYear()} FormBuilder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
