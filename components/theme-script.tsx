export function ThemeScript() {
  const script = `(function(){var t=localStorage.getItem('theme');if(!t||t==='system')t=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';document.documentElement.classList.toggle('dark',t==='dark');document.documentElement.style.colorScheme=t==='dark'?'dark':'light'})()`;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
