// Export estático: no hay middleware, así que el idioma se elige en el cliente.
const REDIRECT = `(function(){var l=(navigator.languages&&navigator.languages[0])||navigator.language||'en';var p=/^es\\b/i.test(l)?'/es/':'/en/';location.replace(p+location.hash)})()`;

export default function RootRedirect() {
  return (
    <main className="grid min-h-dvh place-items-center p-6 text-center">
      <script dangerouslySetInnerHTML={{ __html: REDIRECT }} />
      <p>
        <a className="underline" href="/en/">English</a>
        {' · '}
        <a className="underline" href="/es/">Español</a>
      </p>
    </main>
  );
}
