import React, { useMemo, useCallback } from 'react';
import { 
  TouchableOpacity, 
  TouchableOpacityProps, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  ActivityIndicator,
  Platform 
} from 'react-native';
import { ResponsiveStyleSheet } from '../../utils/ResponsiveStyle/ResponsiveStyleSheet';
import Typography from '../Typography/Typography';

export interface ButtonProps extends TouchableOpacityProps {
  // Variant props
  primary?: boolean;
  secondary?: boolean;
  outline?: boolean;
  ghost?: boolean;
  danger?: boolean;
  success?: boolean;
  
  // Size props
  small?: boolean;
  medium?: boolean;
  large?: boolean;
  
  // State props
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  
  // Style overrides
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  borderRadius?: keyof typeof ResponsiveStyleSheet.BORDER_RADIUS_SCALE;
  style?: ViewStyle;
  textStyle?: TextStyle;
  
  // Content
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  
  // Accessibility props
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'link' | 'tab' | 'menuitem';
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean;
    busy?: boolean;
    expanded?: boolean;
  };
  accessibilityActions?: Array<{
    name: string;
    label?: string;
  }>;
  onAccessibilityAction?: (event: { nativeEvent: { actionName: string } }) => void;
}

// Platform-specific font weights
const getPlatformFontWeight = Platform.select({
  ios: { fontWeight: '500' as const },
  android: { fontWeight: '500' as const },
});

// Pre-calculate base styles to avoid runtime calculations
const baseStyles = StyleSheet.create({
  // Base button styles
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ResponsiveStyleSheet.borderRadius('4xl'),
    borderWidth: 2,
    ...getPlatformFontWeight,
  },
  
  // Size variants
  small: {
    paddingVertical: ResponsiveStyleSheet.responsiveSpacing(2),
    paddingHorizontal: ResponsiveStyleSheet.responsiveSpacing(4),
    minHeight: ResponsiveStyleSheet.height(36),
  },
  medium: {
    paddingVertical: ResponsiveStyleSheet.responsiveSpacing(3),
    paddingHorizontal: ResponsiveStyleSheet.responsiveSpacing(6),
    minHeight: ResponsiveStyleSheet.height(44),
  },
  large: {
    paddingVertical: ResponsiveStyleSheet.responsiveSpacing(4),
    paddingHorizontal: ResponsiveStyleSheet.responsiveSpacing(8),
    minHeight: ResponsiveStyleSheet.height(52),
  },
  
  // Variant styles - will be dynamically set using ResponsiveStyleSheet
  primary: {},
  secondary: {},
  outline: {},
  ghost: {},
  danger: {},
  success: {},
  
  // State styles
  disabled: {
    opacity: 0.5,
  },
  loading: {
    opacity: 0.8,
  },
  fullWidth: {
    width: '100%',
  },
});

