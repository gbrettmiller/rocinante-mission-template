/**
 * Creates a theme controller with injected dependencies.
 * @param {{ storage: { getItem: (k: string) => string|null, setItem: (k: string, v: string) => void }, prefersDark: () => boolean }} deps
 */
export const createTheme = ({ storage, prefersDark }) => {
  const STORAGE_KEY = 'theme'

  const resolve = () => {
    const saved = storage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
    return prefersDark() ? 'dark' : 'light'
  }

  const toggle = (current) => {
    const next = current === 'light' ? 'dark' : 'light'
    storage.setItem(STORAGE_KEY, next)
    return next
  }

  return { resolve, toggle }
}

/** Production dep: reads window.matchMedia */
export const systemPrefersDark = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
