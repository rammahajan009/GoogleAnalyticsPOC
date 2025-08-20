import { Dimensions, PixelRatio, Platform } from 'react-native';

// Theme interface for color customization (like React Native Paper)
export interface ThemeColors {
  primary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  textDisabled: string;
  onPrimary: string;
  onAccent: string;
  onBackground: string;
  onSurface: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  disabled: string;
  placeholder: string;
  backdrop: string;
  notification: string;
}

/**
 * Responsive StyleSheet utilities
 * Provides responsive sizing functions that can be used in StyleSheet.create()
 */
export class ResponsiveStyleSheet {
  // Screen dimensions
  private static screenWidth = Dimensions.get('window').width;
  private static screenHeight = Dimensions.get('window').height;
  private static pixelRatio = PixelRatio.get();

  // Design system constants
  private static readonly BASE_WIDTH = 375; // iPhone X width as base
  private static readonly BASE_HEIGHT = 812; // iPhone X height as base
  private static readonly BASE_FONT_SIZE = 16; // Base font size

  // Typography scale
  public static readonly FONT_SCALE = {
    xs: 0.75,    // 12px
    sm: 0.875,   // 14px
    base: 1,     // 16px
    lg: 1.125,   // 18px
    xl: 1.25,    // 20px
    '2xl': 1.5,  // 24px
    '3xl': 1.875, // 30px
    '4xl': 2.25,  // 36px
    '5xl': 3,     // 48px
    '6xl': 3.75,  // 60px
  };

  // Spacing scale
  public static readonly SPACING_SCALE = {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    24: 96,
    28: 112,
    32: 128,
  };

  // Border radius scale
  public static readonly BORDER_RADIUS_SCALE = {
    none: 0,
    sm: 2,
    base: 4,
    md: 6,
    lg: 8,
    xl: 12,
    '2xl': 16,
    '3xl': 24,
    '4xl': 32,
    full: 9999,
  };

  // Shadow scale
  public static readonly SHADOW_SCALE = {
    none: { shadowOpacity: 0, elevation: 0 },
    sm: { shadowOpacity: 0.05, elevation: 1 },
    base: { shadowOpacity: 0.1, elevation: 2 },
    md: { shadowOpacity: 0.15, elevation: 3 },
    lg: { shadowOpacity: 0.2, elevation: 4 },
    xl: { shadowOpacity: 0.25, elevation: 6 },
    '2xl': { shadowOpacity: 0.3, elevation: 8 },
  };





  // Breakpoints for responsive design
  public static readonly BREAKPOINTS = {
    xs: 320,
    sm: 375,
    md: 414,
    lg: 768,
    xl: 1024,
    '2xl': 1280,
  };

  /**
   * Calculate responsive width based on design width
   * @param width - Width in design units
   * @returns Responsive width
   */
  static width(width: number): number {
    return (width / this.BASE_WIDTH) * this.screenWidth;
  }

  /**
   * Calculate responsive height based on design height
   * @param height - Height in design units
   * @returns Responsive height
   */
  static height(height: number): number {
    return (height / this.BASE_HEIGHT) * this.screenHeight;
  }

  /**
   * Calculate responsive font size
   * @param size - Font size in design units
   * @returns Responsive font size
   */
  static fontSize(size: number): number {
    const scale = Math.min(this.screenWidth / this.BASE_WIDTH, this.screenHeight / this.BASE_HEIGHT);
    return Math.round(size * scale * this.pixelRatio) / this.pixelRatio;
  }

  /**
   * Get typography size based on scale
   * @param scale - Typography scale key
   * @returns Responsive font size
   */
  static typography(scale: keyof typeof ResponsiveStyleSheet.FONT_SCALE): number {
    const baseSize = this.BASE_FONT_SIZE * this.FONT_SCALE[scale];
    return this.fontSize(baseSize);
  }

