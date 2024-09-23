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

            services.AddScoped<IMascotaRepository, MascotaRepository>();

        }
    }
}