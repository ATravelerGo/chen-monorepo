<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
	<button @click="count++" class="button">{{ count }}</button>
</template>

<style scoped lang="scss">
.button {
	width: 100px;
	height: 30px;
	border: 1px solid blue;
	border-radius: 20px;
}
</style>
