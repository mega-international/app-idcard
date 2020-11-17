<template>
  <div
    :class="color"
    class="value-card flex flex-col justify-center text-center px-4 py-2 rounded-lg">
    <h1 class="text-lg font-bold">{{ title }}</h1>
    <h2 class="text-sm">{{ value }}</h2>
  </div>
</template>

<script>
export default {
  name: 'value-card',
  props: {
    title: String,
    value: String
  },
  computed: {
    color() {
      switch (this.value) {
        case 'Medium':
          return 'medium';
        case 'Accepted':
        case 'Good':
          return 'good';
        case 'Poor':
          return 'poor';
        case 'Low':
          return 'low';
        default:
          return 'poor';
      }
    }
  }
};
</script>

<style scoped>
.value-card {
  min-height: 4rem;
}
.good {
  background-color: #59BB9F;
  color: #ffffff;
}
.medium {
  background-color: #efd777;
  color: #000000;
}
.low {
  background-color: #EF9035;
  color: #000000;
}
.poor {
  background-color: #D94153;
  color: #000000;
}
</style>
