<script setup>
import gsap,{Circ} from 'gsap';

const { isLoadingScreen, stopLoadingScreen } = useWelcomeScreen()

const welcomeScreenAnimation = () => {
  let { body } = document
  let textLoading = document.querySelectorAll('.text-loading');
  let animationTime = 0.7;
  let translateY = 100;
  
  let timeline = gsap.timeline({
    onStart: function(){
      body.classList.add('welcome-screen') 
    },
    onComplete: function(){
      body.classList.remove('welcome-screen')
      stopLoadingScreen()
    }
  });
  
  timeline
    .add(gsap.fromTo(textLoading,
      { 
        opacity:0, 
        y: translateY, 
        ease: Circ.easeInOut, 
        duration:animationTime,
        stagger:2
      },
      { 
        y: 0, 
        opacity:1, 
        ease: Circ.easeInOut, 
        stagger:2,
        duration:animationTime,
      },
    ))
    .add(gsap.to(textLoading,animationTime,{
      delay: animationTime,
      opacity: 0,
      y: -translateY,
      ease: Circ.easeInOut, 
      stagger:2
    },1)
  ,1)
}

onMounted(() => {
  welcomeScreenAnimation()
})
</script>
<template>
  <div class="loading-screen" v-if="isLoadingScreen">
    <div class="text-loading">
      BILLY MAULANA
    </div>
    <div class="text-loading">
      ᮘᮤᮜ᮪ᮜ᮪ᮚ᮪ ᮙᮅᮜᮔ
    </div>
    <div class="text-loading">
      БИЛЛИ МАУЛАНА
    </div>
    <div class="text-loading">
      ビリー・モーラナ
    </div>
    <div class="text-loading">
      بیلی مولانا
    </div>
    <div class="text-loading">
      ꧋ꦧꦶꦭ꧀ꦭ꧀ꦪ꧀ꦩꦈꦭꦤ
    </div>
    <div class="text-loading">
      ᬩᬇᬮ᭄ᬮ᭄ᬬ᭄᭄ᬫᬅᬳᬉᬮᬅᬦᬅ
    </div>
    <div class="text-loading">
      ᯅᯪᯞ᯲ᯞ᯲ᯛ᯲ ᯔᯥᯞᯉ
    </div>
  </div>
</template>

<style lang="css">
.welcome-screen{
  transition: all 0.5s ease-in;
  background:#0E1215;
  overflow: hidden;
  height:100vh;
  width: 100vw;
}
.loading-screen {
  display: flex;
  height:100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.text-loading{
  font-size: 48px;
  color: #ffffff;
  letter-spacing: 10px;
  position: absolute;
  width: 100%;
  text-align: center;
  height: 100%;
  opacity: 0;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  right: 0;
}
</style>
