<template>
  <div class="grid">
    <Nav></Nav>
    <Chart
      v-bind:active="active"
      @changeTimeframe="changeTimeFrame($event)">
    </Chart>
    <Orders></Orders>
    <PairList
      @updated='setActive($event)'
      v-bind:timeframe="timeframe">
    </PairList>
  </div>
</template>

<script>
import Nav from './Nav'
import Chart from './Chart'
import Orders from './Orders'
import PairList from './PairList'

export default {
  name: 'Main',
  components: {
      Nav: Nav,
      Chart: Chart,
      Orders: Orders,
      PairList: PairList
  },
  data() {
    return {
      active: [],
      timeframe: '5m'
    }
  },
  methods: {
    setActive(event) { // event - payload from PairStat, type - Array
      this.active = event;
    },
    changeTimeFrame(event) { // event - payload from Chart, type - String
      this.timeframe = event;
    }
  }
}
</script>

<style scoped lang="less">
.grid {
  width: 100%;
  height: 100%;
  background: darken(#211f26, 2.5%);
  display: grid;
  grid-template-rows: 40px 75% auto;
  grid-template-columns: 72.5% 27.5%;
  grid-template-areas:
  "header header"
  "chart list"
  "orders list";
}
</style>
