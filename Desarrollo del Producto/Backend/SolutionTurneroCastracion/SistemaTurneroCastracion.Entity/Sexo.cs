using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace SistemaTurneroCastracion.Entity;

public partial class Sexo
{
    public int IdSexos { get; set; }

    public string SexoTipo { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<Mascota> Mascota { get; set; } = new List<Mascota>();
}
