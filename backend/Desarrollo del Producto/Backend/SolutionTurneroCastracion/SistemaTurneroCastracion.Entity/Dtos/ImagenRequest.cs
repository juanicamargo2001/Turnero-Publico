using SistemaTurneroCastracion.Entity.Validaciones;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class ImagenRequest
    {
        public string Nombre { get; set; }

        public string Apellido { get; set; }

        [MinAge(18)]
        public DateTime F_Nacimiento { get; set; }

        public string? Domicilio { get; set; }

        [Dni]
        public long DNI { get; set; }

        [RegularExpression("^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$", ErrorMessage = "El email no es valido")]
        public string Email { get; set; }

        [Required(ErrorMessage = "El telefono es requerido")]
        [RegularExpression("^(?!0+$)(\\+\\d{1,3}[- ]?)?(?!0+$)\\d{10,15}$", ErrorMessage = "Por favor ingresa un numero de telefono valido")]
        public long Telefono { get; set; }

        [Required(ErrorMessage = "La contraseña debe contener al menos una mayúscula, un número y un símbolo")]
        [RegularExpression("^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$")]
        public string Contraseña {  get; set; }

    }
}
