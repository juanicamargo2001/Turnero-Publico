using SistemaTurneroCastracion.DAL.DBContext;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Implementacion
{
    public class CorreosProgramadosRepository : GenericRepository<CorreosProgramados>, ICorreosProgramados
    {
        protected readonly CentroCastracionContext _dbContext;

        public CorreosProgramadosRepository(CentroCastracionContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }


        public async Task<bool> GuardarCorreo(EmailDTO datosEmail, int id_horario)
        {
            var creado = await this.Crear(new CorreosProgramados 
            {
                FechaEnvio = DateTime.Parse(datosEmail.Fecha),
                Estado = EstadoCorreo.Pendiente.ToString(),
                EmailDestino = datosEmail.Email,
                NombreCompleto = datosEmail.Nombre,
                Hora = TimeSpan.Parse(datosEmail.Hora),
                CentroCastracion = datosEmail.CentroCastracion,
                TipoAnimal = datosEmail.Tipo,
                IdHorario = id_horario
            });

            if (creado == null) { 
            
                return false;
            }

            return true;

        }


    }
}
