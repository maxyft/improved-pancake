<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
html {
  font-size: 9.5px;
  @media (min-width: 768px) { font-size: 11px }
  @media (min-width: 1024px) { font-size: 13px }
  @media (min-width: 1280px) { font-size: 16px }
  @media (min-width: 1620px) { font-size: 18px }
  @media (min-width: 1920px) { font-size: 20px }
}
body {
  margin: 0;
}
#app {
  height: 100vh;
  width: 100vw;
  font-family: 'Calibri', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}
</style>
