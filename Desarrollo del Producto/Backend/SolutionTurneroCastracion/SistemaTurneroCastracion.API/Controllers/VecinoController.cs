using Microsoft.AspNetCore.Mvc;
using SistemaTurneroCastracion.DAL.Interfaces;
using SistemaTurneroCastracion.Entity.Dtos;


namespace SistemaTurneroCastracion.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VecinoController : ControllerBase
    {

        private readonly IVecinoRepository _vecinoRepository;


        public VecinoController(IVecinoRepository vecinoRepository)
        {
            _vecinoRepository = vecinoRepository;
        }


        [HttpPost]
        public async Task<IActionResult> ProcesarImagen([FromBody] ImagenRequest request)
        {
            if (string.IsNullOrEmpty(request.ImagenBase64))
            {
                return BadRequest("La imagen no fue proporcionada.");
            }

            bool textoExtraido = await _vecinoRepository.analizarDNIConReglas(request.ImagenBase64);

                return Ok(new { texto = true });
            }
    }
}

