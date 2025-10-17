using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class MascotaDTO
    {

        public int idMascota {  get; set; }

        public int Edad { get; set; }

        public string? Nombre { get; set; }

        public string? Descripcion { get; set; }

        public string? Sexo { get; set; }

        public string? TipoAnimal { get; set; }

        public string? Tamaño { get; set; }

        public string Raza {  get; set; }

        [JsonIgnore]
        public int? Vecino { get; set; }

    }
}
