<script>
  import { createEventDispatcher } from "svelte";
  import * as Select from "$lib/components/ui/select";

  export let currencies = [];
  export let selected = null;
  export let placeholder = "Selecciona moneda";
  export let id = "";
  export let isLoading = false;

  const dispatch = createEventDispatcher();

  function handleSelect(value) {
    selected = value;
    dispatch("select", value);
  }
</script>

<div class="flex flex-col space-y-2">
  <Select.Root bind:selected on:select={(e) => handleSelect(e.detail)}>
    <Select.Trigger {id} class="w-40 h-10">
      <Select.Value {placeholder} />
    </Select.Trigger>
    <Select.Content class="max-h-[200px] overflow-y-auto">
      {#if isLoading}
        <div class="p-2 text-center text-gray-500">Cargando monedas...</div>
      {:else}
        {#each currencies as currency}
          <Select.Item value={currency}>
            {currency.label}
          </Select.Item>
        {/each}
      {/if}
    </Select.Content>
  </Select.Root>
</div>
