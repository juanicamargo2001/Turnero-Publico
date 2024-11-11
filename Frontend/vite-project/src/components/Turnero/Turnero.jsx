import * as React from 'react';
import 'dayjs/locale/es'; // Importa la localización en español
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar, PickersDay, DayCalendarSkeleton } from '@mui/x-date-pickers';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import dayjs from 'dayjs';
import { horarios } from '../../services/horarios.service'; // Importa el servicio de horarios
import { turnosService } from '../../services/turnero.service'; // Importa el servicio de turnos

export default function DateCalendarValue({ nombreCentro, turnoId }) {
    const [value, setValue] = React.useState(null); // Fecha seleccionada
    const [highlightedDates, setHighlightedDates] = React.useState([]); // Fechas resaltadas
    const [showTimes, setShowTimes] = React.useState(false); // Para manejar la transición de mostrar los horarios
    const [selectedTime, setSelectedTime] = React.useState(null); // Para almacenar la hora seleccionada
    const [availableTimes, setAvailableTimes] = React.useState([]); // Horarios disponibles
    const [isLoading, setIsLoading] = React.useState(true); // Controla el estado de carga de las fechas
    const [error, setError] = React.useState(null); // Estado para manejar errores
    const timesContainerRef = React.useRef(null); // Referencia al contenedor de horarios

    React.useEffect(() => {
        // Llamada a la API para obtener las fechas del turno por ID
        const fetchDates = async () => {
            try {
                const fechas = await turnosService.Buscar(turnoId); // Obtener las fechas
                const fechasResaltadas = fechas.map(fecha => dayjs(fecha)); // Convertir las fechas a objetos `dayjs`
                setHighlightedDates(fechasResaltadas); // Almacenar las fechas completas
                setIsLoading(false); // Una vez que se obtienen las fechas, detener la carga
            } catch (error) {
                console.error("Error al obtener los turnos:", error);
                setError("No se pudieron cargar las fechas");
                setIsLoading(false);
            }
        };

        fetchDates();
    }, [turnoId]); // Dependencia del ID del turno

    const handleDateChange = async (newValue) => {
        setValue(newValue);
        setShowTimes(true); // Mostrar los horarios al seleccionar la fecha

        // Obtener horarios disponibles para la fecha seleccionada
        try {
            const dia = newValue.format(); // Formato de fecha ISO 8601
            const horariosObtenidos = await horarios.obtenerHorarios(turnoId, dia);
            setAvailableTimes(horariosObtenidos); // Actualiza los horarios disponibles
        } catch (error) {
            console.error("Error al obtener los horarios:", error);
            setError("No se pudieron cargar los horarios");
        }

        // Desplazarse hacia abajo al contenedor de horarios
        if (timesContainerRef.current) {
            timesContainerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const handleConfirm = async () => {
        if (!selectedTime) {
            setError("Por favor, selecciona una hora.");
            return;
        }
    
        // Mostrar en consola el ID del turno que se va a enviar
        console.log("ID del turno seleccionado:", selectedTime.idHorario);
    
        try {
            // Llama al servicio para reservar el turno, enviando el idHorario
            await turnosService.reservarTurno(selectedTime.idHorario); // Enviar solo el idHorario
            alert("¡Tu turno ha sido confirmado!");
        } catch (error) {
            setError("Hubo un problema al confirmar tu turno.");
            console.error("Error al confirmar el turno:", error);
        }
    };
    
      
      

    const handleTimeSelect = (time) => {
        setSelectedTime(time); // Almacenar la hora seleccionada
        console.log("ID del turno seleccionado:", time.idHorario);
    };

    // Componente de renderizado personalizado para los días
    function ServerDay(props) {
        const { highlightedDates = [], day, outsideCurrentMonth, ...other } = props;

        // Comprobar si la fecha está en la lista de fechas resaltadas
        const isHighlighted = highlightedDates.some(highlightedDate =>
            highlightedDate.isSame(day, 'day') // Verifica día, mes y año
        );

        return (
            <Tooltip
                title={!isHighlighted ? "No hay turnos disponibles" : ""}
                arrow
            >
                <span>
                    <PickersDay
                        {...other}
                        day={day}
                        outsideCurrentMonth={outsideCurrentMonth}
                        disabled={!isHighlighted} // Deshabilitar si no está resaltado
                        className={isHighlighted ? 'highlighted-day' : 'disabled-day'} // Asignar clase CSS
                    />
                </span>
            </Tooltip>
        );
    }

    return (
        <div className="container turnero mt-4">
            <h1 className="maven-pro-title">Turnero {nombreCentro}</h1>
            
            <div className="calendar-time-row">
                
                <div className="calendar-container">
                    <h2 className='subtituloturnero'>Elige el día</h2>
                    
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <StyledDateCalendar
                            value={value}
                            onChange={handleDateChange}
                            loading={isLoading} // Mostrar esqueleto si está cargando
                            renderLoading={() => <DayCalendarSkeleton />}
                            slots={{ day: ServerDay }}
                            slotProps={{ day: { highlightedDates } }}
                        />
                    </LocalizationProvider>
                </div>
                
                {/* Contenedor de horarios */}
                {showTimes && (
                    <div ref={timesContainerRef} className="time-container">
                        <h2 className='subtituloturnero'>Elige la hora</h2>
                        {error && <p className="error">{error}</p>} {/* Mostrar error si existe */}
                
                        <div className="time-box">
                            <div className="time-section">
                                <h3>Mañana</h3>
                                <div className="time-slots">
                                    {availableTimes.filter(time => time.hora < '12:00').map((time) => (
                                        <button
                                            key={time.idHorario}
                                            onClick={() => handleTimeSelect(time.hora)}
                                            className={`btn time-slot ${selectedTime === time.hora ? 'selected' : ''}`}
                                        >
                                            {time.hora}
                                        </button>
                                    ))}
                                </div>
                            </div>
                
                            <div className="time-section">
                                <h3>Tarde</h3>
                                <div className="time-slots">
                                    {availableTimes.filter(time => time.hora >= '12:00').map((time) => (
                                        <button
                                            key={time.idHorario}
                                            onClick={() => handleTimeSelect(time.hora)}
                                            className={`btn time-slot ${selectedTime === time.hora ? 'selected' : ''}`}
                                        >
                                            {time.hora}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="d-flex justify-content-end p-2">
                <button type="button" className="btn btn-dark me-2 confir2" onClick={() => window.history.back()}>
                Volver
                </button>
                <button type="button" className="btn btn-primary confir" onClick={handleConfirm}>
                Confirmar
                </button>
            </div>

        </div>
    );
}

// Estilos personalizados utilizando MUI styled()
const StyledDateCalendar = styled(DateCalendar)(({ theme }) => ({
    borderRadius: '15px',
    boxShadow: '0 0px 20px rgba(0, 0, 0, 0.1)', // Aumentar el tamaño de la sombra
    border: 'none',
    width: '100%',
    minWidth: '1em', // Ancho mínimo del calendario
    position: 'center',
    zIndex: 1,
    padding: '20px', // Asegúrate de que haya padding interno para que la sombra no se corte
}));
