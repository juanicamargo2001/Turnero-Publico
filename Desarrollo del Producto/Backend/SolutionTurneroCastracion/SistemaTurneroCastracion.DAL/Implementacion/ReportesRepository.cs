using Microsoft.EntityFrameworkCore;
using SistemaTurneroCastracion.BLL;
using SistemaTurneroCastracion.DAL.DBContext;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.DAL.Implementacion
{
    public class ReportesRepository : IReportesRepository
    {
        protected readonly CentroCastracionContext _dbContext;

        public ReportesRepository(CentroCastracionContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ResponseInformeAnimales?> ObtenerCantidadesTiposAnimales(FechasReporteRequest request)
        {

            DatosInformesAnimalesDTO? datos = await (from M in _dbContext.Mascotas
                                                     join H in _dbContext.Horarios on M.IdMascota equals H.Id_mascota
                                                     join T in _dbContext.Turnos on H.IdTurno equals T.IdTurno
                                                     where T.Dia >= request.FechaDesde && T.Dia <= request.FechaHasta
                                                     join TA in _dbContext.TiposAnimals on M.IdTipoAnimal equals TA.IdTipo
                                                     group TA by 1 into g
                                                     orderby g.Key
                                                     select new DatosInformesAnimalesDTO
                                                     {
                                                         Gatos = g.Count(x => x.TipoAnimal == "GATO"),
                                                         Perros = g.Count(x => x.TipoAnimal == "PERRO"),
                                                         Total = g.Count()
                                                     }).FirstOrDefaultAsync();

            return CalcularPorcentajeMascotas(datos);

        }


        private ResponseInformeAnimales? CalcularPorcentajeMascotas(DatosInformesAnimalesDTO? datosInforme)
        {

            if (datosInforme != null)
            {

                float porcentajeGato = Porcentaje.CalcularPorcentaje(datosInforme.Gatos, datosInforme.Total);

                float porcentajePerro = Porcentaje.CalcularPorcentaje(datosInforme.Perros, datosInforme.Total);

                return new ResponseInformeAnimales(datosInforme.Gatos, datosInforme.Perros, datosInforme.Total, porcentajeGato, porcentajePerro);
            }

            return null;
        }


        public async Task<ResponseInformeCancelacion?> ObtenerCantidadCancelaciones(FechasReporteRequest request)
        {

            DatosInformeCancelacionesDTO? datos = await (from H in _dbContext.Horarios
                                                         join E in _dbContext.Estados on H.Id_Estado equals E.IdEstado
                                                         join T in _dbContext.Turnos on H.IdTurno equals T.IdTurno
                                                         where T.Dia >= request.FechaDesde && T.Dia <= request.FechaHasta
                                                         group E by 1 into g
                                                         orderby g.Key
                                                         select new DatosInformeCancelacionesDTO()
                                                         {
                                                             Cancelados = g.Count(e => e.Nombre == EstadoTurno.Cancelado.ToString()),
                                                             Confirmados = g.Count(e => (e.Nombre == EstadoTurno.Ingresado.ToString() ||
                                                                                         e.Nombre == EstadoTurno.Realizado.ToString())),
                                                             Total = g.Count(e => (e.Nombre == EstadoTurno.Ingresado.ToString() ||
                                                                                   e.Nombre == EstadoTurno.Cancelado.ToString() ||
                                                                                   e.Nombre == EstadoTurno.Realizado.ToString()))
                                                         }).FirstOrDefaultAsync();

            return CalcularPorcentajeCancelaciones(datos);

        }


        private ResponseInformeCancelacion? CalcularPorcentajeCancelaciones(DatosInformeCancelacionesDTO? datosInforme)
        {

            if (datosInforme != null)
            {

                float porcentajeCancelados = Porcentaje.CalcularPorcentaje(datosInforme.Cancelados, datosInforme.Total);

                float porcentajeConfirmados = Porcentaje.CalcularPorcentaje(datosInforme.Confirmados, datosInforme.Total);

                return new ResponseInformeCancelacion
                   (datosInforme.Cancelados, 
                    datosInforme.Confirmados, 
                    datosInforme.Total, 
                    porcentajeCancelados, 
                    porcentajeConfirmados);
            }

            return null;
        }

    }
}
