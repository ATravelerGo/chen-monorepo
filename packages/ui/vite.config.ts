import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue()],
	// resolve: {  //是为了开发和调试的时候避免多副本vue导致的runtime问题
	// 	dedupe: ['vue']
	// },
	build: {
		lib: {
			entry: ['./src/main.ts'],
			name: 'FunToyUI',
			formats: ['cjs', 'es'],
			fileName: (format) => `funToy-ui.${format}.js`
		},
		rollupOptions: {
			external: ['vue'] //因为加了这个 构建时也不会去解析 vue 的内容，只是保留 import { ref } from 'vue' 这行在最终产物里。
		}
	}
});
