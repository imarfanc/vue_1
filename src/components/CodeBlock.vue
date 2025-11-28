<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const props = defineProps({
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: ''
  }
})

const copied = ref(false)

async function copyCode() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<template>
  <div class="relative group">
    <button
      @click="copyCode"
      class="absolute top-2 right-2 p-1.5 rounded-md bg-base-300/80 hover:bg-base-300 text-base-content/70 hover:text-base-content opacity-0 group-hover:opacity-100 transition-opacity"
      :title="copied ? 'Copied!' : 'Copy code'"
    >
      <Icon 
        :icon="copied ? 'lucide:check' : 'lucide:copy'" 
        class="w-4 h-4"
      />
    </button>
    <pre class="!mt-0"><code :class="language ? `language-${language}` : ''">{{ code }}</code></pre>
  </div>
</template>

