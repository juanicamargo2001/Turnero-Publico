import { useForm } from 'react-hook-form';
import { vecinoService } from '../../services/vecino.service';

const Paso3Visual = ({updateFormData, prevStep, formData}) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onFormSubmit = (data) => {
        try {
            if (!formData.fNacimiento.includes("T")) {
                formData.f_Nacimiento = formData.fNacimiento;
                delete formData.fNacimiento;
            }
            formData.domicilio = "";
            formData.id_Usuario = 0;
            
            vecinoService.Grabar(formData);
            alert("Vecino registrado correctamente");
            
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
            alert("Ocurrió un error al enviar los datos. Por favor, inténtelo de nuevo.");
        }
    };

    return(
        <div>
            <h2 className="maven-pro-title">DATOS DE CUENTA</h2>
            <form className="maven-pro-body" onSubmit={handleSubmit(onFormSubmit)}>
                {/*ACA VA LA PARTE DE EL USUARIO QUE VA EN OTRA SPRINT*/}
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