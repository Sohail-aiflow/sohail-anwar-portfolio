export type Theme = "light" | "dark";

declare global {
  interface Window {
    __portfolioTheme?: { set: (theme: Theme) => void };
  }
}

// Trusted, static boot code runs in the head before body paint. No CMS data enters it.
export const themeBootstrap = `(() => {
  if (window.__portfolioTheme) return;
  const key = 'portfolio-theme';
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const valid = value => value === 'light' || value === 'dark';
  let preference;
  try { const saved = localStorage.getItem(key); if (valid(saved)) preference = saved; } catch {}
  const apply = () => { root.dataset.theme = preference || (media.matches ? 'dark' : 'light'); };
  window.__portfolioTheme = { set(theme) {
    if (!valid(theme)) return;
    preference = theme;
    try { localStorage.setItem(key, theme); } catch {}
    apply();
  }};
  media.addEventListener('change', () => { if (!preference) apply(); });
  window.addEventListener('storage', event => {
    if (event.key !== key && event.key !== null) return;
    preference = valid(event.newValue) ? event.newValue : undefined;
    apply();
  });
  apply();
})();`;
