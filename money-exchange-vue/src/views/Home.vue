<template>
  <div class="p-4 flex flex-col lg:flex-row gap-4 justify-center">
    <CurrencyConverter 
      v-model:base-currency="baseCurrency"
      v-model:target-currency="targetCurrency"
    />
    <HistoryChart
      :base-currency="baseCurrency.value"
      :target-currency="targetCurrency.value"
      :time-period="timePeriod"
      :time-interval="timeInterval"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import CurrencyConverter from '@/components/CurrencyConverter.vue';
import HistoryChart from '@/components/HistoryChart.vue';

interface Currency {
  value: string;
  label: string;
}

const timePeriod = 15;
const timeInterval = 1;

const baseCurrency = reactive<Currency>({ value: 'USD', label: 'USD - United States Dollar' });
const targetCurrency = reactive<Currency>({ value: 'CLP', label: 'CLP - Chilean Peso' });
</script>