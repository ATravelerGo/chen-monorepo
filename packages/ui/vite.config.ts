import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig({
	plugins: [vue()],
	build: {
		lib: {
			entry: ['./src/main.ts'],
			name: 'FunToyUI',
			formats: ['cjs', 'es'],
			fileName: (format) => `funToy-ui.${format}.js`
		},
		rollupOptions: {
			external: ['vue']
		}
	}
});
