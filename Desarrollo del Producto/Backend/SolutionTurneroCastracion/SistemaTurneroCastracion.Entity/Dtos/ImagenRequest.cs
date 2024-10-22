using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SistemaTurneroCastracion.Entity.Dtos
{
    public class ImagenRequest
    {
        public required string Nombre {  get; set; }
        public required string Apellido { get; set; }
        public required DateTime F_Nacimiento { get; set; }
        public required string Domicilio { get; set; }
        public required long DNI { get; set; }
        public required string Email {  get; set; }
        public required int Telefono { get; set; }
        public int Id_Usuario {  get; set; }


    }
}
