import { useForm } from "react-hook-form";
import loginService from "../../services/login/login.service";
import "./Perfil.css";
import Swal from "sweetalert2";
import { useState } from "react";

export default function CambiarContraseña() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false); 

  const onSubmit = async (data) => {
    if (data.nuevaContraseña !== data.contraseñaAnterior) {
      const passwordRequest = {
        contraseñaAnterior: data.contraseñaAnterior,
        nuevaContraseña: data.nuevaContraseña,
      };

      try {
        const response = await loginService.changePassword(passwordRequest);
        console.log(response);
        Swal.fire({
          title: "¡Éxito!",
          text: "Contraseña cambiada con éxito.",
          icon: "success",
          confirmButtonColor: "#E15562",
          confirmButtonText: "OK",
        }).then(() => {
          reset();
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      Swal.fire({
        title: "¡Error!",
        text: "La nueva contraseña debe ser diferente a la anterior",
        icon: "error",
        confirmButtonColor: "#E15562",
        confirmButtonText: "OK",
      }).then(() => {
        reset();
      });
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="titulo-form">Cambiar contraseña</h3>
      <form className="formulario-contraseña" onSubmit={handleSubmit(onSubmit)}>
        <div className="campo-contraseña">
          <label
            htmlFor="contraseñaAnterior"
            className="form-label"
            style={{ fontSize: "0.96rem" }}
          >
            Ingrese la contraseña anterior
          </label>
          <input
            type={showOldPassword ? "text" : "password"}
            className="form-control"
            id="contraseñaAnterior"
            placeholder="Ingresar contraseña actual"
            {...register("contraseñaAnterior", {
              required: "La contraseña anterior es requerida",
            })}
          />
          <span
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="botonOjo"
              style={{
                marginTop: "-35px",
                marginLeft: "95%",
                position: "relative",
                zIndex: 2
              }}
            >
              {showOldPassword ? (
                <i className="fa-solid fa-eye"></i>
              ) : (
                <i className="fa-solid fa-eye-slash"></i>
              )}
            </span>
          {errors.contraseñaAnterior && (
            <p style={{ color: "red" }}>{errors.contraseñaAnterior.message}</p>
          )}
        </div>
        <div className="campo-grid">
          <div className="campo-contraseña">
            <label
              htmlFor="nuevaContraseña"
              className="form-label"
              style={{ fontSize: "0.96rem" }}
            >
              Ingrese la contraseña nueva
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              id="nuevaContraseña"
              placeholder="Ingrese nueva contraseña"
              {...register("nuevaContraseña", {
                required: "La contraseña es obligatoria",
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres",
                },
                pattern: {
                  value:
                    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                  message:
                    "La contraseña debe contener al menos una mayúscula, un número y un símbolo",
                },
              })}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                marginTop: "-35px",
                marginLeft: "88%",
                position: "relative",
                zIndex: 2
              }}
            >
              {showPassword ? (
                <i className="fa-solid fa-eye"></i>
              ) : (
                <i className="fa-solid fa-eye-slash"></i>
              )}
            </span>
            {errors.nuevaContraseña && (
              <p style={{ color: "red" }}>{errors.nuevaContraseña.message}</p>
            )}
          </div>

          <div className="campo-contraseña">
            <label
              htmlFor="nuevaContraseñaConfirm"
              className="form-label"
              style={{ fontSize: "0.96rem" }}
            >
              Confirme la contraseña nueva
            </label>
            <input
              type="password"
              className="form-control"
              id="nuevaContraseñaConfirm"
              placeholder="Vuelva a ingresar nueva contraseña"
              {...register("nuevaContraseñaConfirm", {
                required: "Confirme la contraseña nueva",
                validate: (value) =>
                  value === watch("nuevaContraseña") ||
                  "Las contraseñas no coinciden",
              })}
              onPaste={(event) => event.preventDefault()}
            />
            {errors.nuevaContraseñaConfirm && (
              <p style={{ color: "red" }}>
                {errors.nuevaContraseñaConfirm.message}
              </p>
            )}
          </div>
        </div>

        <div className="boton-container">
          <button type="submit" className="btn btn-guardar confir">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}
