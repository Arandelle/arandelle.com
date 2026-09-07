export function ThemeScript() {
  const script = `
(function() {
  var theme = localStorage.getItem('theme');
  if (!theme) theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  if (theme === 'system') theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light';
})();
`;
  // Using <template> to suppress the React script-in-SSR warning,
  // while still executing the script on the client during hydration.
  return (
    <template dangerouslySetInnerHTML={{ __html: `<script>${script}</script>` }} />
  );
}
