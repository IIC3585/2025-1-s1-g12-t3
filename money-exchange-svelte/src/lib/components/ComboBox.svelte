<script lang="ts">
 import { tick } from "svelte";
 import * as Command from "$lib/components/ui/command/index.js";
 import * as Popover from "$lib/components/ui/popover/index.js";
 import { Button } from "$lib/components/ui/button/index.js";
 import { cn } from "$lib/utils.js";
 
 const frameworks = [
  {
   value: "sveltekit",
   label: "SvelteKit"
  },
  {
   value: "next.js",
   label: "Next.js"
  },
  {
   value: "nuxt.js",
   label: "Nuxt.js"
  },
  {
   value: "remix",
   label: "Remix"
  },
  {
   value: "astro",
   label: "Astro"
  }
 ];
 
 let open = false;
 let value = "";
 
 
 $: selectedValue =
  frameworks.find((f) => f.value === value)?.label ?? "Select a framework...";
 
 // We want to refocus the trigger button when the user selects
 // an item from the list so users can continue navigating the
 // rest of the form with the keyboard.
 function closeAndFocusTrigger(triggerId: string) {
  open = false;
  tick().then(() => {
   document.getElementById(triggerId)?.focus();
  });
 }
 let search = '';
</script>
 
<Popover.Root bind:open let:ids>
 <Popover.Trigger asChild let:builder>
  <Button
   builders={[builder]}
   variant="outline"
   role="combobox"
   aria-expanded={open}
   class="w-[200px] justify-between"
  >
   {selectedValue}
  </Button>
 </Popover.Trigger>
 <Popover.Content class="w-[200px] p-0">
  <Command.Root>
   <Command.Input placeholder="Search framework..." bind:value={search}/>
   <Command.Empty>No framework found.</Command.Empty>
   {#key search}
    <Command.Group>
        {#each frameworks as framework}
        <Command.Item
        value={framework.value}
        onSelect={(currentValue) => {
        value = currentValue;
        closeAndFocusTrigger(ids.trigger);
        }}
        >
        {framework.label}
        </Command.Item>
        {/each}
    </Command.Group>
    {/key}
  </Command.Root>
 </Popover.Content>
</Popover.Root>