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
CUSTOMER_CONFIGS=[{"customer":"ocuco","configs":{"gtmKey":"GTM-XXXX","builderApiKey":"AIzaSyD-ocuco","locale":"en-GB","phoneNumber":"1-800-555-0123","email":"support@ocuco.com"}},{"customer":"eyewish","configs":{"gtmKey":"GTM-XXXX","builderApiKey":"AIzaSyD-eyewish","locale":"nl-NL","phoneNumber":"020-123-4567","email":"support@eyewish.nl"}},{"customer":"abc","configs":{"gtmKey":"GTM-XXXX","builderApiKey":"AIzaSyD-abc","locale":"en-GB","email":"help@abc.com"}},{"customer":"xyz","configs":{"gtmKey":"GTM-XXXX","builderApiKey":"AIzaSyD-xyz","locale":"nl-NL","phoneNumber":"030-987-6543"}}]
```

### Configuration Schema

Each customer configuration includes:

- `customer`: Customer identifier (string)
- `configs.gtmKey`: HTML Key to load Google Tag Manager (string)
- `configs.builderApiKey`: API key for builder services (string)
- `configs.locale`: Language locale for the customer ('en-GB' | 'nl-NL') - optional, defaults to 'en-GB'
- `configs.phoneNumber`: Customer support phone number (string) - optional
- `configs.email`: Customer support email address (string) - optional

**Note**: All text content (titles, messages, etc.) is handled through the translation system. Only contact information and technical settings are stored in the customer configuration.

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file with your customer configurations (already provided)

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
│   ├── index.tsx           # Customer selection homepage
│   ├── [customer].tsx      # Dynamic customer maintenance page
│
├── styles/
│   ├── maintenance-components.module.css  # Maintenance page styles
├── utils/
│   └── appConfig.ts   # Customer configuration utilities
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
