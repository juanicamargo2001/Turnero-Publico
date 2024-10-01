import React, { useState, useEffect } from 'react';

const Modal = ({ show, handleClose, item, onSubmitSort }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (item) {
      setFormData(item); // Inicializa el formulario con los valores del ítem
    }
  }, [item]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Actualiza el estado con el nuevo valor
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
                    <label htmlFor={key}>{key}:</label>
                    {typeof formData[key] === 'boolean' ? (
                      <select
                        name={key}
                        id={key}
                        value={formData[key].toString()} // Convertir boolean a string para select
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
                      <input
                        type="date"
                        name={key}
                        id={key}
                        value={formData[key].substring(0, 10)} // Asegúrate de que sea en formato YYYY-MM-DD
                        onChange={handleInputChange}
                        className="form-control"
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


