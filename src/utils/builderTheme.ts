import { AppConfig } from './appConfig';

interface ThemeColors {
  [key: string]: {
    base?: { main?: string };
    invert?: { main?: string };
  };
}

interface ButtonVariant {
  buttonColor?: string;
  borderRadius?: string;
  fontWeight?: string;
}

interface ButtonTheme {
  buttonVariants: { [key: string]: ButtonVariant };
}

interface TypographyHeading {
  lineHeight?: string;
  fontWeight?: string;
  fontSize?: string;
}

interface Typography {
  bodyFontFamily?: string;
  headings?: {
    heading1?: TypographyHeading;
    heading2?: TypographyHeading;
    heading3?: TypographyHeading;
    heading4?: TypographyHeading;
  };
}

interface TextInput {
  height?: string;
  padding?: string;
  color?: string;
  labelColor?: string;
}

interface CustomFont {
  fontFamily: string;
  fontWeight: string;
  externalSources: Array<{ url: string }>;
}

interface LoginStyles {
  buttonStyle?: string;
}

interface ThemeData {
  login?: LoginStyles;
  colors?: ThemeColors;
  button?: ButtonTheme;
  typography?: Typography;
  textInput?: TextInput;
  customFonts?: CustomFont[];
}

interface ThemeResponse {
  results?: Array<{ data?: ThemeData }>;
}

export async function getTheme(customerConfig: AppConfig): Promise<boolean | undefined> {
  const root = document.documentElement;
  const builderApiKey = customerConfig.configs.builderApiKey;
  const customerName = customerConfig.customer.toLowerCase();
  
  try {
    // You can also query, sort, and target this content.
    // See full docs on our content API: https://www.builder.io/c/docs/query-api
    const response = await fetch(
      `https://cdn.builder.io/api/v3/content/theme?apiKey=${builderApiKey}&userAttributes.customer=${customerName}`
    );
    
    const themeJson: ThemeResponse = await response.json();
    const theme = themeJson?.results?.[0]?.data;
    
    if (!theme || Object.keys(theme).length === 0) {
      return;
    }

    console.log('Theme loaded successfully:', theme);

    const loginStyles = theme.login;
    const themeColors = theme.colors;
    const buttonStyle = theme.button?.buttonVariants?.[loginStyles?.buttonStyle || 'variant1'];
    const buttonColorKey = buttonStyle?.buttonColor?.toLowerCase();
    const buttonColor = buttonColorKey ? themeColors?.[buttonColorKey]?.base?.main : undefined;
    const buttonInverseColor = buttonColorKey ? themeColors?.[buttonColorKey]?.invert?.main : undefined;

    // Button styles
    if (buttonColor) {
      root.style.setProperty('--button-bg-color', buttonColor);
      root.style.setProperty('--button-border-color', buttonColor);
    }
    if (buttonStyle?.borderRadius) {
      root.style.setProperty('--button-border-radius', buttonStyle.borderRadius);
    }
    if (buttonInverseColor) {
      root.style.setProperty('--button-text-color', buttonInverseColor);
    }
    if (buttonStyle?.fontWeight) {
      root.style.setProperty('--button-font-weight', buttonStyle.fontWeight);
    }

    // Heading styles
    const heading1 = theme.typography?.headings?.heading1;
    if (heading1?.lineHeight) {
      root.style.setProperty('--heading1-line-height', heading1.lineHeight);
    }
    if (heading1?.fontWeight) {
      root.style.setProperty('--heading1-font-weight', heading1.fontWeight);
    }
    if (heading1?.fontSize) {
      root.style.setProperty('--heading1-font-size', heading1.fontSize);
    }

    const heading2 = theme.typography?.headings?.heading2;
    if (heading2?.lineHeight) {
      root.style.setProperty('--heading2-line-height', heading2.lineHeight);
    }
    if (heading2?.fontWeight) {
      root.style.setProperty('--heading2-font-weight', heading2.fontWeight);
    }
    if (heading2?.fontSize) {
      root.style.setProperty('--heading2-font-size', heading2.fontSize);
    }

    const heading3 = theme.typography?.headings?.heading3;
    if (heading3?.lineHeight) {
      root.style.setProperty('--heading3-line-height', heading3.lineHeight);
    }
    if (heading3?.fontWeight) {
      root.style.setProperty('--heading3-font-weight', heading3.fontWeight);
    }
    if (heading3?.fontSize) {
      root.style.setProperty('--heading3-font-size', heading3.fontSize);
    }

    const heading4 = theme.typography?.headings?.heading4;
    if (heading4?.lineHeight) {
      root.style.setProperty('--heading4-line-height', heading4.lineHeight);
    }
    if (heading4?.fontWeight) {
      root.style.setProperty('--heading4-font-weight', heading4.fontWeight);
    }
    if (heading4?.fontSize) {
      root.style.setProperty('--heading4-font-size', heading4.fontSize);
    }

    // Font styles
    if (theme.typography?.bodyFontFamily) {
      root.style.setProperty(
        '--body-font-family', 
        `${theme.typography.bodyFontFamily}, blinkmacsystemfont, -apple-system, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, Helvetica, Arial, sans-serif`
      );
    }
    
    // Custom fonts
    if (theme.customFonts && theme.customFonts.length > 0) {
      const fontPromises: Promise<FontFace>[] = [];
      
      for (const customFont of theme.customFonts) {
        const fontUrl = `https://ohdevstorage.blob.core.windows.net/fonts/${customerName}/${customFont.externalSources[0].url}`;
        
        const fontWoff = new FontFace(customFont.fontFamily, `url(${fontUrl})`, {
          weight: customFont.fontWeight
        });
        
        const fontWoff2 = new FontFace(customFont.fontFamily, `url(${fontUrl})`, {
          weight: customFont.fontWeight
        });
        
        fontPromises.push(fontWoff.load(), fontWoff2.load());
        
        // Add fonts to document
        document.fonts.add(fontWoff);
        document.fonts.add(fontWoff2);
      }
      
      await Promise.all(fontPromises);
      await document.fonts.ready;
      return true;
    }

    // Color variables
    if (themeColors) {
      Object.keys(themeColors).forEach(colorKey => {
        const colorData = themeColors[colorKey];
        if (colorData.base?.main) {
          root.style.setProperty(`--color-${colorKey}`, colorData.base.main);
        }
        if (colorData.invert?.main) {
          root.style.setProperty(`--color-${colorKey}-invert`, colorData.invert.main);
        }
      });
    }

    // Text input styles
    if (theme.textInput) {
      if (theme.textInput.color) {
        root.style.setProperty('--text-primary', theme.textInput.color);
      }
      if (theme.textInput.labelColor) {
        root.style.setProperty('--text-secondary', theme.textInput.labelColor);
      }
    }

    return true;
  } catch (error) {
      console.warn('Error loading theme:', error);
    return false;
  }
}