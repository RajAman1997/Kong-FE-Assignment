import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchServiceCatalog } from '@/services/cardService.api'
import { apiClient } from '@/services/apiClient'
import { endpoints } from '@/constants/api-url'
import type { Service } from '@/types/service.interface'

// Mock apiClient
vi.mock('@/services/apiClient', () => ({
  apiClient: vi.fn(),
}))

describe('fetchServiceCatalog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns service catalog data on success', async () => {
    const mockServices: Service[] = [
      {
        id: '1',
        name: 'Service A',
        description: 'Test service',
        type: 'API',
        published: false,
        configured: true,
        metrics: {} as any,
        versions: [],
      },
    ]

    vi.mocked(apiClient).mockResolvedValueOnce(mockServices)

    const result = await fetchServiceCatalog()

    expect(apiClient).toHaveBeenCalledWith(endpoints.serviceCatalogUrl)
    expect(result).toEqual(mockServices)
  })

  it('throws error when apiClient fails', async () => {
    const error = new Error('Network error')

    vi.mocked(apiClient).mockRejectedValueOnce(error)

    await expect(fetchServiceCatalog()).rejects.toThrow('Network error')

    expect(apiClient).toHaveBeenCalledWith(endpoints.serviceCatalogUrl)
  })
})
