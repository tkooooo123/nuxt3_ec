import js from '@eslint/js'
import typescript from '@typescript-eslint/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,ts,vue}'],
    ignores: [
      'node_modules/',
      '.nuxt/',
      '.nuxt/**/*',
      'dist/',
      '.output/',
      '*.log',
      '*.d.ts',
      'auto-imports.d.ts',
      'components.d.ts',
      'server/seed/'
    ],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        browser: true,
        node: true,
        process: true,
        console: true,
        defineNuxtConfig: 'readonly',
        defineNuxtPlugin: 'readonly',
        defineEventHandler: 'readonly',
        readBody: 'readonly',
        useRuntimeConfig: 'readonly',
        useAuth: 'readonly',
        navigateTo: 'readonly',
        useCookie: 'readonly',
        useFetch: 'readonly',
        defineNuxtRouteMiddleware: 'readonly',
        ref: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': typescript,
      vue: vue
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      //'vue/multi-word-component-names': 'off', //要求元件名稱必須多個單字
      'vue/no-v-html': 'warn',
      'vue/require-default-prop': 'off', //要求元件 prop 必須有預設值
      'vue/require-prop-types': 'off',  //要求元件 prop 必須定義型別
      'vue/no-unused-vars': 'warn', 
      'no-console': 'warn',
      //'no-debugger': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-undef': 'off'
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: typescriptParser,
        ecmaVersion: 2022,
        sourceType: 'module'
      }
    }
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module'
      }
    }
  },
  {
    files: ['server/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off'
    }
  },
  {
    files: ['.nuxt/**/*.ts'],
    rules: {
      'no-unused-vars': 'off'
    }
  },
  {
    files: ['.nuxt/**/*.mjs'],
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-useless-escape': 'off'
    }
  },
  {
    files: ['.nuxt/**/*.d.ts'],
    rules: {
      'no-redeclare': 'off',
      'no-undef': 'off',
    }
  }
]
