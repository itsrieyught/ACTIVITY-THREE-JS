import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        'activity-1-1-1-2': './Activity 1.1-1.2/index.html',
        'activity-1-3': './Activity 1.3/index.html',
        'activity-1-4': './Activity 1.4/index.html',
        'activity-1-5': './Activity 1.5/index.html',
        'activity-1-6': './Activity 1.6/index.html',
        'activity-1-7': './Activity 1.7/index.html',
        'activity-1-8': './Activity 1.8/index.html',
        'activity-1-9': './Activity 1.9/index.html',
        'activity-1-10': './Activity 1.10/index.html',
        'activity-1-11': './Activity 1.11/index.html',
        'activity-1-12': './Activity 1.12/index.html',
      }
    }
  }
})
