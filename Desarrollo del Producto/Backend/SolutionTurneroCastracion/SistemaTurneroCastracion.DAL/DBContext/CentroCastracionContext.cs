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


        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