  /**
   * Get spacing value
   * @param spacing - Spacing scale key
   * @returns Spacing value
   */
  static spacing(spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE): number {
    return this.SPACING_SCALE[spacing];
  }

  /**
   * Get responsive spacing
   * @param spacing - Spacing scale key
   * @returns Responsive spacing value
   */
  static responsiveSpacing(spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE): number {
    const baseSpacing = this.SPACING_SCALE[spacing];
    return this.width(baseSpacing);
  }

  /**
   * Generic spacing function - replaces all individual spacing functions
   * @param type - Type of spacing (margin, padding, gap)
   * @param direction - Direction (top, bottom, left, right, horizontal, vertical, all, sides)
   * @param spacing - Spacing scale key
   * @param sides - For 'sides' direction: [top, right, bottom, left]
   * @returns Responsive spacing value or object
   */
  static getSpacing(
    type: 'margin' | 'padding' | 'gap',
    direction: 'top' | 'bottom' | 'left' | 'right' | 'horizontal' | 'vertical' | 'all' | 'sides',
    spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE,
    sides?: [keyof typeof ResponsiveStyleSheet.SPACING_SCALE, keyof typeof ResponsiveStyleSheet.SPACING_SCALE, keyof typeof ResponsiveStyleSheet.SPACING_SCALE, keyof typeof ResponsiveStyleSheet.SPACING_SCALE]
  ): number | object {
    const value = this.responsiveSpacing(spacing);
    
    if (direction === 'sides' && sides) {
      const [top, right, bottom, left] = sides;
      if (type === 'margin') {
        return {
          marginTop: this.responsiveSpacing(top),
          marginRight: this.responsiveSpacing(right),
          marginBottom: this.responsiveSpacing(bottom),
          marginLeft: this.responsiveSpacing(left),
        };
      } else if (type === 'padding') {
        return {
          paddingTop: this.responsiveSpacing(top),
          paddingRight: this.responsiveSpacing(right),
          paddingBottom: this.responsiveSpacing(bottom),
          paddingLeft: this.responsiveSpacing(left),
        };
      }
    }
    
    switch (type) {
      case 'margin':
        switch (direction) {
          case 'top':
            return value;
          case 'bottom':
            return value;
          case 'left':
            return value;
          case 'right':
            return value;
          case 'horizontal':
            return value;
          case 'vertical':
            return value;
          case 'all':
            return { margin: value };
          default:
            return value;
        }
      case 'padding':
        switch (direction) {
          case 'top':
            return value;
          case 'bottom':
            return value;
          case 'left':
            return value;
          case 'right':
            return value;
          case 'horizontal':
            return value;
          case 'vertical':
            return value;
          case 'all':
            return { padding: value };
          default:
            return value;
        }
      case 'gap':
        return value;
      default:
        return value;
    }
  }

  /**
   * Get spacing for specific layout types
   * @param layoutType - Type of layout
   * @param spacing - Spacing scale key
   * @returns Responsive spacing value
   */
  static getLayoutSpacing(
    layoutType: 'list' | 'card' | 'button' | 'form' | 'navigation' | 'grid' | 'stack' | 'section',
    spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE
  ): number {
    return this.responsiveSpacing(spacing);
  }

  /**
   * Get border radius value
   * @param radius - Border radius scale key
   * @returns Border radius value
   */
  static borderRadius(radius: keyof typeof ResponsiveStyleSheet.BORDER_RADIUS_SCALE): number {
    return this.BORDER_RADIUS_SCALE[radius];
  }

  /**
   * Get responsive border radius
   * @param radius - Border radius scale key
   * @returns Responsive border radius value
   */
  static responsiveBorderRadius(radius: keyof typeof ResponsiveStyleSheet.BORDER_RADIUS_SCALE): number {
    const baseRadius = this.BORDER_RADIUS_SCALE[radius];
    return this.width(baseRadius);
  }

