using System;
using System.Collections.Generic;

namespace SistemaTurneroCastracion.Entity;

public partial class Sexo
{
    public int IdSexos { get; set; }

    public string Sexo1 { get; set; } = null!;

    public virtual ICollection<Mascota> Mascota { get; set; } = new List<Mascota>();
}
