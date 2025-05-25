<script lang="ts">
  export let title: string;
  export let subtitle: string;
</script>

<section class="hero-section">
  <h1>{title}</h1>
  <p>{subtitle}</p>
</section>

<style>
  .hero-section {
    text-align: center;
    margin-bottom: 16px;
  }

  .hero-section h1 {
    font-size: 2.5rem;
    color: #1e293b;
    margin-bottom: 8px;
  }

  .hero-section p {
    font-size: 1.125rem;
    color: #475569;
  }
</style>