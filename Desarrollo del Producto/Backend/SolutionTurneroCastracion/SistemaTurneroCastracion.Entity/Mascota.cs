using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace SistemaTurneroCastracion.Entity;

public partial class Mascota
{
    public int IdMascota { get; set; }

    public int IdTipoAnimal { get; set; }

    public int IdSexo { get; set; }

    public int IdTamaño { get; set; }

    public int? IdVecino { get; set; }

    public int Edad { get; set; }

    public string? Nombre { get; set; }

    public string? Descripcion { get; set; }


    [JsonIgnore]
    public virtual Sexo? IdSexoNavigation { get; set; } = null!;

    [JsonIgnore]
    public virtual Tamaño? IdTamañoNavigation { get; set; } = null!;

    [JsonIgnore]
    public virtual TiposAnimal? IdTipoAnimalNavigation { get; set; } = null!;
}
