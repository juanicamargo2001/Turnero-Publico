using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SistemaTurneroCastracion.DAL.DBContext;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SistemaTurneroCastracion.DAL.Implementacion;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity;
using SistemaTurneroCastracion.BLL.Interfaces;
using SistemaTurneroCastracion.BLL.Seguridad;
using SistemaTurneroCastracion.DAL.Publisher;
using SistemaTurneroCastracion.DAL.Consumer;

namespace SistemaTurneroCastracion.IOC
{
    public static class Dependencia
    {
        public static void InyectarDependencias(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<CentroCastracionContext>(options =>
            {
                options.UseSqlServer(configuration.GetConnectionString("CadenaSQL"));
            });

            services.AddTransient(typeof(IGenericRepository<>), typeof(GenericRepository<>));

            services.AddScoped<EmailPublisher>();

            services.AddScoped<EmailConsumer>();

            services.AddScoped<IMascotaRepository, MascotaRepository>();

            services.AddScoped<ISexoRepository, SexoRepository>();

            services.AddScoped<ITipoAnimalRepository, TipoAnimalRepository>();

            services.AddScoped<ITamañoRepository, TamañoRepository>();

            services.AddScoped<IVeterinarioRepository, VeterinarioRepository>();

            services.AddScoped<ICentroCastracionRepository, CentroCastracionRepository >();

            services.AddScoped<IVeterinarioXCentroRepository, VeterinarioXCentroRepository>();

            services.AddScoped<IAgendaRepository, AgendaRepository>();

            services.AddScoped<ITurnosRepository, TurnosRepository>();

            services.AddScoped<IHorariosRepository, HorariosRepository>();

            services.AddScoped<IVecinoRepository, VecinoRepository>();

            services.AddScoped<IUsuarioRepository, UsuarioRepository>();

            services.AddScoped<IRolRepository, RolRepository>();

            services.AddScoped<IAutorizacionService, AutorizacionService>();

            services.AddScoped<Validaciones>();



        }
    }
}