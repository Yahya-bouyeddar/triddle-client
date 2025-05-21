import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Home as HomeIcon,
  Plus,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
} from "lucide-react";
import api from "../api";

const DashboardPage = () => {
  const [forms, setForms] = useState([]);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await api.get("/forms");
        setForms(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement des formulaires", error);
      }
    };

    fetchForms();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
          style={{ minHeight: "100vh" }}
        >
          <div className="position-sticky pt-3">
            <div className="d-flex align-items-center justify-content-center mb-4">
              <h5 className="mb-0" style={{ color: "#6c5ce7" }}>
                FormBuilder
              </h5>
            </div>
            <ul className="nav flex-column">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  href="#"
                  style={{ color: "#6c5ce7" }}
                >
                  <FileText className="me-2" size={18} />
                  My Forms
                </a>
              </li>
            </ul>
          </div>
        </div>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
          <div className="d-flex justify-content-end align-items-center mt-4 mb-3">
            <Link
              to="/"
              className="btn btn-lg btn-primary d-flex align-items-center"
              style={{
                backgroundColor: "#6c5ce7",
                borderColor: "#6c5ce7",
                fontWeight: "bold",
                fontSize: "1.2rem",
                boxShadow: "0 2px 8px rgba(108,99,255,0.15)",
              }}
            >
              <HomeIcon size={24} className="me-2" />
              Accueil
            </Link>
          </div>

          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">My Forms</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <Link
                to="/create-form"
                className="btn btn-primary d-flex align-items-center"
                style={{ backgroundColor: "#6c5ce7", borderColor: "#6c5ce7" }}
              >
                <Plus size={18} className="me-1" /> Create Form
              </Link>
            </div>
          </div>

          {/* Affichage conditionnel si aucun formulaire */}
          {forms.length === 0 ? (
            <div
              className="d-flex flex-column align-items-center justify-content-center"
              style={{ minHeight: "40vh" }}
            >
              <FileText size={64} className="mb-3 text-secondary" />
              <h4 className="mb-2 text-secondary">
                Aucun formulaire pour l'instant
              </h4>
              <p
                className="mb-4 text-muted text-center"
                style={{ maxWidth: 400 }}
              >
                Créez votre premier formulaire pour commencer à collecter des
                réponses facilement et rapidement.
              </p>
              <Link
                to="/create-form"
                className="btn btn-lg btn-primary d-flex align-items-center"
                style={{ backgroundColor: "#6c5ce7", borderColor: "#6c5ce7" }}
              >
                <Plus size={20} className="me-2" />
                Créer mon premier formulaire
              </Link>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-4">
              {forms.map((form) => (
                <div className="col" key={form.id}>
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="card-title">{form.title}</h5>
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-light"
                            type="button"
                            id={`dropdown-${form.id}`}
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <MoreVertical size={18} />
                          </button>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby={`dropdown-${form.id}`}
                          >
                            <li>
                              <a className="dropdown-item" href="#">
                                <Edit size={16} className="me-2" /> Edit
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                <Eye size={16} className="me-2" /> Preview
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                <Trash2 size={16} className="me-2" /> Delete
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <p className="card-text text-muted">
                        Last updated: {form.updatedAt?.split("T")[0]}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <span className="badge bg-light text-dark">
                          <BarChart2 size={14} className="me-1" />{" "}
                          {form._count?.responses || 0} Responses
                        </span>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/forms/${form.id}/responses`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            View
                          </Link>
                          <Link
                            to={`/forms/${form.id}/edit`}
                            className="btn btn-sm btn-warning me-2"
                          >
                            Edit
                          </Link>
                          {/* <Link to={`/forms/${form.publicUrl}`} className="btn btn-sm btn-primary" style={{ backgroundColor: "#6c5ce7", borderColor: "#6c5ce7" }}>
                          Share
                        </Link> */}
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => {
                              const url = `${window.location.origin}/forms/${form.publicUrl}`;
                              navigator.clipboard.writeText(url);
                              alert("Lien copié !");
                            }}
                          >
                            Copy Link
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
