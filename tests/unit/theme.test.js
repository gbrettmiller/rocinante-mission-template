import { describe, it, expect } from 'vitest'
import { createTheme } from '../../core/theme.js'

const makeStorage = (initial = {}) => {
  const data = { ...initial }
  return {
    getItem: (k) => data[k] ?? null,
    setItem: (k, v) => { data[k] = v },
    _data: data,
  }
}

describe('createTheme', () => {
  describe('resolve', () => {
    it('returns saved "light" preference over system dark', () => {
      const storage = makeStorage({ theme: 'light' })
      const { resolve } = createTheme({ storage, prefersDark: () => true })
      expect(resolve()).toBe('light')
    })

    it('returns saved "dark" preference over system light', () => {
      const storage = makeStorage({ theme: 'dark' })
      const { resolve } = createTheme({ storage, prefersDark: () => false })
      expect(resolve()).toBe('dark')
    })

    it('falls back to "dark" when system prefers dark and no saved pref', () => {
      const storage = makeStorage()
      const { resolve } = createTheme({ storage, prefersDark: () => true })
      expect(resolve()).toBe('dark')
    })

    it('falls back to "light" when system prefers light and no saved pref', () => {
      const storage = makeStorage()
      const { resolve } = createTheme({ storage, prefersDark: () => false })
      expect(resolve()).toBe('light')
    })

    it('ignores invalid saved values and falls back to system pref', () => {
      const storage = makeStorage({ theme: 'sepia' })
      const { resolve } = createTheme({ storage, prefersDark: () => true })
      expect(resolve()).toBe('dark')
    })
  })

  describe('toggle', () => {
    it('toggles light to dark', () => {
      const storage = makeStorage()
      const { toggle } = createTheme({ storage, prefersDark: () => false })
      expect(toggle('light')).toBe('dark')
    })

    it('toggles dark to light', () => {
      const storage = makeStorage()
      const { toggle } = createTheme({ storage, prefersDark: () => false })
      expect(toggle('dark')).toBe('light')
    })

    it('persists the toggled value to storage', () => {
      const storage = makeStorage()
      const { toggle } = createTheme({ storage, prefersDark: () => false })
      toggle('light')
      expect(storage.getItem('theme')).toBe('dark')
    })

    it('overwrites a previous saved value', () => {
      const storage = makeStorage({ theme: 'light' })
      const { toggle } = createTheme({ storage, prefersDark: () => false })
      toggle('light')
      expect(storage.getItem('theme')).toBe('dark')
    })
  })
})
