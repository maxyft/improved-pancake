<template>
  <div class="new-orders-wrapper">
    <div class="orders-top">Create Order</div>
    <div class="order-create">
      <div class="unselected"> << Select Pair >> </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderCreate'
}
</script>

<style lang="less" scoped>

@back: #0b090f;
@primary-text: #cfd4d2;
@primary-border-transparent: rgba(161, 177, 118, .2);

.new-orders-wrapper {
  background: @back;
  .orders-top {
    height: 30px;
    background: @back;
    color: @primary-text;
    font-size: 1.1rem;
    line-height: 30px;
  }
  .order-create {
    display: table;
    width: 100%;
    height: calc(100% - 30px);
    .unselected {
      height: 100%;
      width: 100%;
      display: table-cell;
      vertical-align: middle;
      color: white;
      border-top: 1px solid @primary-border-transparent;
      border-bottom: 1px solid @primary-border-transparent;
    }
  }
}
</style>
