import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Move, Trash2, Plus } from "lucide-react";
import api from "../api";

const EditFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formTitle, setFormTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const resForm = await api.get(`/forms/id/${id}`);
        const resQuestions = await api.get(`/forms/${id}/questions`);

        setFormTitle(resForm.data.title);
        setQuestions(
          resQuestions.data.map((q, i) => ({
            id: q.id,
            question: q.label,
            type: q.type,
            required: q.required,
            options: q.options ? JSON.parse(q.options) : [],
          }))
        );
        setActiveQuestion(resQuestions.data[0]?.id);
      } catch (error) {
        console.error("Erreur chargement formulaire:", error);
      }
    };

    fetchForm();
  }, [id]);

  const updateQuestion = (id, field, value) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const addOption = (id) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, options: [...(q.options || []), ""] } : q
      )
    );
  };

  const updateOption = (questionId, index, value) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === questionId) {
          const updated = [...q.options];
          updated[index] = value;
          return { ...q, options: updated };
        }
        return q;
      })
    );
  };

  const addQuestion = () => {
    const newId = `new-${Date.now()}`;
    const newQuestion = {
      id: newId,
      question: "New Question",
      type: "text",
      required: true,
      options: [],
    };
    setQuestions((prev) => [...prev, newQuestion]);
    setActiveQuestion(newId);
  };

  const removeQuestion = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    if (activeQuestion === id && questions.length > 1) {
      setActiveQuestion(questions[0].id);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center mb-4">
        <Link to="/dashboard" className="btn btn-light me-3">
          <ArrowLeft size={18} />
        </Link>
        <h4 className="mb-0">{formTitle}</h4>
      </div>

      {questions.map((question) => (
        <div
          key={question.id}
          className={`card mb-3 ${
            activeQuestion === question.id ? "border-primary" : ""
          }`}
        >
          <div className="card-body" onClick={() => setActiveQuestion(question.id)}>
            <div className="d-flex align-items-start mb-3">
              <div className="me-2 text-muted">
                <Move size={18} />
              </div>
              <div className="flex-grow-1">
                <input
                  type="text"
                  className="form-control border-0 bg-transparent"
                  value={question.question}
                  onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
                  placeholder="Question"
                />
              </div>
              <div>
                <select
                  className="form-select form-select-sm"
                  value={question.type}
                  onChange={(e) => updateQuestion(question.id, "type", e.target.value)}
                >
                  <option value="text">Short Answer</option>
                  <option value="textarea">Paragraph</option>
                  <option value="radio">Radio</option>
                  <option value="checkbox">Checkboxes</option>
                  <option value="select">Dropdown</option>
                  <option value="email">Email</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                </select>
              </div>
              {questions.length > 1 && (
                <button
                  className="btn btn-sm btn-outline-danger ms-2"
                  onClick={() => removeQuestion(question.id)}
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="mb-3 ps-4">
              {(question.type === "radio" ||
                question.type === "checkbox" ||
                question.type === "select") && (
                <>
                  {question.options?.map((opt, i) => (
                    <div key={i} className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder={`Option ${i + 1}`}
                        value={opt}
                        onChange={(e) => updateOption(question.id, i, e.target.value)}
                      />
                    </div>
                  ))}
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => addOption(question.id)}
                  >
                    Add Option
                  </button>
                </>
              )}

              {question.type === "text" && (
                <input type="text" className="form-control" placeholder="Short answer text" />
              )}
              {question.type === "textarea" && (
                <textarea className="form-control" placeholder="Long answer text" rows="3"></textarea>
              )}
              {question.type === "email" && (
                <input type="email" className="form-control" placeholder="email@example.com" />
              )}
              {question.type === "number" && (
                <input type="number" className="form-control" placeholder="0" />
              )}
              {question.type === "date" && (
                <input type="date" className="form-control" />
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="d-flex justify-content-center">
        <button className="btn btn-light d-flex align-items-center shadow-sm" onClick={addQuestion}>
          <Plus size={18} className="me-2" /> Add Question
        </button>
      </div>
    </div>
  );
};

export default EditFormPage;
