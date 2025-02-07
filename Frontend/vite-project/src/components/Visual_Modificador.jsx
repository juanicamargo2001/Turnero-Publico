import { useState, useEffect } from 'react';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { Spanish } from "flatpickr/dist/l10n/es.js";

const Modal = ({ show, handleClose, item, onSubmitSort }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (item) {
      setFormData(item); // Inicializa el formulario con los valores del ítem
    }
  }, [item]);

  const handleInputChange = (e) => {
    let value = null;
    if (e[0] instanceof Date){value = e[0];} 
    else if(e.target.tagName === 'SELECT') {value = e.target.value === 'true';}
    else {
      value = e.target.value;
    }
    setFormData({
      ...formData,
      [e.target.id]: value, // Actualiza el estado con el nuevo valor
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitSort(formData);
    handleClose(); // Cierra el modal después de modificar
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title text-center w-100">Modificar Elemento</h4>
            {/*<button type="button" className="close" onClick={handleClose} aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>*/}
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <ul className="list-unstyled">
              {Object.keys(formData).map((key) => (
                  <li key={key}>
                    <label htmlFor={key}>{key[0].toUpperCase() + key.substring(1)}:</label>
                    {typeof formData[key] === 'boolean' ? (
                      <select
                        name={key}
                        id={key}
                        value={formData[key]}
                        onChange={handleInputChange}
                        className="form-control"
                      >
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                      </select>
                    ) : typeof formData[key] === 'string' ? (
                      <input
                        type="text"
                        name={key}
                        id={key}
                        value={formData[key]}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    ) : typeof formData[key] === 'number' ? (
                      <input
                        type="number"
                        name={key}
                        id={key}
                        value={formData[key]}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    ) : (
                      <Flatpickr
                        value={formData[key]}
                        onChange={(date) => handleInputChange(date, key)}
                        options={{ 
                          altInput: true,
                          altFormat: "F j, Y",
                          dateFormat: "YYYY-mm-ddThh:mm:ss",
                          locale: Spanish,
                        }}
                        className="form-control"
                        placeholder={formData[key]}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={handleClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">Guardar Cambios</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;


