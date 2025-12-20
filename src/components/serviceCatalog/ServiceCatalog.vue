<template>
  <div class="service-catalog">
    <div
      v-if="!serviceStore.loading"
      class="flex flex-direction-column"
    >
      <div class="flex justify-between align-center">
        <div class="text-primary flex title-section">
          <h1 class="title">
            Service Hub
          </h1>
          <div class="description">
            Organize services, manage and track versioning and API service documentation. <a
              class="no-underline"
              href="#"
            >Learn more</a>
          </div>
        </div>
        <div class="flex justify-between align-center actions">
          <InputSearch
            v-model="searchQuery"
          />
          <BaseButton
            class="create-btn flex align-center bg-success text-white"
            :img-src="btn.imgSrc"
            :label="btn.label"
            @click="handleCreateService"
          />
        </div>
      </div>
      <div class="service-catalog-list flex">
        <ServiceCatalogCard
          v-for="service in currentData"
          :key="service.id"
          class="service-catalog-card"
          :class="{ 'cursor-pointer': service.versions.length }"
          :service="service"
          @click="showDialog(service)"
        />
      </div>
      <div class="service-catalog-pagination">
        <div class="pagination flex justify-center align-center text-secondary">
          <BaseButton
            class="pagination-btn"
            :disabled="disablePrev"
            label="&larr;"
            @click="handlePrevPage"
          />
          <span class="current-page">
            {{ pageStartCount }} to {{ endIndex }} of {{ getFilteredServices.length }} services
          </span>
          <BaseButton
            class="pagination-btn"
            :disabled="disableNext"
            label="&rarr;"
            @click="handleNextPage"
          />
        </div>
      </div>
    </div>

    <AppSpinner v-else />
    <Teleport to="body">
      <VersionDetailsCard
        v-if="showVersionDetails && clickedService?.versions.length"
        data-test="version-dialog"
        :model-value="showVersionDetails"
        :service="clickedService"
        @update:model-value="closeDialog"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import InputSearch from '@/components/search/Search.vue'
import BaseButton from '@/components/button/Button.vue'
import ServiceCatalogCard from '@/components/serviceCatalogCard/ServiceCatalogCard.vue'
import VersionDetailsCard from '@/components/versionDetailsCard/versionDetailsCard.vue'
import AppSpinner from '@/components/spinner/Spinner.vue'
import type { Service } from '@/types/service.interface'
import { useServiceStore } from '@/stores/service'
import { usePagination } from '@/composables/usePagination'

defineOptions({
  name: 'ServiceCatalog',
})

const serviceStore = useServiceStore()
const btn = ref({
  label: 'Service Package',
  imgSrc: '/plus.svg',
})
const pageSize = ref(9)
const searchQuery = ref('')
const showVersionDetails = ref(false)
const clickedService = ref<Service | null>(null)

const getFilteredServices = computed(() => {
  if (!searchQuery.value) {
    return serviceStore.service
  }
  const searchTerm = searchQuery.value.toLowerCase()
  return serviceStore.service.filter((service) => {
    return service.name.toLowerCase().includes(searchTerm) || service.description?.toLowerCase().includes(searchTerm) || service.type.toLowerCase().includes(searchTerm)
  })
})

const { startIndex, endIndex, currentData, disablePrev, disableNext, handleNextPage, handlePrevPage } = usePagination(getFilteredServices, pageSize)

const pageStartCount = computed(() => startIndex.value + 1)

const showDialog = (service: Service) => {
  showVersionDetails.value = true
  clickedService.value = service
}

const closeDialog = () => {
  showVersionDetails.value = false
  clickedService.value = null
}

const handleCreateService = () => {
  alert(`${btn.value.label} button clicked!`)
}

onMounted(() => {
  serviceStore.fetchService()
})
</script>

<style lang="scss" scoped>
.service-catalog {
  gap: 1.5rem;
  margin-top: var(--header-height);
  padding: 3.3125rem 2.5rem 2.5rem 2.5rem;

  & > div {
    gap: 1.5rem;
  }

  .title-section{
    flex-direction: column;
    gap: 1rem;

    .title {
      margin: 0;
    }

    .description {
      font-size: 1rem;
      line-height: 1.5rem;
    }
  }

  .actions {
    gap: 1.5rem;

    .create-btn {
      border: none;
      border-radius: 16.25rem;
      column-gap: 0.5rem;
      cursor: pointer;
      font-size: 1rem;
      padding: 0.75rem 1.5rem;
    }
  }

  .service-catalog-list {
    flex-wrap: wrap;
    gap: 2.5rem;

    .service-catalog-card {
      width: calc(31.372%);

      &.cursor-pointer {
        cursor: pointer;
      }
    }
  }

  .service-catalog-pagination {
    text-align: center;

    .pagination {
      gap: 1.5rem;

      .pagination-btn {
        background-color: transparent;
        border: 0.061225rem solid #A6C6FF;
        border-radius: 50%;
        color: #1456CB;
        cursor: pointer;
        height: 3.5rem;
        width: 3.5rem;

        &:disabled {
          border: 1px solid var(--color-border);
          color: initial;
          cursor: not-allowed;
          opacity: 0.5;
        }
      }

      .current-page {
        font-size: 0.8125rem;
      }
    }
  }

  .no-underline {
    text-decoration: none;
  }
}
</style>
