<template>
  <div class="orders-wrapper">
    <div class="inside-orders-wrapper">
      <div class="tab-selector-wrapper">
        <div class="tab-selector" v-bind:class="{ active: index === 0 }" v-for="(elem,index) in elems" @click="setTab($event, elem)">{{ elem }}</div>
      </div>
      <div class="tab-wrapper">
        <component v-bind:is="currentComponent"></component>
      </div>
    </div>
  </div>
</template>

<script>
  import $ from 'jquery'
  import OrderCreate from './OrderCreate'
  import OrderList from './OrderList'

  export default {
    name: 'Orders',
    components: {
      OrderCreate: OrderCreate,
      OrderList: OrderList
    },
    data() {
      return {
        elems: ['Order Create', 'Order List'],
        currentTab: 'Order Create'
      }
    },
    computed: {
      currentComponent() {
        return this.currentTab.split(' ').join('');
      }
    },
    methods: {
      setTab(event, elem) {
        this.currentTab = elem;
        $('.tab-selector-wrapper').find('.active').removeClass('active');
        $(event.target).addClass('active');
      }
    }
}
</script>
<style lang='less' scoped>

@back: #0b090f;
@primary-text: #cfd4d2;
@primary-border: #a1b176;
@primary-border-transparent: rgba(161, 177, 118, .2);
@dark-border: #586c0c;

.orders-wrapper {
  grid-area: orders;
  padding: 10px 0 15px 15px;
  overflow: hidden;
  .inside-orders-wrapper {
    width: 100%;
    height: 100%;
    background: @back;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .tab-selector-wrapper {
      flex: auto;
      flex-grow: 0;
      @media (max-width: 768px) { height: 30px; line-height: 30px; font-size: 0.9rem }
      @media (min-width: 769px) { height: 35px; line-height: 35px; font-size: 1rem }
      background: lighten(@back, 3.5%);
      .tab-selector {
        float: left;
        position: relative;
        color: @primary-text;
        text-align: center;
        cursor: pointer;
        margin-left: 8px;
        margin-right: 8px;
        &.active::after {
          content: '';
          width: 100%;
          position: absolute;
          height: 1px;
          background: lighten(@dark-border, 35%);
          bottom: 3.5px;
          left: 0;
          z-index: 999;
        }
      }
    }
    .tab-wrapper {
      flex: auto;
      overflow-y: auto;
      &::-webkit-scrollbar { width: 0; }
    }
  }
}
</style>