  /**
   * Get shadow configuration
   * @param shadow - Shadow scale key
   * @returns Shadow configuration object
   */
  static shadow(shadow: keyof typeof ResponsiveStyleSheet.SHADOW_SCALE) {
    const shadowConfig = this.SHADOW_SCALE[shadow];
    const shadowOffset = this.width(2);
    
    return {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: shadowOffset },
      shadowOpacity: shadowConfig.shadowOpacity,
      shadowRadius: shadowOffset,
      elevation: shadowConfig.elevation,
    };
  }

  /**
   * Get responsive shadow
   * @param shadow - Shadow scale key
   * @returns Responsive shadow configuration object
   */
  static responsiveShadow(shadow: keyof typeof ResponsiveStyleSheet.SHADOW_SCALE) {
    const shadowConfig = this.SHADOW_SCALE[shadow];
    const shadowOffset = this.width(2);
    
    return {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: shadowOffset },
      shadowOpacity: shadowConfig.shadowOpacity,
      shadowRadius: shadowOffset,
      elevation: shadowConfig.elevation,
    };
  }

  /**
   * Calculate aspect ratio
   * @param ratio - Aspect ratio (width/height)
   * @param width - Base width
   * @returns Object with width and height
   */
  static aspectRatio(ratio: number, width: number) {
    const responsiveWidth = this.width(width);
    const responsiveHeight = responsiveWidth / ratio;
    
    return {
      width: responsiveWidth,
      height: responsiveHeight,
    };
  }

  /**
   * Get responsive percentage width
   * @param percentage - Percentage of screen width (0-100)
   * @returns Responsive width
   */
  static percentageWidth(percentage: number): number {
    return (percentage / 100) * this.screenWidth;
  }

  /**
   * Get responsive percentage height
   * @param percentage - Percentage of screen height (0-100)
   * @returns Responsive height
   */
  static percentageHeight(percentage: number): number {
    return (percentage / 100) * this.screenHeight;
  }

  /**
   * Get responsive line height
   * @param fontSize - Font size
   * @param multiplier - Line height multiplier (default: 1.5)
   * @returns Responsive line height
   */
  static lineHeight(fontSize: number, multiplier: number = 1.5): number {
    const responsiveFontSize = this.fontSize(fontSize);
    return responsiveFontSize * multiplier;
  }

  /**
   * Get responsive letter spacing
   * @param spacing - Letter spacing in design units
   * @returns Responsive letter spacing
   */
  static letterSpacing(spacing: number): number {
    return this.width(spacing);
  }

  /**
   * Get responsive padding/margin for different sides
   * @param top - Top spacing
   * @param right - Right spacing
   * @param bottom - Bottom spacing
   * @param left - Left spacing
   * @returns Responsive spacing object
   */
  static responsiveSpacingSides(
    top: keyof typeof ResponsiveStyleSheet.SPACING_SCALE,
    right: keyof typeof ResponsiveStyleSheet.SPACING_SCALE,
    bottom: keyof typeof ResponsiveStyleSheet.SPACING_SCALE,
    left: keyof typeof ResponsiveStyleSheet.SPACING_SCALE
  ) {
    return {
      paddingTop: this.responsiveSpacing(top),
      paddingRight: this.responsiveSpacing(right),
      paddingBottom: this.responsiveSpacing(bottom),
      paddingLeft: this.responsiveSpacing(left),
    };
  }

  /**
   * Get responsive padding for different sides
   * @param top - Top spacing
   * @param right - Right spacing
   * @param bottom - Bottom spacing
   * @param left - Left spacing
   * @returns Responsive padding object
   */
  static responsivePaddingSides(
    top: keyof typeof ResponsiveStyleSheet.SPACING_SCALE,
    right: keyof typeof ResponsiveStyleSheet.SPACING_SCALE,
    bottom: keyof typeof ResponsiveStyleSheet.SPACING_SCALE,
    left: keyof typeof ResponsiveStyleSheet.SPACING_SCALE
  ) {
    return {
      paddingTop: this.responsiveSpacing(top),
      paddingRight: this.responsiveSpacing(right),
      paddingBottom: this.responsiveSpacing(bottom),
      paddingLeft: this.responsiveSpacing(left),
    };
  }

  /**
   * Get gap spacing for flex layouts
   * @param gap - Gap spacing scale key
   * @returns Responsive gap value
   */
  static gap(gap: keyof typeof ResponsiveStyleSheet.SPACING_SCALE): number {
    return this.responsiveSpacing(gap);
  }

  /**
   * Get margin between components
   * @param spacing - Spacing scale key
   * @returns Responsive margin object
   */
  static marginBetween(spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE) {
    return {
      marginBottom: this.responsiveSpacing(spacing),
    };
  }

  /**
   * Get margin top for spacing from previous component
   * @param spacing - Spacing scale key
   * @returns Responsive margin top
   */
  static marginTop(spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE): number {
    return this.responsiveSpacing(spacing);
  }

  /**
   * Get margin bottom for spacing to next component
   * @param spacing - Spacing scale key
   * @returns Responsive margin bottom
   */
  static marginBottom(spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE): number {
    return this.responsiveSpacing(spacing);
  }

  /**
   * Get margin left for horizontal spacing
   * @param spacing - Spacing scale key
   * @returns Responsive margin left
   */
  static marginLeft(spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE): number {
    return this.responsiveSpacing(spacing);
  }

  /**
   * Get margin right for horizontal spacing
   * @param spacing - Spacing scale key
   * @returns Responsive margin right
   */
  static marginRight(spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE): number {
    return this.responsiveSpacing(spacing);
  }

  /**
   * Get margin horizontal for left and right spacing
   * @param spacing - Spacing scale key
   * @returns Responsive margin horizontal
   */
  static marginHorizontal(spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE): number {
    return this.responsiveSpacing(spacing);
  }

  /**
   * Get margin vertical for top and bottom spacing
   * @param spacing - Spacing scale key
   * @returns Responsive margin vertical
   */
  static marginVertical(spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE): number {
    return this.responsiveSpacing(spacing);
  }

  /**
   * Get padding top
   * @param spacing - Spacing scale key
   * @returns Responsive padding top
   */
  static paddingTop(spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE): number {
    return this.responsiveSpacing(spacing);
  }

  /**
   * Get padding bottom
   * @param spacing - Spacing scale key
   * @returns Responsive padding bottom
   */
  static paddingBottom(spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE): number {
    return this.responsiveSpacing(spacing);
  }

  /**
   * Get padding left
   * @param spacing - Spacing scale key
   * @returns Responsive padding left
   */
  static paddingLeft(spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE): number {
    return this.responsiveSpacing(spacing);
  }

  /**
   * Get padding right
   * @param spacing - Spacing scale key
   * @returns Responsive padding right
   */
  static paddingRight(spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE): number {
    return this.responsiveSpacing(spacing);
  }

  /**
   * Get padding horizontal for left and right padding
   * @param spacing - Spacing scale key
   * @returns Responsive padding horizontal
   */
  static paddingHorizontal(spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE): number {
    return this.responsiveSpacing(spacing);
  }

  /**
   * Get padding vertical for top and bottom padding
   * @param spacing - Spacing scale key
   * @returns Responsive padding vertical
   */
  static paddingVertical(spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE): number {
    return this.responsiveSpacing(spacing);
  }

  /**
   * Get spacing for flex layouts with gap
   * @param gap - Gap spacing scale key
   * @returns Object with gap property
   */
  static flexGap(gap: keyof typeof ResponsiveStyleSheet.SPACING_SCALE) {
    return {
      gap: this.responsiveSpacing(gap),
    };
  }

  /**
   * Get spacing for row layouts with horizontal gap
   * @param gap - Gap spacing scale key
   * @returns Object with rowGap property
   */
  static rowGap(gap: keyof typeof ResponsiveStyleSheet.SPACING_SCALE) {
    return {
      rowGap: this.responsiveSpacing(gap),
    };
  }

  /**
   * Get spacing for column layouts with vertical gap
   * @param gap - Gap spacing scale key
   * @returns Object with columnGap property
   */
  static columnGap(gap: keyof typeof ResponsiveStyleSheet.SPACING_SCALE) {
    return {
      columnGap: this.responsiveSpacing(gap),
    };
  }

  /**
   * Get spacing for list items
   * @param spacing - Spacing scale key
   * @returns Responsive margin bottom for list items
   */
  static listItemSpacing(spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE): number {
    return this.responsiveSpacing(spacing);
  }

  /**
   * Get spacing for section dividers
   * @param spacing - Spacing scale key
   * @returns Responsive margin for section dividers
   */
  static sectionSpacing(spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE): number {
    return this.responsiveSpacing(spacing);
  }

  /**
   * Get spacing for card layouts
   * @param spacing - Spacing scale key
   * @returns Responsive margin for cards
   */
  static cardSpacing(spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE): number {
    return this.responsiveSpacing(spacing);
  }

  /**
   * Get spacing for button groups
   * @param spacing - Spacing scale key
   * @returns Responsive margin for button groups
   */
  static buttonGroupSpacing(spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE): number {
    return this.responsiveSpacing(spacing);
  }

  /**
   * Get spacing for form elements
   * @param spacing - Spacing scale key
   * @returns Responsive margin for form elements
   */
  static formElementSpacing(spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE): number {
    return this.responsiveSpacing(spacing);
  }

  /**
   * Get spacing for navigation items
   * @param spacing - Spacing scale key
   * @returns Responsive margin for navigation items
   */
  static navigationItemSpacing(spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE): number {
    return this.responsiveSpacing(spacing);
  }

  /**
   * Get spacing for grid layouts
   * @param spacing - Spacing scale key
   * @returns Responsive gap for grid layouts
   */
  static gridGap(spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE): number {
    return this.responsiveSpacing(spacing);
  }

  /**
   * Get spacing for stack layouts
   * @param spacing - Spacing scale key
   * @returns Responsive margin for stack layouts
   */
  static stackSpacing(spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE): number {
    return this.responsiveSpacing(spacing);
  }

  /**
   * Check if device is tablet
   * @returns True if device is tablet
   */
  static isTablet(): boolean {
    return this.screenWidth >= this.BREAKPOINTS.lg;
  }

  /**
   * Check if device is phone
   * @returns True if device is phone
   */
  static isPhone(): boolean {
    return this.screenWidth < this.BREAKPOINTS.lg;
  }

  /**
   * Check if device is landscape
   * @returns True if device is in landscape mode
   */
  static isLandscape(): boolean {
    return this.screenWidth > this.screenHeight;
  }

  /**
   * Check if device is portrait
   * @returns True if device is in portrait mode
   */
  static isPortrait(): boolean {
    return this.screenHeight > this.screenWidth;
  }

  /**
   * Get current breakpoint
   * @returns Current breakpoint key
   */
  static getCurrentBreakpoint(): keyof typeof ResponsiveStyleSheet.BREAKPOINTS {
    const breakpoints = Object.entries(this.BREAKPOINTS).sort((a, b) => a[1] - b[1]);
    
    for (let i = breakpoints.length - 1; i >= 0; i--) {
      if (this.screenWidth >= breakpoints[i][1]) {
        return breakpoints[i][0] as keyof typeof ResponsiveStyleSheet.BREAKPOINTS;
      }
    }
    
    return 'xs';
  }

  /**
   * Get device pixel ratio
   * @returns Device pixel ratio
   */
  static getPixelRatio(): number {
    return this.pixelRatio;
  }

  /**
   * Get screen dimensions
   * @returns Screen dimensions object
   */
  static getScreenDimensions() {
    return {
      width: this.screenWidth,
      height: this.screenHeight,
      pixelRatio: this.pixelRatio,
    };
  }

  /**
   * Get platform-specific value
   * @param iosValue - iOS specific value
   * @param androidValue - Android specific value
   * @returns Platform-specific value
   */
  static platform<T>(iosValue: T, androidValue: T): T {
    return Platform.OS === 'ios' ? iosValue : androidValue;
  }

  /**
   * Update dimensions when screen size changes
   */
  static updateDimensions(): void {
    const { width, height } = Dimensions.get('window');
    this.screenWidth = width;
    this.screenHeight = height;
    this.pixelRatio = PixelRatio.get();
  }

  // Predefined themes (like React Native Paper)
  public static readonly THEMES = {
    mp: {
      primary: '#004FA3',
      accent: '#002B54',
      background: '#ffffff',
      surface: '#ffffff',
      text: '#3f4048',
      textSecondary: '#6b7280',
      textDisabled: '#9ca3af',
      onPrimary: '#ffffff',
      onAccent: '#ffffff',
      onBackground: '#3f4048',
      onSurface: '#3f4048',
      error: '#ef4444',
      success: '#22c55e',
      warning: '#f59e0b',
      info: '#007aff',
      disabled: '#9ca3af',
      placeholder: '#9ca3af',
      backdrop: 'rgba(0, 0, 0, 0.5)',
      notification: '#ef4444',
    } as ThemeColors,
    
    pp: {
      primary: '#f8fafc',
      accent: '#007aff',
      background: '#1a1a1a',
      surface: '#2d2d2d',
      text: '#f8fafc',
      textSecondary: '#cbd5e1',
      textDisabled: '#64748b',
      onPrimary: '#1a1a1a',
      onAccent: '#1a1a1a',
      onBackground: '#f8fafc',
      onSurface: '#f8fafc',
      error: '#f87171',
      success: '#4ade80',
      warning: '#fbbf24',
      info: '#007aff',
      disabled: '#64748b',
      placeholder: '#64748b',
      backdrop: 'rgba(0, 0, 0, 0.7)',
      notification: '#f87171',
    } as ThemeColors,
  };

  // Current theme (defaults to light)
  private static currentTheme: keyof typeof ResponsiveStyleSheet.THEMES = 'mp';

  /**
   * Set the current theme
   * @param theme - Theme name
   */
  static setTheme(theme: keyof typeof ResponsiveStyleSheet.THEMES): void {
    this.currentTheme = theme;
  }

  /**
   * Get the current theme name
   * @returns Current theme name
   */
  static getCurrentTheme(): keyof typeof ResponsiveStyleSheet.THEMES {
    return this.currentTheme;
  }

  /**
   * Get colors for the current theme
   * @returns Current theme colors
   */
  static getThemeColors(): ThemeColors {
    return this.THEMES[this.currentTheme];
  }

  /**
   * Get colors for a specific theme
   * @param theme - Theme name
   * @returns Theme colors
   */
  static getColorsForTheme(theme: keyof typeof ResponsiveStyleSheet.THEMES): ThemeColors {
    return this.THEMES[theme];
  }
}

