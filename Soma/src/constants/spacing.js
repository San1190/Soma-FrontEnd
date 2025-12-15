// src/constants/spacing.js
// Sistema de espaciado responsive optimizado para móviles

/**
 * Sistema de espaciado base en múltiplos de 4px
 * para consistencia y escalabilidad
 */
export const Spacing = {
    // Espacios pequeños
    xs: 4,    // Espacios mínimos entre elementos relacionados
    sm: 8,    // Espacios entre elementos cercanos
    md: 12,   // Espacios estándar entre componentes

    // Espacios medianos
    lg: 16,   // Padding de contenedores, espacios entre secciones
    xl: 20,   // Padding de tarjetas, márgenes importantes
    xxl: 24,  // Separación entre secciones grandes

    // Espacios grandes
    xxxl: 32, // Separación máxima entre grupos
    huge: 40, // Espacios especiales
};

/**
 * Espaciado específico para componentes móviles
 */
export const ComponentSpacing = {
    // Contenedores
    containerPadding: Spacing.lg,           // 16px - padding horizontal de contenedores
    containerPaddingLarge: Spacing.xl,      // 20px - padding para contenedores destacados

    // Tarjetas
    cardPadding: Spacing.xl,                // 20px - padding interno de tarjetas
    cardMargin: Spacing.md,                 // 12px - margen entre tarjetas
    cardBorderRadius: 20,                   // Radio de bordes de tarjetas

    // Botones
    buttonPaddingVertical: Spacing.md,      // 12px - padding vertical de botones
    buttonPaddingHorizontal: Spacing.xl,    // 20px - padding horizontal de botones
    buttonBorderRadius: 24,                 // Radio de bordes de botones
    buttonMinHeight: 44,                    // Altura mínima para touch targets (iOS guideline)

    // Inputs
    inputPaddingVertical: Spacing.md,       // 12px - padding vertical de inputs
    inputPaddingHorizontal: Spacing.lg,     // 16px - padding horizontal de inputs
    inputBorderRadius: 10,                  // Radio de bordes de inputs
    inputMarginBottom: Spacing.md,          // 12px - margen inferior entre inputs

    // Listas y grupos
    listItemSpacing: Spacing.sm,            // 8px - espacio entre items de lista
    sectionSpacing: Spacing.xxl,            // 24px - espacio entre secciones

    // Elementos pequeños
    iconSpacing: Spacing.sm,                // 8px - espacio alrededor de iconos
    badgePadding: Spacing.sm,               // 8px - padding de badges/pills
};

/**
 * Márgenes seguros para diferentes partes de la pantalla
 */
export const SafeMargins = {
    screen: {
        top: 8,       // Margen superior de pantalla (además del SafeArea)
        bottom: 40,   // Margen inferior para scroll
        horizontal: 16, // Margen horizontal estándar
    },

    // Para pantallas con footer fijo
    withFooter: {
        bottom: 120,  // Espacio para footer + contenido extra
    },
};

/**
 * Espaciado para diferentes breakpoints (si necesitas responsive)
 */
export const ResponsiveSpacing = {
    small: {  // Teléfonos pequeños (< 375px)
        containerPadding: 12,
        cardPadding: 16,
    },
    medium: { // Teléfonos estándar (375px - 428px)
        containerPadding: 16,
        cardPadding: 20,
    },
    large: {  // Teléfonos grandes y tablets (> 428px)
        containerPadding: 20,
        cardPadding: 24,
    },
};

export default {
    Spacing,
    ComponentSpacing,
    SafeMargins,
    ResponsiveSpacing,
};
