import { NuxtSecurityConfig } from 'nuxt-security'

declare module 'nuxt/schema' {
  interface NuxtConfig {
    security?: NuxtSecurityConfig
  }
  interface NuxtOptions {
    security?: NuxtSecurityConfig
  }
}