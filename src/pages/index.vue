<route>{ meta: { title: "首页", layout: 'IM' } }</route>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    next('/channel')
  }
})
</script>
