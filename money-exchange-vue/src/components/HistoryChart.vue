<template>
  <div class="grow-7 border-2 border-gray-300 rounded-lg p-4 w-md lg:width-full flex flex-col">
    <div class="font-bold">{{ baseCurrency }} to {{ targetCurrency }}</div>
    <AreaChart 
      :data="data" 
      :x-attr="xAttr" 
      :y-attr="yAttr" 
      :data-domain="dataDomain" 
      :area-color="areaColor" 
      :stroke-color="strokeColor"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import AreaChart from '@/components/AreaChart.vue';
import currencyService from '@/services/currencyService';

interface Props {
  baseCurrency: string;
  targetCurrency: string;
  timePeriod: number;
  timeInterval: number;
}

const props = defineProps<Props>();

const getDates = (timePeriod: number, timeInterval: number): string[] => {
  const today = new Date();
  const dates: string[] = [];
  for (let i = 0; i < timePeriod; i = i + timeInterval) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
};

const areaColor = "#98d3ce";
const strokeColor = "#009689";

const dates = computed(() => {
  return getDates(props.timePeriod, props.timeInterval);
});

const xAttr = "date";
const yAttr = "rate";

const getRateDomain = (data: any[]): [number, number] => {
  const threshold = 0.25;
  let min = Math.min(...data.map((d) => d[yAttr]));
  let max = Math.max(...data.map((d) => d[yAttr]));
  const diff = max - min;
  min = min - diff * threshold;
  max = max + diff * threshold;
  return [min, max];
};

const data = ref<any[]>([]);

const dataDomain = computed(() => {
  return getRateDomain(data.value);
});

watchEffect(async () => {
  try {
    const response = await currencyService.getHistoricalRates(
      props.baseCurrency, 
      props.targetCurrency, 
      dates.value
    );
    data.value = response;
  } catch (error) {
    console.error('Error fetching historical rates:', error);
    data.value = [];
  }
});
</script>