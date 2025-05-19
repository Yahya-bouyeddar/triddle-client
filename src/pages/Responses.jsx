import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Download, Filter, User, BarChart2, List, ArrowLeft } from "lucide-react";
import api from "../api";

const ResponsesPage = () => {
  const { id } = useParams();
  const [viewMode, setViewMode] = useState("individual");
  const [currentResponse, setCurrentResponse] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });

  const fetchData = async () => {
    try {
      const [formRes, questionsRes, responsesRes] = await Promise.all([
        api.get(`/forms/id/${id}`),
        api.get(`/forms/${id}/questions`),
        api.get(`/forms/${id}/responses`),
      ]);

      setForm({
        title: formRes.data.title,
        description: "Réponses enregistrées pour ce formulaire."
      });

      setQuestions(questionsRes.data);

      setResponses(
        responsesRes.data.map((r) => ({
          ...r,
          data: JSON.parse(r.answers)
        }))
      );
    } catch (err) {
      console.error("Erreur lors du chargement des données", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getSummaryData = () => {
    const summary = {};
    questions.forEach((question) => {
      if (question.type === "radio") {
        summary[question.label] = {};
        JSON.parse(question.options || "[]").forEach((opt) => {
          summary[question.label][opt] = responses.filter((r) => r.data[question.id] === opt).length;
        });
      }
    });
    return summary;
  };

  const summaryData = getSummaryData();

  return (
    <div className="container-fluid">
      <div className="row">
        <header className="col-12 py-3 border-bottom bg-white">
          <div className="container-fluid d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Link to="/dashboard" className="btn btn-sm btn-light me-3">
                <ArrowLeft size={18} />
              </Link>
              <div>
                <h4 className="mb-0">{form.title}</h4>
                <p className="text-muted mb-0 small">{form.description}</p>
              </div>
            </div>
            <div>
              <button className="btn btn-light me-2">
                <Download size={18} className="me-2" /> Export
              </button>
              <button className="btn btn-primary" style={{ backgroundColor: "#6c5ce7", borderColor: "#6c5ce7" }}>
                <Filter size={18} className="me-2" /> Filter
              </button>
            </div>
          </div>
        </header>

        <main className="col-12 py-4">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-3">
                <div className="card border-0 shadow-sm mb-4">
                  <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Responses</h5>
                    <span className="badge bg-primary rounded-pill" style={{ backgroundColor: "#6c5ce7" }}>{responses.length}</span>
                  </div>
                  <div className="card-body p-0">
                    <div className="list-group list-group-flush">
                      {responses.map((response, index) => (
                        <button
                          key={response.id}
                          className={`list-group-item list-group-item-action ${currentResponse === index ? "active" : ""}`}
                          onClick={() => {
                            setCurrentResponse(index);
                            setViewMode("individual");
                          }}
                          style={currentResponse === index ? { backgroundColor: "#6c5ce7" } : {}}
                        >
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">{response.respondentName || `Répondant ${index + 1}`}</h6>
                          </div>
                          <small className="text-muted">{new Date(response.createdAt).toLocaleString()}</small>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-9">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-white">
                    <ul className="nav nav-tabs card-header-tabs">
                      <li className="nav-item">
                        <button className={`nav-link ${viewMode === "individual" ? "active" : ""}`} onClick={() => setViewMode("individual")}> <User size={18} className="me-2" /> Individual</button>
                      </li>
                      <li className="nav-item">
                        <button className={`nav-link ${viewMode === "summary" ? "active" : ""}`} onClick={() => setViewMode("summary")}> <BarChart2 size={18} className="me-2" /> Summary</button>
                      </li>
                      <li className="nav-item">
                        <button className={`nav-link ${viewMode === "questions" ? "active" : ""}`} onClick={() => setViewMode("questions")}> <List size={18} className="me-2" /> By Question</button>
                      </li>
                    </ul>
                  </div>
                  <div className="card-body">
                    {responses.length === 0 ? (
                      <div className="alert alert-info">Aucune réponse enregistrée pour ce formulaire.</div>
                    ) : (
                      <>
                        {viewMode === "individual" && (
                          <div>
                            <h5 className="mb-3">Répondant : {responses[currentResponse].respondentName}</h5>
                            <table className="table table-bordered">
                              <thead><tr><th>Question</th><th>Réponse</th></tr></thead>
                              <tbody>
                                {questions.map((q) => (
                                  <tr key={q.id}>
                                    <td>{q.label}</td>
                                    <td>{responses[currentResponse].data[q.id]}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {viewMode === "summary" && (
                          <div>
                            {Object.keys(summaryData).map((question) => (
                              <div key={question} className="mb-4">
                                <h6>{question}</h6>
                                <table className="table">
                                  <thead><tr><th>Option</th><th>Count</th></tr></thead>
                                  <tbody>
                                    {Object.entries(summaryData[question]).map(([opt, count]) => (
                                      <tr key={opt}><td>{opt}</td><td>{count}</td></tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ))}
                          </div>
                        )}

                        {viewMode === "questions" && (
                          <div>
                            {questions.map((q) => (
                              <div key={q.id} className="mb-4">
                                <h6>{q.label}</h6>
                                <ul className="list-group">
                                  {responses.map((r) => (
                                    <li key={r.id} className="list-group-item">
                                      <strong>{r.respondentName}: </strong> {r.data[q.id] || <em className="text-muted">No answer</em>}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResponsesPage;
