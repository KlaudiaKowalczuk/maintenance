import { AppConfig } from "./appConfig";

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
    externalSources: Array<{ url: string, format: string }>;
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

const loadedFonts = new Set<string>();

function applyCSSVariables(
    root: HTMLElement,
    variables: Record<string, string>
) {
    Object.entries(variables).forEach(([key, value]) => {
        if (value) {
            root.style.setProperty(key, value);
        }
    });
}

export async function getTheme(
    customerConfig: AppConfig
): Promise<boolean | undefined> {
    const root = document.documentElement;
    const builderApiKey = customerConfig.config.builderApiKey;
    const customerName = customerConfig.customer.toLowerCase();

    try {
        const response = await fetch(
            `https://cdn.builder.io/api/v3/content/theme?apiKey=${builderApiKey}&userAttributes.customer=${customerName}&enrich=true&includeRefs=true`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const themeJson: ThemeResponse = await response.json();
        const theme = themeJson?.results?.[0]?.data;

        if (!theme || Object.keys(theme).length === 0) {
            return;
        }

        console.log("Theme loaded:", theme);

        const loginStyles = theme.login;
        const themeColors = theme.colors;
        const buttonStyle =
            theme.button?.buttonVariants?.[
                loginStyles?.buttonStyle || "variant1"
            ];
        const buttonColorKey = buttonStyle?.buttonColor?.toLowerCase();
        const buttonColor = buttonColorKey
            ? themeColors?.[buttonColorKey]?.base?.main
            : undefined;
        const buttonInverseColor = buttonColorKey
            ? themeColors?.[buttonColorKey]?.invert?.main
            : undefined;

        const cssVariables: Record<string, string> = {};

        // Button styles
        if (buttonColor) {
            cssVariables["--button-bg-color"] = buttonColor;
            cssVariables["--button-border-color"] = buttonColor;
        }
        if (buttonStyle?.borderRadius) {
            cssVariables["--button-border-radius"] = buttonStyle.borderRadius;
        }
        if (buttonInverseColor) {
            cssVariables["--button-text-color"] = buttonInverseColor;
        }
        if (buttonStyle?.fontWeight) {
            cssVariables["--button-font-weight"] = buttonStyle.fontWeight;
        }

        // Heading styles
        const headings = theme.typography?.headings;
        if (headings) {
            Object.entries(headings).forEach(([headingKey, heading]) => {
                if (heading) {
                    const headingNum = headingKey.replace("heading", "");
                    if (heading.lineHeight) {
                        cssVariables[`--heading${headingNum}-line-height`] =
                            heading.lineHeight;
                    }
                    if (heading.fontWeight) {
                        cssVariables[`--heading${headingNum}-font-weight`] =
                            heading.fontWeight;
                    }
                    if (heading.fontSize) {
                        cssVariables[`--heading${headingNum}-font-size`] =
                            heading.fontSize;
                    }
                }
            });
        }

        // Font styles
        if (theme.typography?.bodyFontFamily) {
            cssVariables["--body-font-family"] =
                theme.typography.bodyFontFamily;
        }

        // Color variables
        if (themeColors) {
            Object.entries(themeColors).forEach(([colorKey, colorData]) => {
                if (colorData.base?.main) {
                    cssVariables[`--color-${colorKey}`] = colorData.base.main;
                }
                if (colorData.invert?.main) {
                    cssVariables[`--color-${colorKey}-invert`] =
                        colorData.invert.main;
                }
            });
        }

        applyCSSVariables(root, cssVariables);

        // Handle custom fonts
        if (theme.customFonts && theme.customFonts.length > 0) {
            const fontPromises: Promise<FontFace>[] = [];

            for (const customFont of theme.customFonts) {
                const fontKey = `${customFont.fontFamily}-${customFont.fontWeight}`;

                if (loadedFonts.has(fontKey)) {
                    continue;
                }

                const fontUrl = `https://ohdevstorage.blob.core.windows.net/fonts/${encodeURIComponent(customerName)}/${encodeURIComponent(customFont.externalSources[0].url)}`;
                const format = customFont.externalSources[0].format;
                const src = `url(${fontUrl}) format('${format}')`;

                const fontWoff = new FontFace(
                    customFont.fontFamily,
                    src,
                    {
                        weight: customFont.fontWeight,
                    }
                );

                const fontWoff2 = new FontFace(
                    customFont.fontFamily,
                    `url(${fontUrl})`,
                    {
                        weight: customFont.fontWeight,
                    }
                );

                fontPromises.push(fontWoff.load(), fontWoff2.load());

                document.fonts.add(fontWoff);
                document.fonts.add(fontWoff2);

                loadedFonts.add(fontKey);
            }

            if (fontPromises.length > 0) {
                await Promise.all(fontPromises);
                await document.fonts.ready;
            }
        }

        return true;
    } catch (error) {
        console.warn("Error loading theme:", error);
        return false;
    }
}
