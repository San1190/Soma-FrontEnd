// src/constants/typography.js
// Estándares de tipografía móvil optimizados para iPhone y Android

/**
 * GUÍA DE TAMAÑOS (móvil):
 * - Títulos y encabezados: 20-40px
 * - Subtítulos: 16-20px
 * - Texto de contenido/lectura: 15-16px
 * - Texto de botones e indicadores: 10-16px
 * - Símbolos, iconos y textos secundarios: 8-12px
 */

export const FontSizes = {
    // Títulos y encabezados (20-40px)
    xxLarge: 32,  // Títulos principales de pantalla
    xLarge: 28,   // Títulos de sección importantes
    large: 24,    // Títulos de tarjetas grandes

    // Subtítulos (16-20px)
    mediumLarge: 20,  // Subtítulos destacados
    medium: 18,       // Subtítulos de sección
    mediumSmall: 16,  // Subtítulos de tarjetas

    // Contenido/Lectura (15-16px)
    regular: 16,      // Texto principal de lectura
    regularSmall: 15, // Texto de contenido

    // Botones e indicadores (10-16px)
    button: 14,       // Texto de botones
    label: 13,        // Labels e indicadores
    caption: 12,      // Pequeños indicadores

    // Secundarios (8-12px)
    small: 11,        // Textos auxiliares
    xSmall: 10,       // Textos muy pequeños
    xxSmall: 9,       // Mínimo recomendado
};

export const FontWeights = {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
};

export const FontFamilies = {
    regular: 'Afacad_400Regular',
    medium: 'Afacad_500Medium',
    semiBold: 'Afacad_600SemiBold',
    bold: 'Afacad_700Bold',
};

/**
 * LINE HEIGHTS optimizados para legibilidad móvil
 * Regla: más grande el texto, menor el line height relativo
 */
export const LineHeights = {
    // Títulos (más compactos)
    tight: 1.2,      // Para títulos grandes (xxLarge, xLarge)
    snug: 1.3,       // Para títulos medianos (large, mediumLarge)

    // Contenido (espacioso para legibilidad)
    normal: 1.4,     // Para subtítulos y labels
    relaxed: 1.5,    // Para texto de lectura (regular)
    loose: 1.6,      // Para párrafos largos
};

/**
 * Estilos de texto pre-configurados para uso común
 */
export const TextStyles = {
    // Títulos
    h1: {
        fontSize: FontSizes.xxLarge,
        fontFamily: FontFamilies.bold,
        lineHeight: FontSizes.xxLarge * LineHeights.tight,
    },
    h2: {
        fontSize: FontSizes.xLarge,
        fontFamily: FontFamilies.bold,
        lineHeight: FontSizes.xLarge * LineHeights.tight,
    },
    h3: {
        fontSize: FontSizes.large,
        fontFamily: FontFamilies.bold,
        lineHeight: FontSizes.large * LineHeights.snug,
    },

    // Subtítulos
    subtitle1: {
        fontSize: FontSizes.mediumLarge,
        fontFamily: FontFamilies.semiBold,
        lineHeight: FontSizes.mediumLarge * LineHeights.snug,
    },
    subtitle2: {
        fontSize: FontSizes.medium,
        fontFamily: FontFamilies.semiBold,
        lineHeight: FontSizes.medium * LineHeights.normal,
    },
    subtitle3: {
        fontSize: FontSizes.mediumSmall,
        fontFamily: FontFamilies.semiBold,
        lineHeight: FontSizes.mediumSmall * LineHeights.normal,
    },

    // Cuerpo/Contenido
    body1: {
        fontSize: FontSizes.regular,
        fontFamily: FontFamilies.regular,
        lineHeight: FontSizes.regular * LineHeights.relaxed,
    },
    body2: {
        fontSize: FontSizes.regularSmall,
        fontFamily: FontFamilies.regular,
        lineHeight: FontSizes.regularSmall * LineHeights.relaxed,
    },

    // Botones
    button: {
        fontSize: FontSizes.button,
        fontFamily: FontFamilies.semiBold,
        lineHeight: FontSizes.button * LineHeights.normal,
    },

    // Pequeños
    caption: {
        fontSize: FontSizes.caption,
        fontFamily: FontFamilies.regular,
        lineHeight: FontSizes.caption * LineHeights.normal,
    },
    label: {
        fontSize: FontSizes.label,
        fontFamily: FontFamilies.medium,
        lineHeight: FontSizes.label * LineHeights.normal,
    },
    small: {
        fontSize: FontSizes.small,
        fontFamily: FontFamilies.regular,
        lineHeight: FontSizes.small * LineHeights.normal,
    },
};

export default {
    FontSizes,
    FontWeights,
    FontFamilies,
    LineHeights,
    TextStyles,
};
