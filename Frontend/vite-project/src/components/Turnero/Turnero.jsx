import * as React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Importa la localización en español
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { styled } from '@mui/material/styles';


// Configura el idioma en español
dayjs.locale('es');

// Componente de Calendario personalizado
export default function DateCalendarValue({ nombreCentro }) {
  const [value, setValue] = React.useState(null); // Por defecto, sin fecha seleccionada
  const [showTimes, setShowTimes] = React.useState(false); // Para manejar la transición de mostrar los horarios
  const [selectedTime, setSelectedTime] = React.useState(null); // Para almacenar la hora seleccionada
  const availableTimes = ['9:30', '10:00', '10:30', '11:00', '11:30', '12:00']; // Horarios disponibles

  const handleDateChange = (newValue) => {
    setValue(newValue);
    setShowTimes(true); // Mostrar los horarios al seleccionar la fecha
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time); // Almacenar la hora seleccionada
  };

  return (
    <div className="container turnero mt-4">
      <h1 className="maven-pro-title">Turnero {nombreCentro}</h1>
      <div className="row" style={{ position: 'relative' }}>
        <div className="col-md-6 calendar-container">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DateCalendar', 'DateCalendar']}>
              <DemoItem>
                <StyledDateCalendar
                  value={value}
                  onChange={handleDateChange}
                />
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
        </div>

        {/* Contenedor de horarios */}
        {showTimes && (
          <div className="col-md-6 time-container">
            <h2>Elige la hora</h2>
            <div className="time-box">
              {availableTimes.map((time) => (
                <button
                  key={time}
                  onClick={() => handleTimeSelect(time)} // Maneja el clic en la hora
                  className={`btn time-slot ${selectedTime === time ? 'selected' : ''}`} // Estilo de botón de Bootstrap
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
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
  minWidth: '500px', // Aumentar el ancho mínimo del calendario
  position: 'relative',
  zIndex: 1,
  padding: '20px', // Asegurarte de que haya padding interno para que la sombra no se corte
}));

