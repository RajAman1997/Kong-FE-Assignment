import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiClient } from '@/services/apiClient'

describe('apiClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns parsed JSON on successful fetch', async () => {
    const mockData = { foo: 'bar' }
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    } as any)

    const result = await apiClient('/test')
    expect(result).toEqual(mockData)
    expect(fetch).toHaveBeenCalledWith('/test', expect.any(Object))
  })

  it('handles non-ok response when response.text() fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: vi.fn().mockRejectedValue(new Error('Text failed')), // simulate text() failing
    } as any)

    await expect(apiClient('/fail-text')).rejects.toThrow(
      'API Error (500): Internal Server Error',
    )
  })

  it('throws error for non-ok response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      text: vi.fn().mockResolvedValue('Not Found'),
    } as any)

    await expect(apiClient('/fail')).rejects.toThrow('API Error (404): Not Found')
  })

  it('throws error for invalid JSON response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
    } as any)

    await expect(apiClient('/bad-json')).rejects.toThrow(
      'Failed to parse server response as JSON.',
    )
  })

  it('throws network error when fetch rejects', async () => {
    const networkError = new Error('Network failure')
    global.fetch = vi.fn().mockRejectedValue(networkError)

    await expect(apiClient('/network-error')).rejects.toThrow('Network failure')
  })
})
