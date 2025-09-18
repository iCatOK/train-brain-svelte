<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import OnboardingContainer from './OnboardingContainer.svelte';
  
  const dispatch = createEventDispatcher<{
    close: void;
  }>();
  
  let modalContainer: HTMLElement;
  
  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      dispatch('close');
    }
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      dispatch('close');
    }
  }
  
  // Prevent body scroll when modal is open and manage focus
  function preventScroll(node: HTMLElement) {
    const previousOverflow = document.body.style.overflow;
    const previousActiveElement = document.activeElement as HTMLElement;
    
    document.body.style.overflow = 'hidden';
    
    // Focus the modal container for screen readers
    setTimeout(() => {
      if (modalContainer) {
        modalContainer.focus();
      }
    }, 100);
    
    return {
      destroy() {
        document.body.style.overflow = previousOverflow;
        // Restore focus to the previously active element
        if (previousActiveElement && previousActiveElement.focus) {
          previousActiveElement.focus();
        }
      }
    };
  }
  
  // Focus trap management
  function handleFocusTrap(event: KeyboardEvent) {
    if (event.key !== 'Tab') return;
    
    const focusableElements = modalContainer.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }
</script>

<div
  class="modal-backdrop"
  on:click={handleBackdropClick}
  on:keydown={handleKeydown}
  use:preventScroll
  role="dialog"
  aria-modal="true"
  aria-labelledby="onboarding-title"
  aria-describedby="onboarding-description"
>
  <div
    class="modal-container"
    bind:this={modalContainer}
    on:keydown={handleFocusTrap}
    tabindex="-1"
    role="document"
    aria-label="Brain Training Onboarding Process"
  >
    <div id="onboarding-description" class="sr-only">
      Interactive onboarding tour to introduce you to the brain training application features and tests.
    </div>
    <OnboardingContainer on:complete={() => dispatch('close')} />
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .modal-container {
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow:
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(0, 0, 0, 0.05);
    width: 90vw;
    height: 85vh;
    max-width: 800px;
    max-height: 600px;
    min-height: 500px;
    position: relative;
    overflow: hidden;
    animation: slideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    border: 1px solid rgba(14, 165, 233, 0.1);
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      backdrop-filter: blur(0px);
      -webkit-backdrop-filter: blur(0px);
    }
    to {
      opacity: 1;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }
  }
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-32px) scale(0.92);
      filter: blur(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0px);
    }
  }
  
  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .modal-backdrop {
      padding: 0;
      background-color: rgba(0, 0, 0, 0.75);
    }
    
    .modal-container {
      width: 100vw;
      height: 100vh;
      max-width: 100vw;
      max-height: 100vh;
      border-radius: 0;
      animation: slideInMobile 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      box-shadow: none;
    }
    
    @keyframes slideInMobile {
      from {
        opacity: 0;
        transform: translateY(100vh);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }
  
  @media (max-width: 480px) {
    .modal-backdrop {
      padding: 0;
    }
  }
  
  /* Focus trap and accessibility styles */
  .modal-container:focus {
    outline: 2px solid #0ea5e9;
    outline-offset: -2px;
  }
  
  .modal-container:focus:not(:focus-visible) {
    outline: none;
  }
  
  .modal-container:focus-visible {
    outline: 2px solid #0ea5e9;
    outline-offset: -2px;
  }
  
  /* Screen reader only content */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .modal-backdrop {
      animation: fadeInReduced 0.2s ease-out;
    }
    
    .modal-container {
      animation: slideInReduced 0.2s ease-out;
    }
    
    @keyframes fadeInReduced {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideInReduced {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @media (max-width: 768px) {
      .modal-container {
        animation: slideInMobileReduced 0.2s ease-out;
      }
      
      @keyframes slideInMobileReduced {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    }
  }
</style>