using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.BLL
{
    public static class Porcentaje
    {
        public static float CalcularPorcentaje(int cantidad, int total)
        {
            float porcentaje = 0;

            if (total > 0)
            {
                porcentaje = (float)Math.Round((((float)cantidad / total) * 100), 2);

                return porcentaje;
            }

            return porcentaje;

        }
    }
}
