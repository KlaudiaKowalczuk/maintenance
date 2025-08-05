# Customer Maintenance Page System

This Next.js application provides a dynamic maintenance page system that serves different configurations based on customer URLs.

## Features

- **Dynamic Customer Configuration**: Load different settings based on URL paths
- **Environment-based Configuration**: Customer configs stored in `.env.local`
- **Google Tag Manager Integration**: Conditional GTM loading based on customer settings
- **Responsive Design**: Mobile-friendly maintenance pages
- **TypeScript Support**: Full type safety for customer configurations

## Customer URLs

The application supports the following URL patterns:

- `maintenance.com/ocuco` - Loads OCUCO customer configuration
- `maintenance.com/eyewish` - Loads EyeWish customer configuration
- `maintenance.com/abc` - Loads ABC customer configuration
- `maintenance.com/xyz` - Loads XYZ customer configuration

## Configuration

Customer configurations are stored in the `.env.local` file:

```env
NEXT_PUBLIC_MAINTENANCE_DATE_END=2024-12-20T14:00:00Z
CUSTOMER_CONFIGS=[{"customer":"ocuco","config":{"gtmKey":"GTM-XXXX","builderApiKey":"AIzaSyD-ocuco","language":"en-GB","phone":"1-800-555-0123","email":"support@ocuco.com","logoUrl":"","faviconUrl":""}},{"customer":"eyewish","config":{"gtmKey":"GTM-XXXX","builderApiKey":"AIzaSyD-eyewish","language":"nl-NL","phone":"020-123-4567","email":"support@eyewish.nl","logoUrl":"","faviconUrl":""}},{"customer":"abc","config":{"gtmKey":"GTM-XXXX","builderApiKey":"AIzaSyD-abc","language":"en-GB","email":"help@abc.com","phone":"","logoUrl":"","faviconUrl":""}},{"customer":"xyz","config":{"gtmKey":"GTM-XXXX","builderApiKey":"AIzaSyD-xyz","language":"nl-NL","phone":"030-987-6543","email":"","logoUrl":"","faviconUrl":""}}]
```

### Configuration Schema

Each customer configuration includes:

- `customer`: Customer identifier (string)
- `config.gtmKey`: HTML Key to load Google Tag Manager (string)
- `config.builderApiKey`: API key for builder services (string)
- `config.language`: Language locale for the customer ('en-GB' | 'nl-NL') - optional, defaults to 'en-GB'
- `config.phone`: Customer support phone number (string) - optional
- `config.email`: Customer support email address (string) - optional
- `config.logoUrl`: URL for customer logo (string) - optional
- `config.faviconUrl`: URL for customer favicon (string) - optional

**Global Settings:**

- `NEXT_PUBLIC_MAINTENANCE_DATE_END`: ISO date string for when maintenance ends

**Note**: All text content (titles, messages, etc.) is handled through the translation system. Only contact information and technical settings are stored in the customer configuration.

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file with your customer configurations (.env.example provided)

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to see the customer selection page

## Project Structure

```
src/
├── pages/
│   ├── [customer].tsx      # Dynamic customer maintenance page
│
├── styles/
│   ├── maintenance-components.module.css  # Maintenance page styles
├── utils/
│   ├── appConfig.ts   # Customer configuration utilities
│   └── builderTheme.ts   # Theme fetching from Builder.io and CSS variable management
```

## Adding New Customers

To add a new customer:

1. Add their configuration to the `CUSTOMER_CONFIGS` array in `.env.local`
2. The new customer will automatically be available at `/[customer-name]`
3. Restart the development server to load the new configuration

## Deployment

Make sure to set the `CUSTOMER_CONFIGS` environment variable in your deployment environment.

## Development

- **Framework**: Next.js 14+ with TypeScript
- **Styling**: CSS Modules
- **Fonts**: Geist Sans and Geist Mono
- **Routing**: Next.js dynamic routing with `[customer].tsx`

### Utility Functions

- `getCustomerConfig(customerName)`: Returns configuration for specific customer
- `getTheme(builderApiKey)`: Fetches customer theme from Builder.io and applies global CSS variables

## Internationalization

The application supports multiple languages:

- **English (UK)**: `en-GB`
- **Dutch (Netherlands)**: `nl-NL`

### Translation Files

Translation files are located in the `locales/` directory:

- `locales/en-GB.json` - English translations
- `locales/nl-NL.json` - Dutch translations

### Language Configuration

Each customer can have a specific locale configured in their settings. The application will automatically:

1. Use the customer's configured locale from the environment variable
2. Fall back to English (en-GB) if no locale is specified
3. Load the appropriate translations for all UI text

### Adding New Languages

To add a new language:

1. Create a new JSON file in the `locales/` directory (e.g., `fr-FR.json`)
2. Add the locale to the Next.js i18n configuration in `next.config.ts`
3. Update the customer configuration interface to include the new locale
4. Add translations for all keys following the existing structure