// Export commonly used utilities as standalone functions with clean, intuitive names
export const w = (width: number) => ResponsiveStyleSheet.width(width);
export const h = (height: number) => ResponsiveStyleSheet.height(height);
export const f = (size: number) => ResponsiveStyleSheet.fontSize(size);
export const t = (scale: keyof typeof ResponsiveStyleSheet.FONT_SCALE) => ResponsiveStyleSheet.typography(scale);
export const s = (spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE) => ResponsiveStyleSheet.spacing(spacing);
export const rs = (spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE) => ResponsiveStyleSheet.responsiveSpacing(spacing);
export const b = (radius: keyof typeof ResponsiveStyleSheet.BORDER_RADIUS_SCALE) => ResponsiveStyleSheet.borderRadius(radius);
export const rb = (radius: keyof typeof ResponsiveStyleSheet.BORDER_RADIUS_SCALE) => ResponsiveStyleSheet.responsiveBorderRadius(radius);
export const sh = (shadow: keyof typeof ResponsiveStyleSheet.SHADOW_SCALE) => ResponsiveStyleSheet.shadow(shadow);
export const rsh = (shadow: keyof typeof ResponsiveStyleSheet.SHADOW_SCALE) => ResponsiveStyleSheet.responsiveShadow(shadow);
export const ar = (ratio: number, width: number) => ResponsiveStyleSheet.aspectRatio(ratio, width);
export const pw = (percentage: number) => ResponsiveStyleSheet.percentageWidth(percentage);
export const ph = (percentage: number) => ResponsiveStyleSheet.percentageHeight(percentage);
export const lh = (fontSize: number, multiplier?: number) => ResponsiveStyleSheet.lineHeight(fontSize, multiplier);
export const ls = (spacing: number) => ResponsiveStyleSheet.letterSpacing(spacing);