const Button: React.FC<ButtonProps> = ({
  // Variants
  primary,
  secondary,
  outline,
  ghost,
  danger,
  success,
  
  // Sizes
  small,
  medium,
  large,
  
  // States
  loading,
  disabled,
  fullWidth,
  
  // Style overrides
  color,
  backgroundColor,
  borderColor,
  textColor,
  borderRadius,
  style,
  textStyle,
  
  // Content
  children,
  leftIcon,
  rightIcon,
  
  // Accessibility props
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  accessibilityState,
  accessibilityActions,
  onAccessibilityAction,
  
  // TouchableOpacity props
  onPress,
  ...props
}) => {
  // Determine variant from boolean props
  const variant = useMemo(() => {
    if (primary) return 'primary';
    if (secondary) return 'secondary';
    if (outline) return 'outline';
    if (ghost) return 'ghost';
    if (danger) return 'danger';
    if (success) return 'success';
    return 'primary'; // default
  }, [primary, secondary, outline, ghost, danger, success]);

  // Determine size from boolean props
  const size = useMemo(() => {
    if (small) return 'small';
    if (large) return 'large';
    return 'medium'; // default
  }, [small, large]);

  // Memoize the button style calculation
  const buttonStyle = useMemo(() => {
    const baseStyle = baseStyles.base;
    const sizeStyle = baseStyles[size];
    
    // Get theme colors from ResponsiveStyleSheet
    const themeColors = ResponsiveStyleSheet.getThemeColors();
    
    // Dynamic variant styles based on theme
    const variantStyle: ViewStyle = {};
    if (variant === 'primary') {
      variantStyle.backgroundColor = themeColors.primary;
      variantStyle.borderColor = themeColors.primary;
    } else if (variant === 'secondary') {
      variantStyle.backgroundColor = themeColors.textSecondary;
      variantStyle.borderColor = themeColors.textSecondary;
    } else if (variant === 'outline') {
      variantStyle.backgroundColor = 'transparent';
      variantStyle.borderColor = themeColors.primary;
    } else if (variant === 'ghost') {
      variantStyle.backgroundColor = 'transparent';
      variantStyle.borderColor = 'transparent';
    } else if (variant === 'danger') {
      variantStyle.backgroundColor = themeColors.error;
      variantStyle.borderColor = themeColors.error;
    } else if (variant === 'success') {
      variantStyle.backgroundColor = themeColors.success;
      variantStyle.borderColor = themeColors.success;
    }
    
    // Custom style overrides
    const customStyles: ViewStyle = {};
    if (backgroundColor) customStyles.backgroundColor = backgroundColor;
    if (borderColor) customStyles.borderColor = borderColor;
    if (fullWidth) customStyles.width = '100%';
    
    // Apply border radius (default to 4xl if not specified)
    const finalBorderRadius = borderRadius || '4xl';
    customStyles.borderRadius = ResponsiveStyleSheet.borderRadius(finalBorderRadius);
    
    return [
      baseStyle,
      sizeStyle,
      variantStyle,
      customStyles,
      style,
    ];
  }, [variant, size, backgroundColor, borderColor, fullWidth, style, accessibilityState]);

  // Memoize the text style calculation
  const textStyleObj = useMemo(() => {
    const baseTextStyle: TextStyle = {};
    
    // Get theme colors from ResponsiveStyleSheet
    const themeColors = ResponsiveStyleSheet.getThemeColors();
    
    // Text color based on variant
    if (textColor) {
      baseTextStyle.color = textColor;
    } else if (variant === 'outline' || variant === 'ghost') {
      baseTextStyle.color = themeColors.primary; // Primary color text for outline/ghost
    } else {
      baseTextStyle.color = themeColors.onPrimary; // On-primary color for filled buttons
    }
    
    return textStyle ? [baseTextStyle, textStyle] : baseTextStyle;
  }, [variant, textColor, textStyle]);

  // Memoize the onPress callback
  const handlePress = useCallback((event: any) => {
    if (!disabled && !loading && onPress) {
      onPress(event);
    }
  }, [disabled, loading, onPress]);

  // Determine if button should be disabled
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        buttonStyle,
        isDisabled && baseStyles.disabled,
        loading && baseStyles.loading,
      ]}
      onPress={handlePress}
      disabled={isDisabled}
      activeOpacity={0.8}
      // Accessibility props
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole || 'button'}
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
        ...accessibilityState,
      }}
      accessibilityActions={accessibilityActions}
      onAccessibilityAction={onAccessibilityAction}
      {...props}
    >
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? ResponsiveStyleSheet.getThemeColors().primary : ResponsiveStyleSheet.getThemeColors().onPrimary} 
          style={{ marginRight: ResponsiveStyleSheet.responsiveSpacing(2) }}
        />
      )}
      
      {leftIcon && !loading && (
        <Typography style={{ marginRight: ResponsiveStyleSheet.responsiveSpacing(2) }}>
          {leftIcon}
        </Typography>
      )}
      
      <Typography 
        button
        style={StyleSheet.flatten([textStyleObj, textStyle])}
        center
      >
        {children}
      </Typography>
      
      {rightIcon && !loading && (
        <Typography style={{ marginLeft: ResponsiveStyleSheet.responsiveSpacing(2) }}>
          {rightIcon}
        </Typography>
      )}
    </TouchableOpacity>
  );
};

export default Button;
