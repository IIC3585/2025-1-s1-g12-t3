<template>
  <div class="p-4 flex flex-col lg:flex-row gap-4 justify-center">
    <CurrencyConverter />
    <HistoryChart
      :base-currency="baseCurrency"
      :target-currency="targetCurrency"
      :time-period="timePeriod"
      :time-interval="timeInterval"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CurrencyConverter from '@/components/CurrencyConverter.vue';
import HistoryChart from '@/components/HistoryChart.vue';

const baseCurrency = ref<string>("USD");
const targetCurrency = ref<string>("CLP");
const timePeriod = ref<number>(15);
const timeInterval = ref<number>(1);
</script>