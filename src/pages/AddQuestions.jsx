import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

function AddQuestions() {
  const { id } = useParams(); 
  const [label, setLabel] = useState('');
  const [type, setType] = useState('text');
  const [options, setOptions] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/forms/${id}/questions`, {
        label,
        type,
        required: true,
        options: options ? JSON.stringify(options.split(',').map(opt => opt.trim())) : null,
      });

      alert('Question ajoutée avec succès !');
      setLabel('');
      setType('text');
      setOptions('');
    } catch (err) {
      console.error('Erreur lors de l ajout de la question', err);
      alert('Erreur lors de l ajout de la question.');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Ajouter une question</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="label" className="form-label">Texte de la question</label>
          <input
            type="text"
            className="form-control"
            id="label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="type" className="form-label">Type de réponse</label>
          <select
            className="form-select"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="text">Texte</option>
            <option value="number">Nombre</option>
            <option value="radio">Choix unique (radio)</option>
            <option value="checkbox">Choix multiples (checkbox)</option>
            <option value="select">Liste déroulante (select)</option>
            <option value="file">Fichier</option>
            <option value="date">Date</option>
          </select>
        </div>

        {(type === 'radio' || type === 'checkbox' || type === 'select') && (
          <div className="mb-3">
            <label className="form-label">Options (séparées par une virgule)</label>
            <input
              type="text"
              className="form-control"
              value={options}
              onChange={(e) => setOptions(e.target.value)}
              placeholder="ex: Homme, Femme, Autre"
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary w-100">Ajouter la question</button>
      </form>
    </div>
  );
}

export default AddQuestions;
