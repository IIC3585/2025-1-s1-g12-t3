<script>
  export let text = "";
</script>

<div
  class="
      w-10 h-10
      rounded-full
      bg-gradient-to-br from-yellow-300 to-yellow-400
      border-4 border-yellow-300/20
      shadow-inner
      font-bold tracking-wide
      flex items-center justify-center
      ring-1 ring-yellow-500/20
      transition-all duration-300
    "
  style="
    font-size: .65rem;"
  title={text}
>
  {text}
</div>
