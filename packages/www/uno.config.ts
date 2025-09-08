import { defineConfig, presetWind3 } from 'unocss';
import presetStackpress from 'stackpress/unocss';

export default defineConfig({
  content: {
    pipeline: {
      include: [
        // include js/ts files
        'plugins/**/*.{js,ts,tsx}'
      ],
      // exclude files
      // exclude: []
    },
  },
  presets: [
    presetWind3(),
    presetStackpress()
  ]
})