# Firebase setup (for accounts + saved CVs)

Do these once, then send me the **config object** from step 4. ~10 minutes.

## 1. Create the project
1. Go to https://console.firebase.google.com → **Add project**.
2. Name it (e.g. `cvify-ai`). Google Analytics is optional — you can skip it.

## 2. Enable sign-in methods
1. In the project: **Build → Authentication → Get started**.
2. **Sign-in method** tab → enable **Google** (pick a support email) and **Email/Password**.
3. Later, before launch: **Authentication → Settings → Authorized domains** → add `www.cvifyai.com` (localhost and the vercel.app domain are usually there already).

## 3. Create the database
1. **Build → Firestore Database → Create database**.
2. Start in **production mode** (we'll add security rules in code). Pick a region close to your users.

## 4. Get the web config  ← send me this
1. Project **Settings** (gear icon) → **General** → scroll to **Your apps**.
2. Click the **Web** icon (`</>`), register an app (nickname `cvify-web`), **don't** enable Hosting.
3. Copy the `firebaseConfig` object it shows — looks like:
   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "cvify-ai.firebaseapp.com",
     projectId: "cvify-ai",
     storageBucket: "cvify-ai.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abc123",
   };
   ```
   **Paste that whole object to me.** These values are public-safe (they ship in the browser of every Firebase web app) — security comes from the Firestore rules, not from hiding these.

## What I do with it
- Add the values as `NEXT_PUBLIC_FIREBASE_*` environment variables in Vercel (and `.env.local` for local).
- Wire up Google + Email sign-in, the dashboard, and cloud-saved CVs.
- Add Firestore security rules so each user can only read/write their own data.

## What you should NOT send
- The **service account JSON** / any "Admin SDK" private key. We don't need it for this (client SDK + security rules is enough). Keep that secret.
