using System;
using System.Collections.Generic;

namespace SistemaTurneroCastracion.Entity;

public partial class Tamaño
{
    public int IdTamaño { get; set; }

    public string TamañoTipo { get; set; } = null!;

    public virtual ICollection<Mascota> Mascota { get; set; } = new List<Mascota>();
}
