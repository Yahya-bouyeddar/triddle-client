import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Settings, Move } from "lucide-react";
import api from "../api";

const CreateFormPage = () => {
  const [formTitle, setFormTitle] = useState("Form title");
  const [formDescription, setFormDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(1);
  const navigate = useNavigate();

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      type: "text",
      question: "Enter Question",
      required: true,
      options: [],
    };
    setQuestions([...questions, newQuestion]);
    setActiveQuestion(newQuestion.id);
  };

  const removeQuestion = (id) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id));
      setActiveQuestion(questions[0].id);
    }
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const addOption = (id) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === id) {
          const newOptions = [...(q.options || []), ""];
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  const updateOption = (questionId, index, value) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const updatedOptions = [...(q.options || [])];
          updatedOptions[index] = value;
          return { ...q, options: updatedOptions };
        }
        return q;
      })
    );
  };

  const handleSave = async () => {
    if (!formTitle || questions.length === 0) {
      alert("Le formulaire doit avoir un titre et au moins une question.");
      return;
    }

    try {
      const res = await api.post("/forms", { title: formTitle });
      const formId = res.data.id;

      for (const q of questions) {
        await api.post(`/forms/${formId}/questions`, {
          label: q.question,
          type: q.type,
          required: q.required,
          options: q.options?.length ? JSON.stringify(q.options) : null,
        });
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Erreur lors de la création du formulaire", err);
      alert("Erreur lors de la création du formulaire.");
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <header className="col-12 py-3 border-bottom bg-white">
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <Link to="/dashboard" className="btn btn-sm btn-light me-3">
                  <ArrowLeft size={18} />
                </Link>
                <div>
                  <input
                    type="text"
                    className="form-control-plaintext form-control-lg fw-bold p-0 m-0"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    style={{ width: "300px" }}
                  />
                </div>
              </div>
              <div>
                <button className="btn btn-light me-2">Preview</button>
                <button
                  className="btn btn-primary"
                  style={{ backgroundColor: "#6c5ce7", borderColor: "#6c5ce7" }}
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </header>

        <main
          className="col-12 py-4 bg-light"
          style={{ minHeight: "calc(100vh - 60px)" }}
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="card mb-4 border-0 shadow-sm">
                  <div className="card-body">
                    <input
                      type="text"
                      className="form-control form-control-lg border-0 mb-3"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="Form Title"
                    />
                    <textarea
                      className="form-control border-0"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Form Description (optional)"
                      rows="2"
                    ></textarea>
                  </div>
                </div>

                {questions.map((question) => (
                  <div
                    key={question.id}
                    className={`card mb-3 border-0 shadow-sm ${activeQuestion === question.id ? "border-primary" : ""}`}
                    onClick={() => setActiveQuestion(question.id)}
                  >
                    <div className="card-body">
                      <div className="d-flex align-items-start mb-3">
                        <div className="me-2 text-muted">
                          <Move size={18} />
                        </div>
                        <div className="flex-grow-1">
                          <input
                            type="text"
                            className="form-control border-0 bg-transparent"
                            value={question.question}
                            onChange={(e) =>
                              updateQuestion(
                                question.id,
                                "question",
                                e.target.value
                              )
                            }
                            placeholder="Question"
                          />
                        </div>
                        <div>
                          <select
                            className="form-select form-select-sm"
                            value={question.type}
                            onChange={(e) =>
                              updateQuestion(
                                question.id,
                                "type",
                                e.target.value
                              )
                            }
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
                                  onChange={(e) =>
                                    updateOption(question.id, i, e.target.value)
                                  }
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
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Short answer text"
                          />
                        )}
                        {question.type === "textarea" && (
                          <textarea
                            className="form-control"
                            placeholder="Long answer text"
                            rows="3"
                          ></textarea>
                        )}
                        {question.type === "email" && (
                          <input
                            type="email"
                            className="form-control"
                            placeholder="email@example.com"
                          />
                        )}
                        {question.type === "number" && (
                          <input
                            type="number"
                            className="form-control"
                            placeholder="0"
                          />
                        )}
                        {question.type === "date" && (
                          <input type="date" className="form-control" />
                        )}
                      </div>

                      <div className="d-flex justify-content-between align-items-center ps-4">
                        {questions.length > 1 && (
                          <div>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => removeQuestion(question.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="d-flex justify-content-center mb-4">
                  <button
                    className="btn btn-light d-flex align-items-center shadow-sm"
                    onClick={addQuestion}
                  >
                    <Plus size={18} className="me-2" /> Add Question
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateFormPage;
