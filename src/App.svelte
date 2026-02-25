<script>
  import { createTheme, systemPrefersDark } from '../core/theme.js'
  import content from '../content/en.json'

  const theme = createTheme({ storage: localStorage, prefersDark: systemPrefersDark })

  let current = $state(theme.resolve())

  $effect(() => {
    document.documentElement.classList.toggle('dark', current === 'dark')
  })

  const handleToggle = () => {
    current = theme.toggle(current)
  }
</script>

<div class="h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
  <h1 class="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-8">{content.app.title}</h1>
  <button
    onclick={handleToggle}
    data-testid="theme-toggle"
    aria-label={current === 'light' ? content.theme.switchToDark : content.theme.switchToLight}
    class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
  >
    {current === 'light' ? content.theme.darkLabel : content.theme.lightLabel}
  </button>
</div>
