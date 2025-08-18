<script lang="ts" setup>
// SEO: Home page meta
const siteName = 'Bakery'
const pageTitle = '精選烘焙，手工美味｜Bakery'
const pageDescription =
  '嚴選原料、手工製作的烘焙點心與麵包。每日新鮮出爐，帶給您最純粹的美味體驗。'

const requestUrl = useRequestURL()
const origin = requestUrl.origin
const canonicalUrl = origin + '/'
const ogImage = origin + '/images/home_banner.jpg'

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogImage,
  ogType: 'website',
  ogUrl: canonicalUrl,
})


const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: canonicalUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${origin}/products?keyword={search_term_string}`,
    'query-input': 'required name=search_term_string'
  }
}

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  meta: [{ name: 'robots', content: 'index, follow' }],
  script: [
    { type: 'application/ld+json', innerHTML: JSON.stringify(websiteJsonLd) }
  ]
})
</script>

<template>
  <div>
    <CustomLoading />
    <ScrollToTop/>
    <FrontHeader />
    <div class="min-h-[calc(100vh-269px)] bg-#fafafa">
      <NuxtPage />
    </div>

    <FrontFooter />
  </div>
</template>
