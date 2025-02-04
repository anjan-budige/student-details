import "@/app/globals.css"; // This should be in _app.js or _app.tsx

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
