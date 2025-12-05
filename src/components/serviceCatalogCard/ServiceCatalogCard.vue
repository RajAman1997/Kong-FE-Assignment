<template>
  <div class="service-catalog-card bg-white">
    <div class="top flex justify-between align-center">
      <div class="status text-primary flex align-center">
        <img
          alt="status-icon"
          :src="statusIcon"
        >
        {{ getStatus }}
      </div>
      <div
        v-if="versionCount"
        class="versions bg-chip-primary text-chip-text-primary"
      >
        {{ versionCount }} Versions
      </div>
    </div>
    <div class="middle text-primary">
      <h3 class="font-bold">
        {{ service.name }}
      </h3>
      <div class="text-secondary">
        {{ service.description }}
      </div>
    </div>
    <div class="bottom font-bold flex justify-between">
      <div v-if="service.metrics">
        <div
          v-if="service.metrics.latency"
          class="stat-item flex align-center"
        >
          <img
            alt="ellipse"
            src="/ellipse.svg"
          >
          <div class="font-bold">
            {{ (service.metrics.latency).toFixed(2) }}ms <span class="text-secondary">latency</span>
          </div>
        </div>
        <div
          v-if="service.metrics.uptime"
          class="stat-item mt-5 flex align-center"
        >
          <img
            alt="ellipse"
            src="/ellipse.svg"
          >
          <div class="font-bold">
            {{ (service.metrics.uptime * 100).toFixed(2) }}% <span class="text-secondary">uptime</span>
          </div>
        </div>
        <div
          v-if="service.metrics.requests || service.metrics.errors"
          class="stat-item mt-5 flex align-center"
        >
          <img
            alt="ellipse"
            src="/ellipse.svg"
          >
          <div class="font-bold">
            {{ getRequestCount }} <span class="text-secondary">requests</span>
          </div>
          <span>&middot;</span>
          <div class="font-bold">
            {{ (service.metrics.errors * 100).toFixed(2) }}% <span class="text-secondary">errors</span>
          </div>
        </div>
      </div>
      <div
        v-else
        class="stat-item flex align-center"
      >
        <img
          alt="ellipse"
          src="/ellipse_disabled.svg"
        >
        Not configured with runtime yet
      </div>
      <div class="publisher-avatar flex align-center">
        <img
          v-for="(version, index) in getAvatars.slice(0, 2)"
          :key="index"
          alt="Publisher"
          :src="version?.developer?.avatar"
        >
        <div
          v-if="getAvatars.length > 2"
          class="bg-chip-primary text-chip-text-primary flex align-center justify-center"
        >
          +{{ getAvatars.length - 2 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue'
import type { Service, Version } from '@/types/service.interface'
import { Status } from '@/constants/status.enum'

const props = defineProps<{
  service: Service
}>()

const versionCount = computed(() => props.service.versions.length)
const getStatus = computed(() => {
  if (!props.service.configured) return Status.INPROGRESS
  if (props.service.published) return Status.PUBLISHED
  return Status.UNPUBLISHED
})
const statusIcon = computed(() => {
  switch (getStatus.value) {
    case Status.PUBLISHED:
      return '/right.svg'
    case Status.UNPUBLISHED:
      return '/cross.svg'
    default:
      return '/inprogress.svg'
  }
})
const getAvatars = computed(() => {
  const arr: Version[] = []
  props.service.versions.forEach(version => {
    if (version.developer?.avatar) {
      arr.push(version)
    }
  })
  return arr
})
const getRequestCount = computed(() => {
  if (!props.service.metrics?.requests) return '0'
  const requests = props.service.metrics.requests
  if (requests >= 1e9) return (requests / 1e9).toFixed(1).replace(/\.0$/, '') + 'B'
  if (requests >= 1e6) return (requests / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'
  if (requests >= 1000) return Math.floor(requests / 1000) + 'k'
  return requests.toString()
})
</script>

<style lang="scss" scoped>
.service-catalog-card {
    border-radius: .5rem;
    padding: 1.25rem;

    .status {
        font-size: 0.75rem;
        gap: 0.3125rem;
    }

    .versions {
        border-radius: 6.25rem;
        font-size: 0.8125rem;
        padding: 0.5rem 1rem;
    }
    .middle {
        margin-top: 0.625rem;

        h3 {
            margin: 0;
            min-height: 4.4925rem;
        }

        div {
            font-size: 0.8125rem;
            margin-top: 0.625rem;
            min-height: 2rem;
        }
    }

    .bottom {
        align-items: flex-end;
        font-size: 0.75rem;
        margin-top: 1.3125rem;
        min-height: 3.3125rem;

        .mt-5 {
            margin-top: 0.3125rem;
        }

        .stat-item {
            gap: 0.5rem;
        }

        .publisher-avatar {
            bottom: 1.25rem;
            flex-direction: row-reverse;
            position: relative;

            img, div {
                border-radius: 1.875rem;
                height: 2.25rem;
                object-fit: cover;
                position: absolute;
                width: 2.25rem;

                &:not(:first-child) {
                    right: 0;
                }

                &:nth-child(2) {
                    right: 1.25rem;
                    z-index: 1;
                }

                &:nth-child(3) {
                    right: 2.5rem;
                    z-index: 2;
                }
            }

            div {
                background-color: #F1F1F8;
                color: #777D8A;
                font-size: 0.75rem
            }
        }
    }
}
</style>