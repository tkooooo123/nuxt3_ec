<script lang="ts" setup>
import adminAuth from '~/middleware/adminAuth';

definePageMeta({
  layout: 'admin',
  middleware: adminAuth
})
</script>
<template>
    <div class="p-6">Admin</div>
</template>