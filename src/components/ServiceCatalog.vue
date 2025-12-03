<template>
  <div class="service-catalog">
    <div v-if="!loading" class="flex flex-direction-column">
      <div class="flex justify-between align-center">
          <div class="text-primary flex title-section">
            <h1 class="title">Service Hub</h1>
            <div class="description">Organize services, manage and track versioning and API service documentation. <a href="#" class="no-underline">Learn more</a></div>
          </div>
          <div class="flex justify-between align-center actions">
            <Search :modelValue="searchQuery" @input="handleSearchInput" />
            <Button :label="btn.label" :imgSrc="btn.imgSrc" class="create-btn flex align-center bg-success text-white" @click="handleCreateService"></Button>
          </div>
      </div>
      <div class="service-catalog-list flex">
        <ServiceCatalogCard
          v-for="service in getServicesForCurrentPage"
          :key="service.id"
          :service="service"
          class="service-catalog-card"
          :class="{ 'cursor-pointer': service.versions.length }"
          @click="showDialog(service)"
        />
      </div>
      <div class="service-catalog-pagination">
        <div class="pagination flex justify-center align-center text-secondary">
          <Button label="&larr;" class="pagination-btn" @click="handlePrevPage" :disabled="disablePrev"></Button>
          <span class="current-page">
            {{ getStartIndex + 1 }} to {{ getEndIndex }} of {{ getTotalServices }} services
          </span>
          <Button label="&rarr;" class="pagination-btn" @click="handleNextPage" :disabled="disableNext"></Button>
        </div>
      </div>
    </div>

    <div v-else class="loading flex align-center justify-center full-width">
      <div class="spinner"></div>
    </div>
    <Teleport to="body">
      <VersionDetailsCard
        v-if="showVersionDetails && clickedService?.versions.length" 
        :modelValue="showVersionDetails" 
        :service="clickedService" 
        @update:modelValue="closeDialog"
        data-test="version-dialog" />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import Search from '@/components/Search/Search.vue'
import Button from '@/components/button/button.vue'
import ServiceCatalogCard from '@/components/serviceCatalogCard/ServiceCatalogCard.vue'
import VersionDetailsCard from '@/components/versionDetailsCard/versionDetailsCard.vue'
import type { Service } from '@/types/service.interface'
import { endpoints } from '@/constants/api-url'
import { fetchServiceCatalog } from '@/services/cardService.api'

const searchQuery = ref('')
const btn = reactive({
  label: 'Service Package',
  imgSrc: '/plus.svg'
})
const serviceList = ref<Service[]>([])
const error = ref<string | null>(null)
const loading = ref(false)
const showVersionDetails = ref(false);
const clickedService = ref<Service | null>(null);
const pagination = reactive({
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 9
})

const getFilteredServices = computed(() => {
  if(!searchQuery.value) {
    return serviceList.value;
  }
  return serviceList.value.filter((service) => {
    if(service.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || service.description.toLowerCase().includes(searchQuery.value.toLowerCase()) || service.type.toLowerCase().includes(searchQuery.value.toLowerCase())) {
      return true;
    }
  });
});
const getStartIndex = computed(() => (pagination.currentPage - 1) * pagination.itemsPerPage)
const getEndIndex = computed(() => Math.min(getStartIndex.value + pagination.itemsPerPage, getTotalServices.value))
const getTotalServices = computed(() => getFilteredServices.value.length)
const getServicesForCurrentPage = computed(() => {
  const startIndex = getStartIndex.value;
  const endIndex = startIndex + pagination.itemsPerPage;
  return getFilteredServices.value.slice(startIndex, endIndex);
})
const getTotalPages = computed(() => Math.ceil(getTotalServices.value / pagination.itemsPerPage))
const disablePrev = computed(() => pagination.currentPage === 1)
const disableNext = computed(() => pagination.currentPage === getTotalPages.value)

const fetchServices = async () => {
  loading.value = true
  try {
    serviceList.value = await fetchServiceCatalog()
    pagination.totalPages = Math.ceil(data.length / pagination.itemsPerPage)
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    loading.value = false
  }
}

const handleSearchInput = (value: string) => {
  pagination.currentPage = 1;
  searchQuery.value = value;
}

const handleNextPage = () => {
  if (pagination.currentPage < getTotalPages.value) {
    pagination.currentPage++;
  }
}

const handlePrevPage = () => {
  if (pagination.currentPage > 1) {
    pagination.currentPage--;
  }
}

const showDialog = (service: Service) => {
  showVersionDetails.value = true;
  clickedService.value = service;
}

const closeDialog = () => {
  showVersionDetails.value = false;
  clickedService.value = null;
}

const handleCreateService = () => {
  alert(`${btn.label} button clicked!`)
}

onMounted(() => {
  fetchServices()
})
</script>

<style lang="scss" scoped>
.service-catalog {
  margin: var(--header-height) auto;
  padding: 3.3125rem 2.5rem 2.5rem 2.5rem;
  gap: 1.5rem;

  & > div {
    gap: 1.5rem;
  }

  .title-section{
    gap: 1rem;
    flex-direction: column;

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
      padding: 0.75rem 1.5rem;
      border-radius: 16.25rem;
      font-size: 1rem;
      cursor: pointer;
      column-gap: 0.5rem;
    }
  }

  .service-catalog-list {
    gap: 2.5rem;
    flex-wrap: wrap;

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
        border-radius: 50%;
        width: 3.5rem;
        height: 3.5rem;
        cursor: pointer;
        color: #1456CB;
        border: 0.061225rem solid #A6C6FF;
        background-color: transparent;

        &:disabled {
          cursor: not-allowed;
          opacity: 0.5;
          border: 1px solid var(--color-border);
          color: initial;
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

  .loading {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    background: rgba(255,255,255,0.8);

    .spinner {
      width: 50px;
      height: 50px;
      border: 6px solid #ddd;
      border-top-color: #2196f3;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
}
</style>
