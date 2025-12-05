<template>
  <header class="header flex justify-between align-center full-width text-white">
    <div class="left-header header-padding inherit-height flex justify-between align-center">
      <div class="logo flex align-center justify-center font-bold text-uppercase">
        <img
          :alt="`${brandTitle} logo`"
          :src="logoSrc"
        >
        {{ brandTitle }}
      </div>
      <nav class="flex align-center justify-center text-font">
        <div
          v-for="link in navLinks"
          :key="link.name"
          class="flex align-center"
        >
          <img
            :alt="`${link.name} logo`"
            :src="link.logo"
          >
          {{ link.name }}
        </div>
      </nav>
    </div>
    <div class="right-header inherit-height flex align-center justify-center text-font">
      <img
        :alt="`${user.name} logo`"
        :src="user.logo"
      >
      {{ user.name }}
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

defineOptions({
  name: 'ServiceHeader',
})

const brandTitle = ref('Konnect')
const logoSrc = ref('/logo.svg')
const navLinks = reactive([
  { name: 'Organization', href: '#', logo: '/user_group.svg' },
  { name: 'Settings', href: '#', logo: '/settings.svg' },
])
const user = reactive({
  name: 'Katherine Ellis',
  logo: '/user.svg',
})

</script>

<style scoped lang="scss">
.header {
    height: var(--header-height);
    left: 0;
    margin-bottom: var(--header-height);
    position: fixed;
    top: 0;
    z-index: 100;

    .left-header {
        background: linear-gradient(#09224F, #073382);
        padding: 1rem;
        width: calc(100% - 11.75rem);

        .logo {
            column-gap: 0.875rem;

            img {
                height: 1.5925rem;
                width: 1.8125rem;
            }
        }

        nav {
            column-gap: 2rem;

            div {
                column-gap: 1rem;

                img {
                    height: 1.25rem;
                    width: 1.25rem;
                }
            }
        }
    }

    .right-header {
        background: linear-gradient(#073382, #09224F);
        column-gap: 1rem;
        padding: 1rem 0;
        width: 11.75rem;

        .img {
            height: 1.875rem;
            width: 1.875rem;
        }
    }

    .nav_icon {
        height: 1.25rem;
        width: 1.25rem;
    }

    .inherit-height {
        height: inherit;
    }

    .text-font {
        font-size: 0.9375rem;
    }
}
</style>
