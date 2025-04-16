using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace SistemaTurneroCastracion.Entity;

public partial class TiposAnimal
{
    public int IdTipo { get; set; }

    public string TipoAnimal { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<Mascota> Mascota { get; set; } = new List<Mascota>();

    [JsonIgnore]
    public virtual ICollection<Razas> Razas { get; set; } = [];
}