// Generic spacing function - replaces all individual spacing functions
export const spacing = (
  type: 'margin' | 'padding' | 'gap',
  direction: 'top' | 'bottom' | 'left' | 'right' | 'horizontal' | 'vertical' | 'all' | 'sides',
  spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE,
  sides?: [keyof typeof ResponsiveStyleSheet.SPACING_SCALE, keyof typeof ResponsiveStyleSheet.SPACING_SCALE, keyof typeof ResponsiveStyleSheet.SPACING_SCALE, keyof typeof ResponsiveStyleSheet.SPACING_SCALE]
) => ResponsiveStyleSheet.getSpacing(type, direction, spacing, sides);

// Layout spacing helper
export const layoutSpacing = (
  layoutType: 'list' | 'card' | 'button' | 'form' | 'navigation' | 'grid' | 'stack' | 'section',
  spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE
) => ResponsiveStyleSheet.getLayoutSpacing(layoutType, spacing);

// Spacer utilities for adding space between components
export const spacer = (width: number = 0, height: number = 0) => ({
  width: ResponsiveStyleSheet.width(width),
  height: ResponsiveStyleSheet.height(height),
});
export const hspacer = (width: number) => ({
  width: ResponsiveStyleSheet.width(width),
});
export const vspacer = (height: number) => ({
  height: ResponsiveStyleSheet.height(height),
});
export const rvspacer = (spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE) => ({
  height: ResponsiveStyleSheet.responsiveSpacing(spacing),
});
export const rhspacer = (spacing: keyof typeof ResponsiveStyleSheet.SPACING_SCALE) => ({
  width: ResponsiveStyleSheet.responsiveSpacing(spacing),
});

// Gap utilities for flex containers
export const fgap = (gap: keyof typeof ResponsiveStyleSheet.SPACING_SCALE) => ResponsiveStyleSheet.flexGap(gap);
export const rgap = (gap: keyof typeof ResponsiveStyleSheet.SPACING_SCALE) => ResponsiveStyleSheet.rowGap(gap);
export const cgap = (gap: keyof typeof ResponsiveStyleSheet.SPACING_SCALE) => ResponsiveStyleSheet.columnGap(gap);

export const isTablet = () => ResponsiveStyleSheet.isTablet();
export const isPhone = () => ResponsiveStyleSheet.isPhone();
export const isLandscape = () => ResponsiveStyleSheet.isLandscape();
export const isPortrait = () => ResponsiveStyleSheet.isPortrait();
export const getCurrentBreakpoint = () => ResponsiveStyleSheet.getCurrentBreakpoint();
export const getPixelRatio = () => ResponsiveStyleSheet.getPixelRatio();
export const getScreenDimensions = () => ResponsiveStyleSheet.getScreenDimensions();
export const platform = <T>(iosValue: T, androidValue: T) => ResponsiveStyleSheet.platform(iosValue, androidValue); 