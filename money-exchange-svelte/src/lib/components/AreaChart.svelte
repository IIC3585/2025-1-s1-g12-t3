<script lang="ts">
  import * as Plot from '@observablehq/plot';

  let { data, xAttr, yAttr, areaColor, strokeColor } = $props();
  let div: HTMLElement | undefined = $state();

  $effect(() => {
    div?.firstChild?.remove(); // remove old chart, if any
    // add the new chart
    div?.append(
        Plot.plot({
          marks: [
            Plot.ruleY([0]),
            Plot.lineY(data, {x: xAttr, y: yAttr, stroke: strokeColor, tip: true, strokeWidth: 2}),
            Plot.areaY(data, {x: xAttr, y: yAttr, fill: areaColor, fillOpacity: 0.2}),
          ],
          grid: true
        })
    );
  });
</script>

<div bind:this={div} role="img"></div>