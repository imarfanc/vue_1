<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
});

const headings = ref([]);
const activeId = ref('');

function extractHeadings(content) {
  const regex = /^(#{2,3})\s+(.+)$/gm;
  const matches = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    matches.push({ id, text, level });
  }

  return matches;
}

function handleScroll() {
  const headingElements = headings.value
    .map((h) => document.getElementById(h.id))
    .filter(Boolean);

  if (headingElements.length === 0) return;

  for (let i = headingElements.length - 1; i >= 0; i--) {
    const el = headingElements[i];
    if (el.getBoundingClientRect().top <= 100) {
      activeId.value = headings.value[i].id;
      return;
    }
  }

  activeId.value = headings.value[0].id;
}

watch(
  () => props.content,
  (newContent) => {
    headings.value = extractHeadings(newContent);
    nextTick(() => {
      handleScroll();
    });
  },
  { immediate: true }
);

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

function scrollToHeading(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
</script>

<template>
  <div v-if="headings.length > 0" class="pt-2">
    <h4 class="mb-3 font-semibold text-sm text-base-content/70">
      On this page
    </h4>
    <nav>
      <ul class="space-y-1 text-sm">
        <li
          v-for="heading in headings"
          :key="heading.id"
          :class="{ 'ml-3': heading.level === 3 }"
        >
          <a
            @click.prevent="scrollToHeading(heading.id)"
            :href="`#${heading.id}`"
            :class="[
              'block py-1 border-l-2 pl-3 transition-colors cursor-pointer hover:text-primary',
              activeId === heading.id
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-base-content/60',
            ]"
          >
            {{ heading.text }}
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>
