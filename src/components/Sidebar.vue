<script setup>
import { computed } from 'vue';

const props = defineProps({
  docs: {
    type: Array,
    default: () => [],
  },
  currentPath: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['navigate']);

// Group docs by folder
const groupedDocs = computed(() => {
  const groups = {};

  props.docs.forEach((doc) => {
    const parts = doc.path.split('/');
    if (parts.length > 1) {
      const folder = parts[0];
      if (!groups[folder]) {
        groups[folder] = [];
      }
      groups[folder].push(doc);
    } else {
      if (!groups['_root']) {
        groups['_root'] = [];
      }
      groups['_root'].push(doc);
    }
  });

  // Sort each group by order
  Object.keys(groups).forEach((key) => {
    groups[key].sort((a, b) => (a.order || 999) - (b.order || 999));
  });

  return groups;
});

function formatFolderName(name) {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function navigate(event, path) {
  event.preventDefault();
  emit('navigate', path);
}

function getHref(path) {
  return path === 'index' ? '#' : `#${path}`;
}
</script>

<template>
  <nav class="p-4">
    <!-- Root level docs -->
    <ul v-if="groupedDocs._root" class="menu menu-sm">
      <li v-for="doc in groupedDocs._root" :key="doc.path">
        <a
          :href="getHref(doc.path)"
          @click="navigate($event, doc.path)"
          :class="{ active: currentPath === doc.path }"
        >
          {{ doc.title }}
        </a>
      </li>
    </ul>

    <!-- Grouped docs -->
    <template v-for="(docs, folder) in groupedDocs" :key="folder">
      <div v-if="folder !== '_root'" class="mt-4">
        <h3 class="mb-2 px-2 font-semibold text-sm text-base-content/70">
          {{ formatFolderName(folder) }}
        </h3>
        <ul class="menu menu-sm">
          <li v-for="doc in docs" :key="doc.path">
            <a
              :href="getHref(doc.path)"
              @click="navigate($event, doc.path)"
              :class="{ active: currentPath === doc.path }"
            >
              {{ doc.title }}
            </a>
          </li>
        </ul>
      </div>
    </template>
  </nav>
</template>
