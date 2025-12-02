<template>
  <div v-if="modelValue" class="backdrop flex align-center justify-center" @click="close">
    <div class="dialog bg-white flex flex-direction-column" @click.stop>
      <div class="title font-bold">Versions ({{ getVersionCount }})</div>
      <div class="content">
        <div class="version-details flex align-center" v-for="(version, index) in service.versions" :key="index">
          <div class="version font-bold">v{{ version.name }}</div>
          <div class="description">{{ version.description }}</div>
          <div class="flex full-width justify-between align-center">
            <div class="metadata">
                <span class="protocol">HTTP</span>
                <span class="service-type">{{ service.type }}</span>
            </div>
            <div class="publisher flex align-center" v-if="version?.developer">
                <img v-if="version.developer.avatar" :src="version.developer.avatar" alt="Publisher Logo" />
                <div>
                    <div v-if="version.developer.name" class="publisher-name text-primary">{{ getName(version.developer.name) }}</div>
                    <div class="publisher-date">{{ timeAgo(version.updated_at) }}</div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import type { Service } from '@/types/service.interface';
import { useTimeAgo } from "@/composables/date";

const { timeAgo } = useTimeAgo();

const props = defineProps<{
  modelValue: Boolean,
  service: Service
}>()

const emit = defineEmits(["update:modelValue"])

const getVersionCount = computed(() => props.service.versions.length)

const close = () => emit("update:modelValue")

const getName = (name: string) => {
  return name.split(' ')[0] + ' ' + name.split(' ')[1].charAt(0) + '.';
}
</script>

<style lang="scss" scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;

  .dialog {
    padding: 2rem;
    border-radius: 0.25rem;
    width: 58vw;
    max-height: 75vh;
    box-shadow: rgba(0, 0, 0, 0.2);  
    overflow-y: auto;
    gap: 2rem;

    .title {
      font-size: 1rem;
    }

    .content {
      :last-child {
        border-bottom: none;
      }
    }

    .version-details {
      gap: 1.5rem;
      padding: 0.5rem 0;
      border-bottom: 0.0625rem solid #F1F1F5;

      .version {
        font-size: 0.8125rem;
        color: #262626;
        min-width: 4.0625rem;
        margin: auto 0;
        width: 10vw;
      }

      .description {
        font-size: 0.75rem;
        color: #8A8A8A;
        width: 60vw;
      }

      .metadata {
        font-size: 0.625rem;
        color: #1155CB;

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
        text-align: left;
        min-width: 8vw;

        img {
          width: 1.25rem;
          height: 1.25rem;
          border-radius: 1.875rem;
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
