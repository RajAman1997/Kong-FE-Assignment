<template>
    <div class="service-catalog-card bg-white">
        <div class="top flex justify-between align-center">
            <div class="status text-primary flex align-center">
                <img :src="statusIcon" alt="status-icon" />
                {{ getStatus }}
            </div>
            <div class="versions bg-chip-primary text-chip-text-primary" v-if="versionCount">{{ versionCount }} Versions</div>
        </div>
        <div class="middle text-primary">
            <h3 class="font-bold">{{ service.name }}</h3>
            <div class="text-secondary">{{ service.description }}</div>
        </div>
        <div class="bottom font-bold flex justify-between">
            <div v-if="service.metrics">
                <div class="stat-item flex align-center" v-if="service.metrics.latency">
                    <img src="/ellipse.svg" alt="ellipse" />
                    <div class="font-bold">{{ (service.metrics.latency).toFixed(2) }}ms <span class="text-secondary">latency</span></div>
                </div>
                <div class="stat-item mt-5 flex align-center" v-if="service.metrics.uptime">
                    <img src="/ellipse.svg" alt="ellipse" />
                    <div class="font-bold">{{ (service.metrics.uptime * 100).toFixed(2) }}% <span class="text-secondary">uptime</span></div>
                </div>
                <div class="stat-item mt-5 flex align-center" v-if="service.metrics.requests || service.metrics.errors">
                    <img src="/ellipse.svg" alt="ellipse" />
                    <div class="font-bold">{{ getRequestCount }} <span class="text-secondary">requests</span></div>
                    <span>&middot;</span>
                    <div class="font-bold">{{ (service.metrics.errors * 100).toFixed(2) }}% <span class="text-secondary">errors</span></div>
                </div>
            </div>
            <div v-else class="stat-item flex align-center">
                <img src="/ellipse_disabled.svg" alt="ellipse" />
                Not configured with runtime yet
            </div>
            <div class="publisher-avatar flex align-center">
                <img v-for="(version, index) in getAvatars.slice(0, 2)" :key="index" :src="version?.developer?.avatar" alt="Publisher" />
                <div v-if="getAvatars.length > 2" class="bg-chip-primary text-chip-text-primary flex align-center justify-center">
                    +{{ getAvatars.length - 2 }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, computed, ref } from 'vue';
import type { Service } from '@/types/service.interface';
import { Status } from '@/constants/status.enum';

const props = defineProps<{
    service: Service;
}>();

const versionCount = computed(() => props.service.versions.length);
const getStatus = computed(() => {
    if(!props.service.configured) return Status.INPROGRESS;
    if(props.service.published) return Status.PUBLISHED;
    return Status.UNPUBLISHED;
})
const statusIcon = computed(() => {
    switch(getStatus.value) {
        case Status.PUBLISHED:
            return '/right.svg';
        case Status.UNPUBLISHED:
            return '/cross.svg';
        default:
            return '/inprogress.svg';
    }
});
const getAvatars = computed(() => {
    const arr = [];
    props.service.versions.forEach(version => {
        if(version.developer?.avatar) {
            arr.push(version);
        }
    });
    return arr;
});
const getRequestCount = computed(() => {
    if(!props.service.metrics?.requests) return '0';
    const requests = props.service.metrics.requests;
    if(requests >= 1e9) return (requests / 1e9).toFixed(1).replace(/\.0$/,'') + 'B';
    if(requests >= 1e6) return (requests / 1e6).toFixed(1).replace(/\.0$/,'') + 'M';
    if(requests >= 1000) return Math.floor(requests / 1000) + 'k';
    return requests.toString();
});
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
        padding: 0.5rem 1rem;
        font-size: 0.8125rem;
    }
    .middle {
        margin-top: 0.625rem;
        
        h3 {
            margin: 0;
            min-height: 4.4925rem;
        }

        div {
            margin-top: 0.625rem;
            font-size: 0.8125rem;
            min-height: 2rem;
        }
    }

    .bottom {
        margin-top: 1.3125rem;
        font-size: 0.75rem;
        align-items: flex-end;
        min-height: 3.3125rem;

        .mt-5 {
            margin-top: 0.3125rem;
        }

        .stat-item {
            gap: 0.5rem;
        }

        .publisher-avatar {
            flex-direction: row-reverse;
            position: relative;
            bottom: 1.25rem;

            img, div {
                width: 2.25rem;
                height: 2.25rem;
                border-radius: 1.875rem;
                object-fit: cover;
                position: absolute;

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
                font-size: 0.75rem;
                color: #777D8A
            }
        }
    }
}
</style>