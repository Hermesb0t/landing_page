This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Facebook business Page onboarding

The Facebook app must be allowed to request `business_management`, `pages_show_list`,
`pages_read_engagement`, `pages_manage_metadata`, and `pages_messaging`. For customer
accounts outside the app's roles, check that the app is live and has the required
Advanced Access/App Review approvals in Meta's dashboard. Adding a scope in code
cannot grant permissions that Meta has not approved for the app.

If the app uses Facebook Login for Business, set `FACEBOOK_LOGIN_CONFIG_ID` on the
server to its configuration ID. Configure it for a **user access token** (this app
uses `/me`, `/me/permissions`, and `/me/businesses`), with the permissions above
and Page assets. When unset, the app uses the standard Facebook Login scope list.
`FACEBOOK_GRAPH_VERSION` controls the Graph API and login dialog version.

After changing permissions or the login configuration, existing customers must
use **Reconnect Facebook** and select their business and Pages in Facebook's
consent screen. The app checks granted permissions before listing businesses;
an existing session does not automatically gain newly requested permissions.
If permission is granted but Facebook still rejects a business lookup, check the
person's Page assignment and the app's business access instead of repeatedly
asking them to grant the same permission.

References: [Meta permission checks and re-requesting consent](https://developers.facebook.com/docs/facebook-login/permissions/requesting-and-revoking/),
[Facebook Login for Business](https://developers.facebook.com/docs/facebook-login/facebook-login-for-business/).

Run the mocked Graph API regression tests with `npm test`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
