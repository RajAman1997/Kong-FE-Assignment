<template>
  <div
    v-if="modelValue"
    class="backdrop flex align-center justify-center"
    @click="close"
  >
    <div
      class="dialog bg-white flex flex-direction-column"
      @click.stop
    >
      <div class="title font-bold">
        Versions ({{ getVersionCount }})
      </div>
      <div class="content">
        <div
          v-for="(version, index) in service.versions"
          :key="index"
          class="version-details flex align-center"
        >
          <div class="version font-bold">
            v{{ version.name }}
          </div>
          <div class="description">
            {{ version.description }}
          </div>
          <div class="flex full-width justify-between align-center">
            <div class="metadata">
              <span class="protocol">HTTP</span>
              <span class="service-type">{{ service.type }}</span>
            </div>
            <div
              v-if="version?.developer"
              class="publisher flex align-center"
            >
              <img
                v-if="version.developer.avatar"
                alt="Publisher Logo"
                :src="version.developer.avatar"
              >
              <div>
                <div
                  v-if="version.developer.name"
                  class="publisher-name text-primary"
                >
                  {{ getName(version.developer.name) }}
                </div>
                <div class="publisher-date">
                  {{ timeAgo(version.updated_at) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Service } from '@/types/service.interface'
import { useTimeAgo } from '@/utils/date'

defineOptions({
  name: 'VersionDetailsCard',
})

const { timeAgo } = useTimeAgo()

const props = defineProps<{
  modelValue: boolean
  service: Service
}>()

const emit = defineEmits(['update:modelValue'])

const getVersionCount = computed(() => props.service.versions.length)

const close = () => emit('update:modelValue')

const getName = (name: string) => {
  return name.split(' ')[0] + ' ' + name.split(' ')[1].charAt(0) + '.'
}
</script>

<style lang="scss" scoped>
.backdrop {
  background: rgba(0, 0, 0, 0.5);
  inset: 0;
  position: fixed;
  z-index: 100;

  .dialog {
    border-radius: 0.25rem;
    box-shadow: rgba(0, 0, 0, 0.2);
    gap: 2rem;
    max-height: 75vh;
    overflow-y: auto;
    padding: 2rem;
    width: 58vw;

    .title {
      font-size: 1rem;
    }

    .content {
      :last-child {
        border-bottom: none;
      }
    }

    .version-details {
      border-bottom: 0.0625rem solid #F1F1F5;
      gap: 1.5rem;
      padding: 0.5rem 0;

      .version {
        color: #262626;
        font-size: 0.8125rem;
        margin: auto 0;
        min-width: 4.0625rem;
        width: 10vw;
      }

      .description {
        color: #8A8A8A;
        font-size: 0.75rem;
        width: 60vw;
      }

      .metadata {
        color: #1155CB;
        font-size: 0.625rem;

        .protocol {
          background-color: var(--color-bg-primary);
          border-radius: 0.25rem;
          padding: 0.15625rem 0.375rem;
        }

        .service-type {
          background-color: #BDD3F9;
          border-radius: 0.25rem;
          padding: 0.15625rem 0.375rem;
        }
      }

      .publisher {
        gap: 0.5rem;
        min-width: 8vw;
        text-align: left;

        img {
          border-radius: 1.875rem;
          height: 1.25rem;
          width: 1.25rem;
        }

        .publisher-name {
          font-size: 0.8125rem;
        }

        .publisher-date {
          color:#8A8A8A;
          font-size: 0.8125rem;
        }
      }
    }
  }
}
</style>
