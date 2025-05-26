<script lang="ts">
 import { tick } from "svelte";
 import * as Command from "$lib/components/ui/command/index.js";
 import * as Popover from "$lib/components/ui/popover/index.js";
 import { Button } from "$lib/components/ui/button/index.js";
 import { cn } from "$lib/utils.js";
 
 let { selected = $bindable(), options } = $props<{
  selected?: string;
  options: { label: string; value: string }[]; }>();

 let open = $state(false);
 
 let selectedValue = $derived(options.find((f) => f.value === selected.value)?.label ?? "Select a option...");
  
 
 // We want to refocus the trigger button when the user selects
 // an item from the list so users can continue navigating the
 // rest of the form with the keyboard.
 function closeAndFocusTrigger(triggerId: string) {
  open = false;
  tick().then(() => {
   document.getElementById(triggerId)?.focus();
  });
 }
 let search = $state("");
</script>
 
<Popover.Root bind:open let:ids>
 <Popover.Trigger asChild let:builder>
  <Button
   builders={[builder]}
   variant="outline"
   role="combobox"
   aria-expanded={open}
   class="w-[200px] justify-between overflow-hidden"
  >
   {selectedValue}
  </Button>
 </Popover.Trigger>
 <Popover.Content class="w-[200px] p-0">
  <Command.Root>
   <Command.Input placeholder="Search option..." bind:value={search}/>
   <Command.Empty>No option found.</Command.Empty>
   {#key search}
    <Command.Group>
        {#each options as option}
        <Command.Item
            value={option.value}
            onSelect={(currentValue) => {
            selected = option;
            closeAndFocusTrigger(ids.trigger);
            }}
        >
        {option.label}
        </Command.Item>
        {/each}
    </Command.Group>
    {/key}
  </Command.Root>
 </Popover.Content>
</Popover.Root>