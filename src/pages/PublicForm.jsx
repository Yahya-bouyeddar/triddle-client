import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import api from "../api";

const PublicForm = () => {
  const { link } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({});
  const [respondentName, setRespondentName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formRes = await api.get(`/forms/url/${link}`);
        const questionsRes = await api.get(`/forms/${formRes.data.id}/questions`);
        setForm(formRes.data);
        setQuestions(questionsRes.data);
      } catch (err) {
        console.error("Erreur lors du chargement du formulaire", err);
      }
    };

    fetchData();
  }, [link]);

  const handleChange = (questionId, value) => {
    setFormData((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    try {
      await api.post(`/forms/${form.id}/responses`, {
        respondentName,
        answers: formData
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Erreur de soumission", err);
    }
  };

  if (!form) return <div className="container py-5 text-center">Chargement du formulaire...</div>;

  if (submitted) {
    return (
      <div className="container py-5 text-center">
        <CheckCircle size={64} className="text-success mb-3" />
        <h3>Merci pour votre réponse !</h3>
        <button className="btn btn-outline-primary mt-3" onClick={() => navigate("/")}>Retour à l'accueil</button>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">{form.title}</h2>
      <div className="mb-4">
        <label className="form-label">Votre nom</label>
        <input type="text" className="form-control" value={respondentName} onChange={(e) => setRespondentName(e.target.value)} required />
      </div>
      {questions.map((q) => (
        <div key={q.id} className="mb-4">
          <label className="form-label">{q.label}</label>
          {q.type === "text" && (
            <input type="text" className="form-control" onChange={(e) => handleChange(q.id, e.target.value)} />
          )}
          {q.type === "textarea" && (
            <textarea className="form-control" rows={3} onChange={(e) => handleChange(q.id, e.target.value)}></textarea>
          )}
          {q.type === "email" && (
            <input type="email" className="form-control" onChange={(e) => handleChange(q.id, e.target.value)} />
          )}
          {q.type === "number" && (
            <input type="number" className="form-control" onChange={(e) => handleChange(q.id, e.target.value)} />
          )}
          {q.type === "date" && (
            <input type="date" className="form-control" onChange={(e) => handleChange(q.id, e.target.value)} />
          )}
          {(q.type === "radio" || q.type === "checkbox") && q.options && (
            JSON.parse(q.options).map((opt, idx) => (
              <div key={idx} className="form-check">
                <input
                  className="form-check-input"
                  type={q.type}
                  name={q.id}
                  value={opt}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                />
                <label className="form-check-label">{opt}</label>
              </div>
            ))
          )}
          {q.type === "select" && q.options && (
            <select className="form-select" onChange={(e) => handleChange(q.id, e.target.value)}>
              <option value="">Sélectionner</option>
              {JSON.parse(q.options).map((opt, idx) => (
                <option key={idx} value={opt}>{opt}</option>
              ))}
            </select>
          )}
        </div>
      ))}

      <button className="btn btn-primary" onClick={handleSubmit}>Envoyer</button>
    </div>
  );
};

export default PublicForm;
