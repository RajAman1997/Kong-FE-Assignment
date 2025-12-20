import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useServiceStore } from '@/stores/service'
import { apiClient } from '@/services/apiClient'
import { endpoints } from '@/constants/api-url'
import type { Service } from '@/types/service.interface'

// Mock apiClient
vi.mock('@/services/apiClient', () => ({
  apiClient: vi.fn(),
}))

const mockServices: Service[] = [
  {
    id: '1',
    name: 'Service A',
    description: 'Service A desc',
    type: 'API',
    published: false,
    configured: true,
    metrics: {} as any,
    versions: [],
  },
]

describe('useServiceStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('initializes with correct default state', () => {
    const store = useServiceStore()

    expect(store.service).toEqual([])
    expect(store.loading).toBe(false)
    expect(store.error).toBe('')
  })

  it('fetchService sets loading true while fetching', async () => {
    const store = useServiceStore()

    let resolvePromise!: (value: Service[]) => void
    const promise = new Promise<Service[]>((resolve) => {
      resolvePromise = resolve
    })

    ;(apiClient as Mock).mockReturnValueOnce(promise)

    const fetchPromise = store.fetchService()

    expect(store.loading).toBe(true)

    resolvePromise(mockServices)
    await fetchPromise

    expect(store.loading).toBe(false)
  })

  it('fetchService stores services on success', async () => {
    const store = useServiceStore()

    ;(apiClient as Mock).mockResolvedValueOnce(mockServices)

    await store.fetchService()

    expect(apiClient).toHaveBeenCalledWith(endpoints.serviceCatalogUrl)
    expect(store.service).toEqual(mockServices)
    expect(store.loading).toBe(false)
    expect(store.error).toBe('')
  })

  it('fetchService sets error on failure and rethrows', async () => {
    const store = useServiceStore()
    const error = new Error('Network error')

    ;(apiClient as Mock).mockRejectedValueOnce(error)

    await expect(store.fetchService()).rejects.toThrow('Network error')

    expect(store.loading).toBe(false)
    expect(store.error).toBe('Network error')
    expect(store.service).toEqual([])
  })

  it('getters return correct values', async () => {
    const store = useServiceStore()

    store.service = mockServices
    store.loading = true
    store.error = 'Some error'

    expect(store.getService).toEqual(mockServices)
    expect(store.getLoading).toBe(true)
    expect(store.getError).toBe('Some error')
  })
})
