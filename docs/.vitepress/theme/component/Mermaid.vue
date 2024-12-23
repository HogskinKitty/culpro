<template>
  <div v-html="svgRef"></div>
</template>
<script setup ts>
import { onMounted, ref } from 'vue'
import { render } from '../plugin/mermaid'

const props = defineProps({
  id: String,
  code: String,
})

onMounted(async () => {
  svgRef.value = await render(props.id, decodeURIComponent(props.code))
})

const svgRef = ref('')
</script>
<style scoped></style>