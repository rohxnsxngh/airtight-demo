<template>
  <Calendar v-model="date" inline showWeek class="w-full"/>
</template>

<script lang="ts">
import Calendar from "primevue/calendar";

export default {
  components: {
    Calendar,
  },
  data() {
    return {
      date: null,
    };
  },
  methods: {},
};
</script>
