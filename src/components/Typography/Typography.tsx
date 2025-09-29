import React, { useMemo, useCallback } from 'react';
import { Text, TextProps, StyleSheet, TextStyle, Platform } from 'react-native';
import { ResponsiveStyleSheet } from '../../utils/ResponsiveStyle/ResponsiveStyleSheet';

// Updated interface with boolean props for variants, alignment, and weight
export interface TypographyProps extends TextProps {
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  h5?: boolean;
  h6?: boolean;
  body1?: boolean;
  body2?: boolean;
  caption?: boolean;
  overline?: boolean;
  button?: boolean;
  color?: string;
  // Alignment props
  left?: boolean;
  center?: boolean;
  right?: boolean;
  justify?: boolean;
  // Weight props
  normal?: boolean;
  bold?: boolean;
  thin?: boolean;
  light?: boolean;
  medium?: boolean;
  semibold?: boolean;
  extrabold?: boolean;
  black?: boolean;
  // Style props
  italic?: boolean;
  size?: number;
  lineHeight?: number;
  letterSpacing?: number;
  style?: TextStyle;
  children: React.ReactNode;
}

// Font mapping for different Roboto variants
const getRobotoFontFamily = (weight?: string, style?: string) => {
  const baseFont = 'Roboto';
  
  if (style === 'italic') {
    switch (weight) {
      case 'bold':
      case '700':
        return 'Roboto-BoldItalic';
      case 'black':
      case '900':
        return 'Roboto-BlackItalic';
      case 'normal':
      case '400':
      default:
        return 'Roboto-Italic';
    }
  }
  
  switch (weight) {
    case 'bold':
    case '700':
      return 'Roboto-Bold';
    case 'black':
    case '900':
      return 'Roboto-Black';
    case 'thin':
    case '100':
      return 'Roboto-Thin';
    case 'light':
    case '300':
      return 'Roboto-Light';
    case 'medium':
    case '500':
      return 'Roboto-Medium';
    case 'semibold':
    case '600':
      return 'Roboto-Medium'; // Using Medium as closest to semibold
    case 'extrabold':
    case '800':
      return 'Roboto-Bold'; // Using Bold as closest to extrabold
    case 'normal':
    case '400':
    default:
      return baseFont;
  }
};

// Memoized platform font function - only created once
const getPlatformFont = Platform.select({
  ios: { fontFamily: 'Roboto' },
  android: { fontFamily: 'Roboto' },
});

// Pre-calculate base styles to avoid runtime calculations
const baseStyles = StyleSheet.create({
  h1: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
  h2: { fontSize: 28, lineHeight: 36, fontWeight: '600' },
  h3: { fontSize: 24, lineHeight: 32, fontWeight: '600' },
  h4: { fontSize: 20, lineHeight: 28, fontWeight: '500' },
  h5: { fontSize: 18, lineHeight: 24, fontWeight: '500' },
  h6: { fontSize: 16, lineHeight: 22, fontWeight: '400' },
  body1: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  body2: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '300' },
  overline: { fontSize: 10, lineHeight: 14, fontWeight: '300', textTransform: 'uppercase' },
  button: { fontSize: 16, lineHeight: 20, fontWeight: '900' },
});

const Typography: React.FC<TypographyProps> = ({
  h1, h2, h3, h4, h5, h6,
  body1, body2, caption, overline, button,
  color,
  left, center, right, justify,
  normal, bold, thin, light, medium, semibold, extrabold, black,
  italic,
  size,
  lineHeight,
  letterSpacing,
  style,
  children,
  ...props
}) => {
  // Determine variant from boolean props
  const variant = useMemo(() => {
    if (h1) return 'h1';
    if (h2) return 'h2';
    if (h3) return 'h3';
    if (h4) return 'h4';
    if (h5) return 'h5';
    if (h6) return 'h6';
    if (body1) return 'body1';
    if (body2) return 'body2';
    if (caption) return 'caption';
    if (overline) return 'overline';
    if (button) return 'button';
    return 'body1'; // default
  }, [h1, h2, h3, h4, h5, h6, body1, body2, caption, overline, button]);

  // Determine alignment from boolean props
  const textAlign = useMemo((): 'left' | 'center' | 'right' | 'justify' => {
    if (left) return 'left';
    if (center) return 'center';
    if (right) return 'right';
    if (justify) return 'justify';
    return 'left'; // Default left alignment matching CSS design
  }, [left, center, right, justify]);

  // Determine weight from boolean props
  const fontWeight = useMemo((): 'normal' | 'bold' | '100' | '300' | '500' | '600' | '800' | '900' | undefined => {
    if (normal) return 'normal';
    if (bold) return 'bold';
    if (thin) return '100';
    if (light) return '300';
    if (medium) return '500';
    if (semibold) return '600';
    if (extrabold) return '800';
    if (black) return '900';
    return undefined;
  }, [normal, bold, thin, light, medium, semibold, extrabold, black]);

  // Determine font style from boolean props
  const fontStyle = useMemo((): 'normal' | 'italic' | undefined => {
    if (italic) return 'italic';
    return 'normal';
  }, [italic]);

  // Memoize the variant style calculation to avoid recalculation on every render
  const variantStyle = useMemo(() => {
    const baseStyle = baseStyles[variant];
    
    // Use ResponsiveStyleSheet for responsive sizing
    const responsiveFontSize = size || ResponsiveStyleSheet.fontSize(baseStyle.fontSize || 16);
    
    // Calculate responsive line height if not provided
    const responsiveLineHeight = lineHeight || ResponsiveStyleSheet.lineHeight(responsiveFontSize, 1.5);
    
    // Calculate responsive letter spacing if not provided
    const responsiveLetterSpacing = letterSpacing || ResponsiveStyleSheet.letterSpacing(0);
    
    // Get the appropriate Roboto font family based on weight and style
    const robotoFontFamily = getRobotoFontFamily(fontWeight, fontStyle);
    
    return {
      ...baseStyle,
      fontFamily: robotoFontFamily,
      fontSize: responsiveFontSize,
      lineHeight: responsiveLineHeight,
      letterSpacing: responsiveLetterSpacing,
      color: color || '#3f4048', // Default color matching CSS design
      ...(textAlign && { textAlign }),
      ...(fontWeight && { fontWeight }),
      ...(fontStyle && { fontStyle }),
    };
  }, [variant, color, textAlign, fontWeight, fontStyle, size, lineHeight, letterSpacing]);

  // Memoize the final style object to prevent unnecessary re-renders
  const finalStyle = useMemo(() => {
    if (!style) return variantStyle;
    return [variantStyle, style];
  }, [variantStyle, style]);

  // Memoize the onPress callback if it exists to prevent unnecessary re-renders
  const memoizedOnPress = useCallback((event: any) => {
    if (props.onPress) {
      props.onPress(event);
    }
  }, [props.onPress]);

  const memoizedProps = useMemo(() => {
    const { onPress, ...otherProps } = props;
    if (onPress) {
      return { ...otherProps, onPress: memoizedOnPress };
    }
    return otherProps;
  }, [props, memoizedOnPress]);

  return (
    <Text
      style={finalStyle}
      {...memoizedProps}
    >
      {children}
    </Text>
  );
};

// Export the base styles for external use if needed
export { baseStyles };

export default Typography;
