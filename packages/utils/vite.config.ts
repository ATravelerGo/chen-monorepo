import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: './src/main.ts',
			name: 'FunToyUtils',
			formats: ['cjs', 'es'],
			fileName: (format) => `funToy-utils.${format}.js`
		},
		rollupOptions: {}
	}
});
