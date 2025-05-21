<script lang="ts">
  import * as Plot from '@observablehq/plot';
  import * as htl from 'htl';
  let { data, xAttr, yAttr, dataDomain, areaColor, strokeColor } = $props();
  let div: HTMLElement | undefined = $state();

  $effect(() => {
    div?.firstChild?.remove(); // remove old chart, if any
    // add the new chart
    let plot = Plot.plot({
          y: {type: 'linear', domain: dataDomain, grid: true},
          marks: [
            () => htl.svg`<defs>
              <linearGradient id="gradient" gradientTransform="rotate(90)">
                <stop offset="70%" stop-color="${areaColor}" stop-opacity="0.9" />
                <stop offset="100%" stop-color="none" stop-opacity="0" />
              </linearGradient>
            </defs>`,
            Plot.ruleY([0]),
            Plot.lineY(data, {
              x: xAttr, y: yAttr, stroke: strokeColor, 
              tip: { fontSize: 14}, 
              strokeWidth: 2}),
            Plot.areaY(data, {x: xAttr, y1: dataDomain[0], y2: yAttr, fill: "url(#gradient)", fillOpacity: 0.2}),
          ],
          // grid: true
        });
    div?.append(plot); // append the new chart to the div
  });
</script>

<div bind:this={div} role="img"></div>

<style>
  :global(svg g[aria-label="tip"]) {
    font-family: Atkinson Hyperlegible, sans-serif;
  }
</style>