// Keeps an open or home-screen copy of the app up to date. Browsers may
// show a saved copy of the page, so each time the app is opened or brought
// back to the front we ask the server which build is live and, if it is
// newer than the one running, load it.
const RUNNING = __BUILD_ID__;
const TRIED_KEY = 'kd.updateTried';

async function checkForUpdate() {
  try {
    const res = await fetch(`./version.json?t=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return;
    const { id } = await res.json();
    if (!id || id === RUNNING) return;
    // Try each new build only once per visit, so a slow rollout can't cause a reload loop.
    if (sessionStorage.getItem(TRIED_KEY) === id) return;
    sessionStorage.setItem(TRIED_KEY, id);
    // A fresh address makes the browser fetch the new page instead of its saved copy.
    const url = new URL(window.location.href);
    url.searchParams.set('v', id);
    window.location.replace(url);
  } catch {
    /* offline or storage blocked: keep using the current copy */
  }
}

export function watchForUpdates() {
  if (import.meta.env.DEV) return;
  checkForUpdate();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkForUpdate();
  });
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) checkForUpdate();
  });
}
