using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using SistemaTurneroCastracion.Entity;

namespace SistemaTurneroCastracion.DAL.DBContext;

public partial class CentroCastracionContext : DbContext
{
    public CentroCastracionContext()
    {
    }

    public CentroCastracionContext(DbContextOptions<CentroCastracionContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Mascota> Mascotas { get; set; }

    public virtual DbSet<Sexo> Sexos { get; set; }

    public virtual DbSet<Tamaño> Tamaños { get; set; }

    public virtual DbSet<TiposAnimal> TiposAnimals { get; set; }

    public virtual DbSet<Veterinario> Veterinarios { get; set; }

    public virtual DbSet<CentroCastracion> Centros { get; set; } 

    public virtual DbSet<VeterinarioxCentro> VeterinarioxCentros { get; set; }

    public virtual DbSet<Agenda> Agenda { get; set; }

    public virtual DbSet<Feriados> Feriados { get; set; }

    public virtual DbSet<Turnos> Turnos { get; set; }

    public virtual DbSet<Horarios> Horarios { get; set; }

    public virtual DbSet<Vecino> Vecinos { get; set; }

    public virtual DbSet<TipoTurno> TipoTurnos { get; set; }

    public virtual DbSet<Usuario> Usuarios { get; set; }

    public virtual DbSet<Rol> Roles { get; set; }

    public virtual DbSet<HistorialRefreshToken> HistorialRefreshTokens { get; set; }

    public virtual DbSet<Estado> Estados { get; set; }

    public virtual DbSet<CorreosProgramados> CorreosProgramados { get; set; }

    public virtual DbSet<SecretariaxCentro> SecretariaxCentros { get; set; }

    public virtual DbSet<Medicacion> Medicacion { get; set; }

    public virtual DbSet<MedicacionxHorario> MedicacionxHorarios { get; set; }

    public virtual DbSet<UnidadMedida> UnidadMedidas { get; set; }


    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) { }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Mascota>(entity =>
        {
            entity.HasKey(e => e.IdMascota).HasName("PK_mascotas");

            entity.ToTable("mascotas");

            entity.Property(e => e.IdMascota).HasColumnName("id_mascota");
            entity.Property(e => e.Descripcion)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("descripcion");
            entity.Property(e => e.Edad).HasColumnName("edad");
            entity.Property(e => e.IdSexo).HasColumnName("id_sexo");
            entity.Property(e => e.IdTamaño).HasColumnName("id_tamaño");
            entity.Property(e => e.IdTipoAnimal).HasColumnName("id_tipo_animal");
            entity.Property(e => e.IdVecino).HasColumnName("id_vecino");
            entity.Property(e => e.Nombre)
                .HasMaxLength(25)
                .IsUnicode(false)
                .HasColumnName("nombre");

            entity.HasOne(d => d.IdSexoNavigation).WithMany(p => p.Mascota)
                .HasForeignKey(d => d.IdSexo)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_mascotas_sexo");

            entity.HasOne(d => d.IdTamañoNavigation).WithMany(p => p.Mascota)
                .HasForeignKey(d => d.IdTamaño)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_mascotas_tamaño");

            entity.HasOne(d => d.IdTipoAnimalNavigation).WithMany(p => p.Mascota)
                .HasForeignKey(d => d.IdTipoAnimal)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_mascotas_tipo_animal");


            entity.HasOne(m => m.Vecino)
            .WithMany(v => v.Mascotas)
            .HasForeignKey(e => e.IdVecino)
            .HasConstraintName("FK_vecino");

            entity.Property(e => e.EstaCastrado)
            .HasColumnName("es_castrado")
            .HasDefaultValueSql("0");

        });

        modelBuilder.Entity<Sexo>(entity =>
        {
            entity.HasKey(e => e.IdSexos).HasName("PK_sexos");

            entity.ToTable("sexos");

            entity.Property(e => e.IdSexos).HasColumnName("id_sexos");
            entity.Property(e => e.SexoTipo)
                .HasMaxLength(10)
                .IsUnicode(false)
                .HasColumnName("sexo");
        });

