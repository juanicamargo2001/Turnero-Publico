using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Validaciones
{
    public class MinAgeAttribute : ValidationAttribute
    {
        private readonly int _minAge;

        public MinAgeAttribute(int minAge)
        {
            _minAge = minAge;
        }

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is DateTime fechaCumpleaños)
            {
                DateTime fechaActual = DateTime.Today;

                int edad = fechaActual.Year - fechaCumpleaños.Year;

                if (fechaCumpleaños > fechaActual.AddYears(-edad)) edad--;

                if (edad >= _minAge)
                {
                    return ValidationResult.Success;
                }
            }

            return new ValidationResult($"La edad debe ser al menos de {_minAge} años");

        }
    }
}
