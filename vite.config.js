import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        'activity-1.1-1.2': resolve(__dirname, 'Activity 1.1-1.2/index.html'),
        'activity-1.3': resolve(__dirname, 'Activity 1.3/index.html'),
        'activity-1.4': resolve(__dirname, 'Activity 1.4/index.html'),
        'activity-1.5': resolve(__dirname, 'Activity 1.5/index.html'),
        'activity-1.6': resolve(__dirname, 'Activity 1.6/index.html'),
        'activity-1.7': resolve(__dirname, 'Activity 1.7/index.html'),
        'activity-1.8': resolve(__dirname, 'Activity 1.8/index.html'),
        'activity-1.9': resolve(__dirname, 'Activity 1.9/index.html'),
        'activity-1.10': resolve(__dirname, 'Activity 1.10/index.html'),
        'activity-1.11': resolve(__dirname, 'Activity 1.11/index.html'),
        'activity-1.12': resolve(__dirname, 'Activity 1.12/index.html'),
      }
    }
  }
})
