// eslint.config.mjs
import antfu from '@antfu/eslint-config'
import withNuxt from './apps/blog/.nuxt/eslint.config.mjs'
import pluginVue from 'eslint-plugin-vue'

export default antfu(
  {
    vue: true,
    typescript: true,
    stylistic: {
      indent: 2,
      quotes: 'single',
      semi: false
    },
    rules: {
      'antfu/no-top-level-await': 'off',
      'vue/require-default-prop': 'off'
    }
  },
  {
    plugins: {
      vue: pluginVue
    },
    rules: {
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style']
        }
      ],
      'perfectionist/sort-imports': [
        'error',
        {
          groups: [
            'type-import',
            ['builtin', 'builtin-type'],
            ['external', 'external-type'],
            ['internal', 'internal-type'],
            ['parent', 'parent-type'],
            ['sibling', 'sibling-type'],
            'index',
            'side-effect',
            'unknown'
          ],
          newlinesBetween: 'always',
          order: 'asc',
          type: 'alphabetical'
        }
      ]
    }
  },
  ...withNuxt
)
