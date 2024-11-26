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
    public class SecretariaXCentroRepository : GenericRepository<SecretariaxCentro>, ISecretariaXCentroRepository
    {

        protected readonly CentroCastracionContext _dbContext;
        private readonly IUsuarioRepository _usuarioRepository;

        public SecretariaXCentroRepository(CentroCastracionContext dbContext, IUsuarioRepository usuarioRepository) : base(dbContext)
        {
            _dbContext = dbContext;
            _usuarioRepository = usuarioRepository;
        }

        public async Task<bool> CrearSecretariaxCentro(SecretariaUsuarioDTO secretariaRegistro)
        {

            int? secretariaId = await _usuarioRepository.crearUsuario(secretariaRegistro.Nombre, secretariaRegistro.Apellido, 
                                                                      secretariaRegistro.Contraseña, secretariaRegistro.Email,
                                                                      RolesEnum.secretaria.ToString());

            if (secretariaId.HasValue)
            {
                
                SecretariaxCentro crearSecretariaXCentro = await this.Crear(new SecretariaxCentro 
                                                                            { IdUsuario = (int) secretariaId, 
                                                                            IdCentroCastracion = secretariaRegistro.IdCentroCastracion
                }); 
                
                if (crearSecretariaXCentro != null)
                {
                    return true;
                }

                return false;
            }
            return false;
        }



    }
}
