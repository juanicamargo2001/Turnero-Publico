import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import loginService from '../../services/login.service';
import { centroService } from '../../services/centro.service';

const CrearPersonal = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [role, setRole] = useState('SuperAdministrador');
    const [centros, setCentros] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // Cargar centros de castración al montar el componente
        const fetchCentros = async () => {
            try {
                const centrosData = await centroService.BuscarTodos();
                setCentros(centrosData.result);
            } catch (error) {
                console.error('Error al cargar los centros:', error);
                setErrorMessage('No se pudieron cargar los centros de castración.');
            }
        };
        fetchCentros();
    }, []);

    const onSubmit = async (data) => {
        try {
            setErrorMessage('');
            setSuccessMessage('');

            const personalData = {
                nombre: data.nombre,
                apellido: data.apellido,
                contraseña: data.contraseña,
                email: data.email,
            };

            if (role === 'Secretario') {
                personalData.idCentroCastracion = parseInt(data.idCentroCastracion, 10);
                await loginService.crearSecretaria(
                    personalData.nombre,
                    personalData.apellido,
                    personalData.contraseña,
                    personalData.email,
                    personalData.idCentroCastracion
                );
            } else if (role === 'Administrador') {
                await loginService.crearAdmin(
                    personalData.nombre,
                    personalData.apellido,
                    personalData.contraseña,
                    personalData.email
                );
            } else if (role === 'SuperAdministrador') {
                await loginService.crearSuperAdmin(
                    personalData.nombre,
                    personalData.apellido,
                    personalData.contraseña,
                    personalData.email
                );
            }

            setSuccessMessage('¡Usuario creado con éxito!');
            reset();
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            setErrorMessage('Error al crear el usuario. Verifica los datos e intenta nuevamente.');
        }
    };

    const renderSecretarioField = () => {
        return role === 'Secretario' && (
            <div className="mb-3">
                <label htmlFor="idCentroCastracion" className="form-label">Centro de Castración</label>
                <select
                    className="form-select"
                    id="idCentroCastracion"
                    {...register('idCentroCastracion', { required: 'El centro de castración es obligatorio' })}
                >
                    <option value="">Seleccione un centro</option>
                    {centros.map((centro) => (
                        <option key={centro.id_centro_castracion} value={centro.id_centro_castracion}>{centro.nombre}</option>
                    ))}
                </select>
                {errors.idCentroCastracion && <p style={{ color: 'red' }}>{errors.idCentroCastracion.message}</p>}
            </div>
        );
    };

    return (
        <div className="container mt-4">
            <h2 className='maven-pro-title'>Crear Personal</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label htmlFor="role" className="form-label">Rol</label>
                    <select
                        className="form-select"
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="SuperAdministrador">SuperAdministrador</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Secretario">Secretario</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        {...register('nombre', { required: 'El nombre es obligatorio' })}
                    />
                    {errors.nombre && <p style={{ color: 'red' }}>{errors.nombre.message}</p>}
                </div>

                <div className="mb-3">
                    <label htmlFor="apellido" className="form-label">Apellido</label>
                    <input
                        type="text"
                        className="form-control"
                        id="apellido"
                        {...register('apellido', { required: 'El apellido es obligatorio' })}
                    />
                    {errors.apellido && <p style={{ color: 'red' }}>{errors.apellido.message}</p>}
                </div>

                <div className="mb-3">
                <label htmlFor="contraseña" className="form-label">Contraseña</label>
                <input
                    type="password"
                    className="form-control"
                    id="contraseña"
                    {...register('contraseña', {
                        required: 'La contraseña es obligatoria',
                        minLength: {
                            value: 8,
                            message: 'La contraseña debe tener al menos 8 caracteres',
                        },
                        pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            message: 'La contraseña debe incluir mayúscula, minúscula, número y un símbolo especial',
                        },
                    })}
                />
                {errors.contraseña && <p style={{ color: 'red' }}>{errors.contraseña.message}</p>}
            </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        {...register('email', { required: 'El email es obligatorio' })}
                    />
                    {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
                </div>

                {renderSecretarioField()}

                <button type="submit" className="btn btn-primary">Crear</button>
            </form>

            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};

export default CrearPersonal;
