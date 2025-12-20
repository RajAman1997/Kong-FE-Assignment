import { defineStore } from 'pinia'
import { apiClient } from '@/services/apiClient'
import { endpoints } from '@/constants/api-url'
import type { Service } from '@/types/service.interface'

export const useServiceStore = defineStore({
  id: 'service',
  state: () => ({
    service: [] as Service[],
    loading: false,
    error: '',
  }),
  getters: {
    getService: (state) => state.service,
    getLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
  actions: {
    async fetchService() {
      try {
        this.loading = true
        const res = await apiClient<Service[]>(endpoints.serviceCatalogUrl)
        this.service = res
      } catch (err) {
        console.error('Failed to load service catalog:', err)
        this.error = (err as Error).message
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