        modelBuilder.Entity<Tamaño>(entity =>
        {
            entity.HasKey(e => e.IdTamaño).HasName("PK_tamaños");

            entity.ToTable("tamaños");

            entity.Property(e => e.IdTamaño).HasColumnName("id_tamaño");
            entity.Property(e => e.TamañoTipo)
                .HasMaxLength(7)
                .IsUnicode(false)
                .HasColumnName("tamaño");
        });

        modelBuilder.Entity<TiposAnimal>(entity =>
        {
            entity.HasKey(e => e.IdTipo).HasName("PK_tipos_animal");

            entity.ToTable("tipos_animal");

            entity.Property(e => e.IdTipo).HasColumnName("id_tipo");
            entity.Property(e => e.TipoAnimal)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("tipo_animal");
        });

        modelBuilder.Entity<Veterinario>(entity =>
        {
            entity.HasKey(e => e.IdLegajo).HasName("PK_veterinarios");

            entity.ToTable("veterinarios");

            entity.Property(e => e.IdLegajo).HasColumnName("id_legajo");
            entity.Property(e => e.Dni).HasColumnName("DNI");
            entity.Property(e => e.Domicilio)
                .HasMaxLength(250)
                .IsUnicode(false)
                .HasColumnName("domicilio");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("email");
            entity.Property(e => e.FNacimiento)
                .HasColumnType("datetime")
                .HasColumnName("f_nacimiento");
            entity.Property(e => e.Habilitado)
                .HasDefaultValue(true)
                .HasColumnName("habilitado");
            entity.Property(e => e.Matricula).HasColumnName("matricula");
            entity.Property(e => e.Nombre)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.Telefono).HasColumnName("telefono");
            entity.Property(e => e.Apellido)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("apellido");
        });

        modelBuilder.Entity<CentroCastracion>(entity =>
        {
            entity.HasKey(e => e.Id_centro_castracion).HasName("PK_CentrosCastracion");

            entity.ToTable("centros_castracion");

            entity.Property(e => e.Id_centro_castracion).HasColumnName("id_centro_castracion");
            entity.Property(e => e.Nombre)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("nombre");
            entity.Property(e => e.Barrio)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("barrio");
            entity.Property(e => e.Calle)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("calle");
            entity.Property(e => e.Altura)
                .HasColumnName("altura");

            entity.Property(e => e.Habilitado)
                .HasDefaultValue(true)
                .HasColumnName("habilitado");

            entity.Property(e => e.HoraLaboralInicio)
            .HasColumnName("horaLaboralInicio");

            entity.Property(e => e.HoraLaboralFin)
            .HasColumnName("horaLaboralFin");

        });

        modelBuilder.Entity<VeterinarioxCentro>(entity =>
        {
            entity.HasKey(vc => new { vc.Id_legajo, vc.Id_centro_castracion });

            entity.ToTable("veterinarioxcentro");

            entity.HasOne(vc => vc.Veterinario)
            .WithMany(v => v.VeterinarioxCentros)
            .HasForeignKey(vc => vc.Id_legajo);

            entity.HasOne(vc => vc.CentroCastracion)
            .WithMany(c => c.VeterinarioxCentros)
            .HasForeignKey(vc => vc.Id_centro_castracion);

        });

        modelBuilder.Entity<Agenda>(entity =>
        {
            entity.ToTable("agendas");

            entity.HasKey(e => e.IdAgenda).HasName("PK_agenda");

            entity.Property(e => e.IdAgenda).HasColumnName("id_agenda");

            entity.Property(e => e.Fecha_inicio)
            .HasColumnType("DATETIME")
            .HasColumnName("fecha_inicio");

            entity.Property(e => e.Fecha_fin)
            .HasColumnType("DATE")
            .HasColumnName("fecha_fin");

            entity.Property(e => e.CantidadTurnosGatos)
            .HasDefaultValue(0)
            .HasColumnName("cant_turnos_gatos");

            entity.Property(e => e.CantidadTurnosPerros)
            .HasDefaultValue(0)
            .HasColumnName("cant_turnos_perros");

            entity.Property(e => e.CantidadTurnosEmergencia)
            .HasDefaultValue(0)
            .HasColumnName("cant_turnos_emergencia");

            entity.Property(e => e.IdCentroCastracion).HasColumnName("id_centro_castracion");

            entity.HasOne(a => a.CentrosCastracion)
            .WithMany(c => c.Agendas)
            .HasForeignKey(e => e.IdCentroCastracion)
            .HasConstraintName("FK_centro_castracion");

        });

        modelBuilder.Entity<Feriados>(entity =>
        {
            entity.ToTable("feriados");

            entity.HasKey(e => e.IdFeriado).HasName("PK_feriado");

            entity.Property(e => e.Fecha)
            .HasColumnType("DATE")
            .HasColumnName("fecha");

            entity.Property(e => e.Nombre)
            .HasColumnName("nombre");

            entity.Property(e => e.Tipo)
            .HasColumnName("tipo");

        });

        modelBuilder.Entity<Turnos>(entity =>
        {
            entity.ToTable("turnos_castracion");

            entity.HasKey(e => e.IdTurno).HasName("PK_turnos_castracion");

            entity.Property(e => e.IdTurno).HasColumnName("id_turno");

            entity.Property(e => e.Dia)
            .HasColumnType("DATE")
            .HasColumnName("dia");

            entity.Property(e => e.IdAgenda).HasColumnName("id_agenda");

            entity.HasOne(t => t.Agenda)
            .WithMany(a => a.Turnos)
            .HasForeignKey(e => e.IdAgenda)
            .HasConstraintName("FK_turnos_agenda");

        });

        modelBuilder.Entity<Horarios>(entity =>
        {

            entity.ToTable("horarios");

            entity.HasKey(e => e.IdHorario)
            .HasName("PK_horarios");

            entity.Property(e => e.IdHorario)
            .HasColumnName("id_horario");


            entity.Property(e => e.Hora)
            .HasColumnType("time(7)")
            .HasColumnName("hora");


            entity.Property(e => e.Id_Estado)
            .HasColumnName("estado");

            entity.Property(e => e.TipoTurno)
            .HasColumnName("tipo_turno");

            entity.Property(e => e.IdTurno)
            .HasColumnName("id_turno");

            entity.Property(e => e.Id_Usuario)
            .HasColumnName("id_usuario");

            entity.Property(e => e.Id_Legajo)
            .HasColumnName("id_legajo");

            entity.HasOne(e => e.Turnos)
                  .WithMany(t => t.Horarios)
                  .HasForeignKey(e => e.IdTurno)
                  .HasConstraintName("FK_horarios_turnos");

            entity.HasOne(h => h.IdTipoTurnoNavigation)
                  .WithMany(t => t.Horarios)
                  .HasForeignKey(e => e.TipoTurno)
                  .HasConstraintName("FK_horarios_tipo");

            entity.HasOne(h => h.Estado)
                  .WithMany(e => e.Horarios)
                  .HasForeignKey(e => e.Id_Estado)
                  .HasConstraintName("FK_horarios_estado");

            entity.HasOne(h => h.Veterinario)
                  .WithMany(v => v.Horarios)
                  .HasForeignKey(e => e.Id_Legajo)
                  .HasConstraintName("FK_horarios_veterinario");

            entity.HasOne(h => h.Usuario)
                  .WithMany(u => u.Horarios)
                  .HasForeignKey(e => e.Id_Usuario)
                  .HasConstraintName("FK_horarios_usuario");

            entity.Property(e => e.RowVersion)
            .IsRowVersion();

            entity.Property(e => e.Id_mascota)
            .HasColumnName("id_mascota");

            entity.HasOne(m => m.Mascota)
            .WithOne(h => h.Horario)
            .HasForeignKey<Horarios>(e => e.Id_mascota)
            .HasConstraintName("FK_horarios_mascota");

        });

        modelBuilder.Entity<Vecino>(entity => {

            entity.ToTable("vecinos");

            entity.HasKey(e => e.Id_vecino)
            .HasName("PK_id_vecino");

            entity.Property(e => e.Id_vecino)
            .HasColumnName("id_vecino");

            entity.Property(e => e.F_nacimiento)
            .HasColumnType("DATE")
            .HasColumnName("f_nacimiento");

            entity.Property(e => e.Domicilio)
            .HasColumnName("domicilio");
            
            entity.Property(e => e.Dni)
            .HasColumnName("dni");
            
            entity.Property(e => e.Telefono)
            .HasColumnName("telefono");

            entity.Property(e => e.Id_usuario)
            .HasColumnName("id_usuario");

            entity.HasOne(v => v.Usuario)              
                  .WithOne(u => u.Vecino)
                  .HasForeignKey<Vecino>(v => v.Id_usuario)
                  .HasConstraintName("FK_vecinos_usuarios")
                  .OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<TipoTurno>(entity => {

            entity.ToTable("tipo_turno");

            entity.HasKey(e => e.TipoId).HasName("PK_tipo_turno");

            entity.Property(e => e.TipoId)
            .HasColumnName("id_tipo_turno");

            entity.Property(e => e.NombreTipo)
            .HasColumnName("tipo");

        });


        modelBuilder.Entity<Rol>(entity =>
        {
            entity.ToTable("roles");

            entity.HasKey(e => e.IdRol).HasName("PK_roles");

            entity.Property(e => e.IdRol).HasColumnName("id_rol");

            entity.Property(e => e.Nombre).HasColumnName("nombre");


        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.ToTable("usuarios");

            entity.HasKey(e => e.IdUsuario).HasName("PK_usuarios");

            entity.Property(e => e.IdUsuario).HasColumnName("id_usuario");

            entity.Property(e => e.Nombre).HasColumnName("nombre");

            entity.Property(e => e.Apellido).HasColumnName("apellido");

            entity.Property(e => e.Contraseña).HasColumnName("contraseña");

            entity.Property(e => e.RolId).HasColumnName("id_rol");

            entity.Property(e => e.Email).HasColumnName("email");

            entity.HasOne(u => u.Rol)
                  .WithMany(r => r.Usuarios)
                  .HasForeignKey(u => u.RolId)
                  .HasConstraintName("FK_usuarios_roles");

        });

        modelBuilder.Entity<HistorialRefreshToken>(entity =>
        {
            entity.HasKey(e => e.IdHistorialToken).HasName("PK_HistorialToken");

            entity.ToTable("historial_Refresh_Token");

            entity.Property(e => e.EsActivo).HasComputedColumnSql("(case when [FechaExpiracion]<GETUTCDATE() then CONVERT([bit],(0)) else CONVERT([bit],(1)) end)", false);
            entity.Property(e => e.FechaCreacion).HasColumnType("datetime");
            entity.Property(e => e.FechaExpiracion).HasColumnType("datetime");
            entity.Property(e => e.RefreshToken)
                .HasMaxLength(200)
                .IsUnicode(false);
            entity.Property(e => e.Token)
                .HasMaxLength(500)
                .IsUnicode(false);

            entity.HasOne(d => d.IdUsuarioNavigation).WithMany(p => p.HistorialRefreshTokens)
                .HasForeignKey(d => d.IdUsuario)
                .HasConstraintName("FK_HistorialRefresh_Usuario");
        });

        modelBuilder.Entity<Estado>(entity =>
        {
            entity.ToTable("estado");

            entity.HasKey(e => e.IdEstado).HasName("PK_estado");

            entity.Property(e => e.IdEstado).HasColumnName("id_estado");

            entity.Property(e => e.Nombre).HasColumnName("nombre");

        });


        modelBuilder.Entity<CorreosProgramados>(entity => 
        {
            entity.ToTable("correos_programados");

            entity.HasKey(e => e.IdCorreo).HasName("PK_CorreosProgramados");

            entity.Property(e => e.IdCorreo).HasColumnName("id_correo");

            entity.Property(e => e.FechaEnvio)
            .HasColumnName("fecha_envio")
            .HasColumnType("date");

            entity.Property(e => e.Estado)
            .HasColumnName("estado");

            entity.Property(e => e.EmailDestino)
            .HasColumnName("email_destino");

            entity.Property(e => e.NombreCompleto)
            .HasColumnName("nombre_completo");

            entity.Property(e => e.Hora)
            .HasColumnType("time(7)")
            .HasColumnName("hora_turno");

            entity.Property(e => e.CentroCastracion)
            .HasColumnName("centro_castracion");

            entity.Property(e => e.TipoAnimal)
            .HasColumnName("tipo_animal");

            entity.Property(e => e.EsActivo).HasComputedColumnSql("(case when dateadd(hour, (-27), getdate()) >= (CONVERT([datetime], dateadd(day, (-1), [fecha_envio])) + CONVERT([datetime], [hora_turno])) then CONVERT([bit], (0)) else CONVERT([bit], (1)) end)", false);

            entity.Property(e => e.IdHorario).HasColumnName("id_horario");

            entity.HasOne(c => c.Horarios)
            .WithOne(e => e.CorreosProgramados)
            .HasForeignKey<CorreosProgramados>(d => d.IdHorario)
            .HasConstraintName("FK_correos_programados_horarios");

        });


        modelBuilder.Entity<SecretariaxCentro>(entity =>
        {
            entity.HasKey(sc => new { sc.IdUsuario, sc.IdCentroCastracion}).HasName("PK_secretariaxcentro");

            entity.ToTable("secretariaxcentro");

            entity.Property(e => e.IdUsuario)
            .HasColumnName("id_usuario");

            entity.Property(e => e.IdCentroCastracion)
            .HasColumnName("id_centro_castracion");

            entity.HasOne(sc => sc.Secretaria)
            .WithMany(s => s.SecretariaxCentros)
            .HasForeignKey(e => e.IdUsuario)
            .HasConstraintName("FK_secretariaxcentro_secretaria");

            entity.HasOne(sc => sc.CentroCastracion)
            .WithMany(c => c.SecretariaxCentros)
            .HasForeignKey(e => e.IdCentroCastracion)
            .HasConstraintName("FK_secretariaxcentro_centro");

        });


        modelBuilder.Entity<Medicacion>(entity => 
        {
            entity.ToTable("medicacion");

            entity.HasKey(e => e.IdMedicacion).HasName("PK_medicacion");

            entity.Property(e => e.IdMedicacion).HasColumnName("id_medicacion");

            entity.Property(e => e.Nombre).HasColumnName("nombre");

            entity.Property(e => e.Descripcion).HasColumnName("descripcion");

        });

        modelBuilder.Entity<MedicacionxHorario>(entity =>
        {
            entity.HasKey(mh => new { mh.IdMedicamento, mh.IdHorario });

            entity.ToTable("medicacionxhorario");

            entity.Property(e => e.IdHorario).HasColumnName("id_horario");

            entity.Property(e => e.IdMedicamento).HasColumnName("id_medicamento");

            entity.Property(e => e.Dosis).HasColumnName("dosis");

            entity.Property(e => e.IdUnidadMedida).HasColumnName("id_unidad");

            entity.HasOne(um => um.UnidadMedida)
            .WithMany(mh => mh.MedicacionxHorarios)
            .HasForeignKey(e => e.IdUnidadMedida)
            .HasConstraintName("FK_medicacionxhorario_unidad");

            entity.HasOne(h => h.Horario)
            .WithMany(mh => mh.MedicacionxHorarios)
            .HasForeignKey(e => e.IdHorario)
            .HasConstraintName("FK_medicacionxhorario_horario");

            entity.HasOne(h => h.Medicamento)
            .WithMany(mh => mh.MedicacionxHorario)
            .HasForeignKey(e => e.IdMedicamento)
            .HasConstraintName("FK_medicacionxhorario_medicacion");


            entity.Property(e => e.Descripcion).HasColumnName("descripcion");



        });


        modelBuilder.Entity<UnidadMedida>(entity =>
        {
            entity.ToTable("unidad_medida");

            entity.HasKey(e => e.IdUnidad).HasName("PK_unidad_medida");

            entity.Property(e => e.IdUnidad).HasColumnName("id_unidad");

            entity.Property(e => e.TipoUnidad).HasColumnName("tipo_unidad");


        });


        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
