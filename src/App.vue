<script setup>
import { ref, computed } from 'vue'
import { marked } from 'marked'
import ThemeController from './components/ThemeController.vue'
import TableOfContents from './components/TableOfContents.vue'
import Sidebar from './components/Sidebar.vue'

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

const currentPath = ref('index')
const currentDoc = computed(() => docs.value.find(d => d.path === currentPath.value))
const currentContent = computed(() => currentDoc.value?.rawContent || '')

// Render markdown to HTML
const renderedHtml = computed(() => {
  if (!currentDoc.value) return ''
  return marked(currentDoc.value.content)
})

function navigate(path) {
  currentPath.value = path
}

// Mobile sidebar toggle
const sidebarOpen = ref(false)
</script>

<template>
  <div class="flex bg-base-100 min-h-screen">
    <!-- Mobile sidebar toggle -->
    <button
      @click="sidebarOpen = !sidebarOpen"
      class="lg:hidden top-4 left-4 z-50 fixed btn btn-ghost btn-sm"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-base-200 border-r border-base-300 transition-transform lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="flex justify-between items-center p-4 border-base-300 border-b">
        <span class="font-bold text-lg">Docs</span>
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

    <!-- Main content -->
    <main class="flex-1 min-w-0">
      <div class="mx-auto px-4 lg:px-8 py-8 max-w-6xl">
        <div class="lg:gap-8 lg:grid lg:grid-cols-[1fr_200px]">
          <!-- Article content -->
          <article class="max-w-none prose prose-base" v-html="renderedHtml"></article>

          <!-- Table of Contents -->
          <aside class="hidden lg:block">
            <TableOfContents :content="currentContent" />
          </aside>
        </div>
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
</style>
