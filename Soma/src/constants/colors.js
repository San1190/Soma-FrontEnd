// src/constants/colors.js

// Definimos la paleta de colores de SOMA
const themes = {
  light: {
    background: '#F0F2F5', // Un fondo claro y suave
    primary: '#4CAF50',    // Un verde primario
    accent1: '#8BC34A',    // Un verde acento más claro
    accent2: '#CDDC39',    // Un verde lima
    textPrimary: '#212121', // Texto oscuro para fondos claros
    textSecondary: '#757575',// Texto secundario más claro
    cardBackground: '#FFFFFF', // Fondo de tarjetas claro
    borderColor: '#E0E0E0', // Borde sutil
  },
  dark: {
    background: '#212121', // Fondo oscuro
    primary: '#8BC34A',    // Verde primario para modo oscuro
    accent1: '#AED581',    // Verde acento más claro
    accent2: '#DCE775',    // Verde lima para modo oscuro
    textPrimary: '#FFFFFF', // Texto claro para fondos oscuros
    textSecondary: '#BDBDBD',// Texto secundario más claro
    cardBackground: '#424242', // Fondo de tarjetas oscuro
    borderColor: '#616161', // Borde sutil
  },
  // NUEVO TEMA "CALM"
  calm: {
    background: '#E6F0F3', // Un fondo azul-grisáceo muy suave
    primary: '#5D9C9C',    // Un verde azulado calmado
    accent1: '#82B4B4',    // Un tono más claro
    accent2: '#A7C9C9',    // Un tono aún más claro
    textPrimary: '#3E4C59', // Texto oscuro pero suave (no negro)
    textSecondary: '#7A8A99',// Texto secundario
    cardBackground: '#F4F8F9', // Fondo de tarjetas casi blanco
    borderColor: '#D8E0E3', // Borde muy sutil
  },
};

export default themes;