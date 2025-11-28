<script setup>
import { ref, onMounted } from 'vue'

const themeGroups = {
  light: [
    "light", "cupcake", "bumblebee", "emerald", "corporate", "retro", "nord",
    "cyberpunk", "valentine", "garden", "lofi", "pastel", "fantasy", "wireframe",
    "cmyk", "autumn", "acid", "lemonade", "winter", "caramellatte", "silk",
  ],
  dark: [
    "dark", "aqua", "business", "sunset", "synthwave", "halloween", "forest",
    "black", "luxury", "dracula", "night", "coffee", "dim", "abyss",
  ],
}

const currentTheme = ref('light')

onMounted(() => {
  const saved = localStorage.getItem('preferred-theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const initialTheme = saved || (prefersDark ? 'dark' : 'light')
  setTheme(initialTheme)
})

function setTheme(theme) {
  currentTheme.value = theme
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('preferred-theme', theme)
}
</script>

<template>
  <div title="Change Theme" class="block dropdown dropdown-end">
    <div tabindex="0" role="button" class="group gap-1.5 px-1.5 btn btn-sm btn-ghost" aria-label="Change Theme">
      <div class="gap-0.5 grid grid-cols-2 bg-base-100 p-1 border border-base-content/10 group-hover:border-base-content/20 rounded-md transition-colors shrink-0">
        <div class="bg-base-content rounded-full size-1"></div>
        <div class="bg-primary rounded-full size-1"></div>
        <div class="bg-secondary rounded-full size-1"></div>
        <div class="bg-accent rounded-full size-1"></div>
      </div>
      <svg width="12px" height="12px" class="hidden sm:inline-block opacity-60 fill-current mt-px size-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048">
        <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
      </svg>
    </div>
    <div tabindex="0" class="top-px z-50 bg-base-200 shadow-2xl mt-16 border border-white/5 rounded-box outline outline-1 outline-black/5 h-[30.5rem] max-h-[calc(100vh-8.6rem)] overflow-y-auto text-base-content dropdown-content">
      <ul class="w-56 menu">
        <template v-for="(themes, groupName) in themeGroups" :key="groupName">
          <li class="text-xs capitalize menu-title">{{ groupName }} themes</li>
          <li v-for="theme in themes" :key="theme">
            <button
              @click="setTheme(theme)"
              class="gap-3 px-2"
              :aria-pressed="currentTheme === theme"
            >
              <div :data-theme="theme" class="gap-0.5 grid grid-cols-2 bg-[oklch(var(--b1))] shadow-sm p-1 rounded-md shrink-0">
                <div class="bg-[oklch(var(--bc))] rounded-full size-1"></div>
                <div class="bg-[oklch(var(--p))] rounded-full size-1"></div>
                <div class="bg-[oklch(var(--s))] rounded-full size-1"></div>
                <div class="bg-[oklch(var(--a))] rounded-full size-1"></div>
              </div>
              <div class="w-32 truncate">{{ theme }}</div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                :class="['w-3 h-3 shrink-0', currentTheme === theme ? 'visible' : 'invisible']"
              >
                <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
              </svg>
            </button>
          </li>
        </template>
        <li></li>
      </ul>
    </div>
  </div>
</template>

