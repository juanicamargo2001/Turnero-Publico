using Microsoft.AspNetCore.Mvc;
using SistemaTurneroCastracion.DAL.Implementacion;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity.Dtos;
using SistemaTurneroCastracion.Entity;


namespace SistemaTurneroCastracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VeterinarioXCentroController : ControllerBase
    {
        private readonly IVeterinarioXCentroRepository _veterinarioXCentro;

        public VeterinarioXCentroController(IVeterinarioXCentroRepository veterinarioRepository)
        {
            _veterinarioXCentro = veterinarioRepository;
        }

        [HttpPost]
        public async Task<IActionResult> crearVeterinarioXCentro([FromBody] VeterinarioXCentroDTO veterinarioxCentroDTO)
        {
            if (veterinarioxCentroDTO == null)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, Message = "No se ingreso bien los datos!", Result = "" });
            }

            bool veterinarioXCentroNuevo = await _veterinarioXCentro.crearVeterinarioXCentro(veterinarioxCentroDTO.Legajo, veterinarioxCentroDTO.CentroNombre);

            if (!veterinarioXCentroNuevo)
            {
                return BadRequest(new ValidacionResultadosDTO { Success = false, 
                                                                Message = "El legajo o el centro de castración no existen. Como también puede que estén repetidos o no habilitados!", 
                                                                Result = "" });

            }

            return Ok(new ValidacionResultadosDTO { Success = true, Message = "Ok", Result = veterinarioXCentroNuevo });

        }
        [HttpDelete]
        public async Task<IActionResult> eliminarVeterinarioXCentro([FromBody] VeterinarioXCentroDTO veterinarioXCentroDTO)
        {

            bool veterinarioXCentroBorrado = await _veterinarioXCentro.eliminarVeterinarioXCentro(veterinarioXCentroDTO.Legajo, veterinarioXCentroDTO.CentroNombre);

            if (!veterinarioXCentroBorrado)
            {
                return BadRequest(new ValidacionResultadosDTO
                {
                    Success = false,
                    Message = "El centro de castración con el nombre especificado no existe o no existe el registro con ese veterinario!",
                    Result = ""
                });

            }

            return NoContent();

        }



    }
}
