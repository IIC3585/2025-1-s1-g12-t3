<template>
  <div ref="containerRef" role="img" class="width-full"></div>
</template>

<script setup lang="ts">
import * as Plot from '@observablehq/plot';
import * as htl from 'htl';
import { ref, watch, onMounted } from 'vue';

interface Props {
  data: any[];
  xAttr: string;
  yAttr: string;
  dataDomain: [number, number];
  areaColor: string;
  strokeColor: string;
}

const props = defineProps<Props>();
const containerRef = ref<HTMLElement>();

const renderPlot = () => {
  if (!containerRef.value) return;
  
  // Remove old chart, if any
  containerRef.value.firstChild?.remove();
  
  // Create new plot
  const plot = Plot.plot({
    y: { type: 'linear', domain: props.dataDomain, grid: true },
    marks: [
      () => htl.svg`<defs>
        <linearGradient id="gradient" gradientTransform="rotate(90)">
          <stop offset="70%" stop-color="${props.areaColor}" stop-opacity="0.9" />
          <stop offset="100%" stop-color="none" stop-opacity="0" />
        </linearGradient>
      </defs>`,
      Plot.ruleY([0]),
      Plot.lineY(props.data, {
        x: props.xAttr, 
        y: props.yAttr, 
        stroke: props.strokeColor,
        tip: { fontSize: 14 },
        strokeWidth: 2
      }),
      Plot.areaY(props.data, {
        x: props.xAttr, 
        y1: props.dataDomain[0], 
        y2: props.yAttr, 
        fill: "url(#gradient)", 
        fillOpacity: 0.2
      }),
    ],
  });
  
  // Set the class name for the plot
  plot.setAttribute('class', `${plot.classList} w-full h-full plot`);
  
  // Append the new chart to the div
  containerRef.value.append(plot);
};

// Watch for prop changes and re-render
watch(() => [props.data, props.xAttr, props.yAttr, props.dataDomain, props.areaColor, props.strokeColor], 
  () => {
    renderPlot();
  }, 
  { deep: true }
);

// Initial render on mount
onMounted(() => {
  renderPlot();
});
</script>

<style>
:deep(.plot) {
  font-family: Atkinson Hyperlegible, sans-serif;
}

.width-full {
  width: 100%;
}
</style>