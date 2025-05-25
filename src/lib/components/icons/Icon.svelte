<script lang="ts">
  // This is a placeholder for a more robust icon system.
  // You might use a library, dynamic SVG imports, or a sprite sheet.
  // Define allowed icon names as a union type
  type IconName = 'alert' | 'refresh' | 'math' | 'chart' | 'settings' | 'profile';
  export let name: string; // e.g., "alert", "refresh", "math"
  export let classes: string = ''; // Additional CSS classes

  // In a real system, you'd map 'name' to an SVG or icon font class
  const iconMap: Record<IconName, string> = {
    alert: '⚠️',
    refresh: '🔄',
    math: '➕',
    chart: '📊',
    settings: '⚙️',
    profile: '👤',
  };

  $: currentIcon = (iconMap as Record<string, string>)[name] || '';
</script>

<span class="icon {classes}">{currentIcon}</span>

<style>
  .icon {
    display: inline-block;
    /* Add common icon styling here, like size, fill, etc. if not handled by utility classes */
  }
  /* You could add more specific styles based on props or classes */
</style>