# Cube Tracker

A website that tracks entries for speedcubing times.

## Website

https://emyhrberg.github.io/cube-tracker

## Run

To run the website in a web browser with localhost:

```
npm start
```

## Environment setup (Firebase)

Client apps must embed Firebase config at build time, but don’t commit keys in source. Create a local env file:

1. Copy `.env.example` to `.env.local` and fill in your project values:

```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
REACT_APP_FIREBASE_MEASUREMENT_ID=...
```

2. In Firebase Console → Authentication → Settings → Authorized domains, add:

   - emyhrberg.github.io (for GitHub Pages)
   - localhost (for local dev)

3. Restart the dev server after editing `.env.local`.

## Deploy

To deploy the website using GitHub Pages:

```
npm build
npm run deploy
```

Note: The built site includes Firebase config (that’s normal for client apps). Protect your project using security rules and Authorized domains.
