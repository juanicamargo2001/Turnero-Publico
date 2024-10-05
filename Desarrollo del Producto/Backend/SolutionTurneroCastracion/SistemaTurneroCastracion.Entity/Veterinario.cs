using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace SistemaTurneroCastracion.Entity;

public partial class Veterinario
{
    public int IdLegajo { get; set; }

    public int Matricula { get; set; }

    public string? Nombre { get; set; }

    public string? Apellido { get; set; }

    public long? Telefono { get; set; }

    public bool Habilitado { get; set; }

    public DateTime? FNacimiento { get; set; }

    public string? Domicilio { get; set; }

    public int? Dni { get; set; }

    public string? Email { get; set; }

    [JsonIgnore]
    public ICollection<VeterinarioxCentro>? VeterinarioxCentros { get; set; } = new List<VeterinarioxCentro>();

}
