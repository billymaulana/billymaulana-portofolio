export default defineNuxtPlugin((nuxtApp) => {
  const { startLoadingScreen } = useWelcomeScreen()
  nuxtApp.hook('page:loading:start', () => {
    startLoadingScreen()
  })
})
