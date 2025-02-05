import { useForm } from 'react-hook-form';
import { vecinoService } from '../../services/vecino/vecino.service';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';

const Paso3Visual = ({updateFormData, prevStep, formData}) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();

    const onFormSubmit = async (data) => {
        try {
            formData.contraseña = data.contraseña;
            console.log("FORMDATA: ", formData);
            /*if (!formData.fNacimiento.includes("T")) {
                formData.f_Nacimiento = formData.fNacimiento;
                delete formData.fNacimiento;
            }*/
            formData.domicilio = "";
            formData.id_Usuario = 0;
            
            await vecinoService.Grabar(formData);
            Swal.fire({
                    title: "¡Éxito!",
                    text: "Vecino registrado con éxito.",
                    icon: "success",
                    confirmButtonColor: "#E15562",
                    confirmButtonText: "OK",
                  }).then(() => {
                    navigate("/iniciarsesion")
                });
            
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            Swal.fire({
                title: "¡Error!",
                text: "Ocurrió un error al enviar los datos. Por favor, inténtelo de nuevo.",
                icon: "error",
                confirmButtonColor: "#E15562",
                confirmButtonText: "OK",
              }).then(() => {
            });
        }
    };

    return(
        <div className='page-container'>
            <h2 className="maven-pro-title ">DATOS DE CUENTA</h2>
            <form className="maven-pro-body" onSubmit={handleSubmit(onFormSubmit)}>
              <div className="mb-3">
                <label htmlFor="contraseña" className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  id="contraseña"
                  placeholder={"Escriba su contraseña"}
                  defaultValue={formData.contraseña}
                  {...register('contraseña', { required: 'La contraseña es obligatoria' })}                  
                />
                {errors.contraseña && <p style={{ color: 'red' }}>{errors.contraseña.message}</p>}
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
                    Finalizar
                    </button>
              </div>
            </form>
        </div>
    )
}

export default Paso3Visual;