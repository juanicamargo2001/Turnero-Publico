import { useForm } from 'react-hook-form';

const Paso2Visual = ({updateFormData, nextStep, prevStep, formData}) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onFormSubmit = (data) => {
      console.log(data)
        updateFormData(data);

        nextStep();
    };

    return(
        <div className='page-container'>
            <h2 className="maven-pro-title">DATOS DE CONTACTO</h2>
            <form className="maven-pro-body" onSubmit={handleSubmit(onFormSubmit)}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Escriba su email"
                  defaultValue={formData.email}
                  {...register('email', {
                    required: 'El email es obligatorio',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'El formato del email es inválido'
                    }
                  })}
                />
                {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
              </div>

              <div className="mb-3">
                <label htmlFor="telefono" className="form-label">Teléfono</label>
                <input
                  type="text"
                  className="form-control"
                  id="telefono"
                  placeholder="Escriba su teléfono"
                  defaultValue={formData.telefono}
                  {...register('telefono', {
                    required: 'El teléfono es obligatorio',     
                    pattern: {
                      value: /^(?!0+$)(\+\d{1,3}[- ]?)?(?!0+$)\d{10,15}$/,
                      message: 'El formato del telefono no es inválido'
                    },                   
                  })}
                />
                {errors.telefono && <p style={{ color: 'red' }}>{errors.telefono.message}</p>}
              </div>
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-secondary confir"
                  onClick={prevStep}
                >
                  Volver
                </button>
                <button type="submit" className="btn btn-success confir">
                  Continuar
                </button>
              </div>
            </form>
        </div>
    )
}

export default Paso2Visual;