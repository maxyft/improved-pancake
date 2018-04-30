<template>
  <div>
      <topNav></topNav>
      <extendedStat></extendedStat>
  </div>
</template>

<script>
import topNav from './topNav'
import extendedStat from './extendedStat'

export default {
  name: 'trdMain',
  components: {
      topNav: topNav,
      extendedStat: extendedStat
  }
}
</script>

<style scoped>
  div {
    display: flex;
    flex-direction: column;
    background: black;
    height: 100vh;
  }
</style>
