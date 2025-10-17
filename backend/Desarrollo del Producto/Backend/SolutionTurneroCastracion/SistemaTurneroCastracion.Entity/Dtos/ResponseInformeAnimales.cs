using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public record ResponseInformeAnimales(int Gatos, int Perros, int Total, float? PorcentajeGato, float? PorcentajePerro);
}
