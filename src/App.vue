<script setup>
import { ref, computed, onMounted, onUnmounted, onUpdated, nextTick } from 'vue'
import { marked } from 'marked'
import ThemeController from './components/ThemeController.vue'
import TableOfContents from './components/TableOfContents.vue'
import Sidebar from './components/Sidebar.vue'

// Configure marked to add IDs to headings and wrap code blocks
const renderer = new marked.Renderer()
renderer.heading = function({ text, depth }) {
  const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  return `<h${depth} id="${id}">${text}</h${depth}>`
}
renderer.code = function({ text, lang }) {
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return `<div class="group code-block-wrapper relative not-prose">
    <button class="top-2 right-2 absolute bg-base-300/80 hover:bg-base-300 opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-base-content/70 hover:text-base-content transition-opacity copy-btn" title="Copy code">
      <svg class="w-4 h-4 copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
      <svg class="hidden w-4 h-4 check-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    </button>
    <pre class="!mt-0"><code class="language-${lang || ''}">${escaped}</code></pre>
  </div>`
}
marked.use({ renderer })

// Dynamic import of MD/MDX files as raw text
const modules = import.meta.glob('./docs/**/*.{md,mdx}', { query: '?raw', import: 'default', eager: true })

// Parse frontmatter from markdown content
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) return { title: 'Untitled', order: 999, content }

  const frontmatter = {}
  match[1].split('\n').forEach(line => {
    const [key, ...values] = line.split(':')
    if (key && values.length) {
      frontmatter[key.trim()] = values.join(':').trim()
    }
  })

  // Remove frontmatter from content
  const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n*/, '')
  return { ...frontmatter, content: contentWithoutFrontmatter }
}

// Build docs list from modules
const docs = computed(() => {
  return Object.entries(modules).map(([path, rawContent]) => {
    const relativePath = path.replace('./docs/', '').replace(/\.(md|mdx)$/, '')
    const parsed = parseFrontmatter(rawContent)
    return {
      path: relativePath,
      title: parsed.title || relativePath,
      order: parseInt(parsed.order) || 999,
      rawContent,
      content: parsed.content
    }
  })
})

// Get initial path from URL
function getPathFromUrl() {
  const path = window.location.pathname.slice(1) // Remove leading slash
  return path || 'index'
}

const currentPath = ref(getPathFromUrl())
const currentDoc = computed(() => docs.value.find(d => d.path === currentPath.value))
const currentContent = computed(() => currentDoc.value?.content || '')

// Render markdown to HTML
const renderedHtml = computed(() => {
  if (!currentDoc.value) return ''
  return marked(currentDoc.value.content)
})

function navigate(path, pushState = true) {
  currentPath.value = path

  // Update URL without page reload
  const url = path === 'index' ? '/' : `/${path}`
  if (pushState) {
    window.history.pushState({ path }, '', url)
  }

  // Close mobile sidebar on navigation
  sidebarOpen.value = false
}

// Handle browser back/forward buttons
function handlePopState(event) {
  const path = event.state?.path || getPathFromUrl()
  navigate(path, false) // Don't push state when handling popstate
}

// Mobile sidebar toggle
const sidebarOpen = ref(false)

// Setup copy buttons for code blocks
function setupCopyButtons() {
  nextTick(() => {
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.onclick = async () => {
        const codeBlock = btn.parentElement?.querySelector('code')
        if (!codeBlock) return

        try {
          await navigator.clipboard.writeText(codeBlock.textContent || '')
          const copyIcon = btn.querySelector('.copy-icon')
          const checkIcon = btn.querySelector('.check-icon')
          if (copyIcon && checkIcon) {
            copyIcon.classList.add('hidden')
            checkIcon.classList.remove('hidden')
            btn.title = 'Copied!'
            setTimeout(() => {
              copyIcon.classList.remove('hidden')
              checkIcon.classList.add('hidden')
              btn.title = 'Copy code'
            }, 2000)
          }
        } catch (err) {
          console.error('Failed to copy:', err)
        }
      }
    })
  })
}

onMounted(() => {
  setupCopyButtons()

  // Set initial state for the current URL
  const initialPath = getPathFromUrl()
  window.history.replaceState({ path: initialPath }, '', window.location.pathname || '/')

  // Listen for browser back/forward
  window.addEventListener('popstate', handlePopState)
})

onUnmounted(() => {
  window.removeEventListener('popstate', handlePopState)
})

onUpdated(setupCopyButtons)
</script>

<template>
  <div class="bg-base-100 min-h-screen">
    <!-- Mobile sidebar toggle -->
    <button
      @click="sidebarOpen = !sidebarOpen"
      class="lg:hidden top-4 left-4 z-50 fixed btn btn-ghost btn-sm"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Sidebar (Fixed) -->
    <aside
      :class="[
        'fixed top-0 left-0 z-40 h-screen w-64 bg-base-200 border-r border-base-300 transition-transform lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex justify-between items-center p-4 border-base-300 border-b">
        <span class="font-bold text-primary text-lg">Docs</span>
        <ThemeController />
      </div>
      <div class="h-[calc(100vh-65px)] overflow-y-auto">
        <Sidebar :docs="docs" :current-path="currentPath" @navigate="navigate" />
      </div>
    </aside>

    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="lg:hidden z-30 fixed inset-0 bg-black/50"
    />

    <!-- Table of Contents (Fixed on right) -->
    <aside class="hidden lg:block top-0 right-0 fixed p-6 w-56 h-screen overflow-y-auto">
      <TableOfContents :content="currentContent" />
    </aside>

    <!-- Main content (Scrollable center) -->
    <main class="lg:mr-56 lg:ml-64 min-h-screen">
      <div class="mx-auto px-4 lg:px-8 py-8 max-w-4xl">
        <article class="max-w-none prose prose-base" v-html="renderedHtml"></article>
      </div>
    </main>
  </div>
</template>

<style>
/* Reset body styles for doc layout */
body {
  display: block;
  place-items: unset;
}

#app {
  max-width: unset;
  margin: 0;
  padding: 0;
  text-align: left;
}

/* Code block wrapper styling */
.code-block-wrapper {
  margin: 1rem 0;
}

.code-block-wrapper pre {
  margin: 0;
  border-radius: 0.5rem;
  background-color: oklch(var(--b2, var(--b1)));
  padding: 1rem;
  overflow-x: auto;
}

.code-block-wrapper code {
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>
