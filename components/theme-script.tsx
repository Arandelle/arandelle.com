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
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
