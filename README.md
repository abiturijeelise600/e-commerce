# ABITIJELISE E-commerce

A React + Vite storefront demo for Rwanda with RWF product pricing, product categories, search, a browser-persisted cart, demo login/register, and WhatsApp order handoff.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Create a production build with `npm run build`.

## Important demo limitations

- There is no backend or database. Accounts and cart are stored in the current browser only. Do not use a real password; demo authentication is not secure.
- MTN Mobile Money and Tigo are listed as preferred payment choices only. This site does not process payments. Payment integrations require provider credentials and a secure backend.
- Orders are composed as a WhatsApp message to +250 796 365 450. Verify the social account URLs and product details before publishing.
