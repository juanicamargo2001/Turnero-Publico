using System;
using System.Collections.Generic;

namespace SistemaTurneroCastracion.Entity;

public partial class TiposAnimal
{
    public int IdTipo { get; set; }

    public string TipoAnimal { get; set; } = null!;

    public virtual ICollection<Mascota> Mascota { get; set; } = new List<Mascota>();
}
