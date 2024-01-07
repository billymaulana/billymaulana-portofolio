export function useWelcomeScreen() {
  const isLoadingScreen = useState('isLoadingScreen', () => false)

  function startLoadingScreen() {
    isLoadingScreen.value = true
  }
  function stopLoadingScreen() {
    isLoadingScreen.value = false
  }

  return {
    isLoadingScreen,
    startLoadingScreen,
    stopLoadingScreen
  }
}
