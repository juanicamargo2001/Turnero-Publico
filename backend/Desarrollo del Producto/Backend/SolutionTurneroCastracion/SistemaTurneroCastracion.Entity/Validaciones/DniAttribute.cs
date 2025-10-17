using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Validaciones
{
    public class DniAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)

        {
            if (value == null)
            {
                return new ValidationResult("El DNI no puede ser nulo.");
            }


            if (value is long dni)
            {

                string pattern = @"^[\d]{1,3}\.?[\d]{3,3}\.?[\d]{3,3}$";
                Regex regex = new(pattern);

                if (regex.IsMatch(dni.ToString()))
                {
                    return ValidationResult.Success;
                }
            }
             
            return new ValidationResult($"El DNI debe ser un número.");
            
        }


    }
}
