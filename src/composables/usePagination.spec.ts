import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick, ref, type Ref } from 'vue'
import { usePagination } from '@/composables/usePagination'

describe('usePagination', () => {
  let data: ReturnType<typeof ref<number[]>>
  let pageSize: ReturnType<typeof ref<number>>

  beforeEach(() => {
    data = ref([1, 2, 3, 4, 5])
    pageSize = ref(2)
  })

  it('initializes with correct default values', () => {
    const pagination = usePagination(data as Ref<number[]>, pageSize as Ref<number>)

    expect(pagination.currentPage.value).toBe(1)
    expect(pagination.totalPages.value).toBe(3)
    expect(pagination.startIndex.value).toBe(0)
    expect(pagination.endIndex.value).toBe(2)
    expect(pagination.currentData.value).toEqual([1, 2])
    expect(pagination.disablePrev.value).toBe(true)
    expect(pagination.disableNext.value).toBe(false)
  })

  it('resets currentPage if it exceeds totalPages when data changes', async () => {
    const pagination = usePagination(data as Ref<number[]>, pageSize as Ref<number>)

    // Move to last page (currentPage = 3)
    pagination.handleNextPage()
    pagination.handleNextPage()

    // Shrink data so totalPages < currentPage
    data.value = [1, 2, 3] // now totalPages = 2

    // Wait for watcher to trigger
    await nextTick()

    expect(pagination.currentPage.value).toBe(1) // resetPage should have been called
    expect(pagination.totalPages.value).toBe(2)
    expect(pagination.currentData.value).toEqual([1, 2])
  })

  it('moves to next page when handleNextPage is called', () => {
    const pagination = usePagination(data as Ref<number[]>, pageSize as Ref<number>)

    pagination.handleNextPage()

    expect(pagination.currentPage.value).toBe(2)
    expect(pagination.currentData.value).toEqual([3, 4])
    expect(pagination.disablePrev.value).toBe(false)
  })

  it('moves to previous page when handlePrevPage is called', () => {
    const pagination = usePagination(data as Ref<number[]>, pageSize as Ref<number>)

    pagination.handleNextPage()
    pagination.handlePrevPage()

    expect(pagination.currentPage.value).toBe(1)
    expect(pagination.currentData.value).toEqual([1, 2])
    expect(pagination.disablePrev.value).toBe(true)
  })

  it('does not exceed total pages', () => {
    const pagination = usePagination(data as Ref<number[]>, pageSize as Ref<number>)

    pagination.handleNextPage()
    pagination.handleNextPage()
    pagination.handleNextPage() // extra click

    expect(pagination.currentPage.value).toBe(3)
    expect(pagination.currentData.value).toEqual([5])
    expect(pagination.disableNext.value).toBe(true)
  })

  it('does not go below page 1', () => {
    const pagination = usePagination(data as Ref<number[]>, pageSize as Ref<number>)

    pagination.handlePrevPage()
    pagination.handlePrevPage()

    expect(pagination.currentPage.value).toBe(1)
    expect(pagination.disablePrev.value).toBe(true)
  })

  it('resets to first page when resetPage is called', () => {
    const pagination = usePagination(data as Ref<number[]>, pageSize as Ref<number>)

    pagination.handleNextPage()
    pagination.handleNextPage()
    pagination.resetPage()

    expect(pagination.currentPage.value).toBe(1)
    expect(pagination.currentData.value).toEqual([1, 2])
  })

  it('updates pagination when data changes', () => {
    const pagination = usePagination(data as Ref<number[]>, pageSize as Ref<number>)

    data.value = [1, 2, 3]

    expect(pagination.totalPages.value).toBe(2)
    expect(pagination.currentData.value).toEqual([1, 2])
  })

  it('updates pagination when page size changes', () => {
    const pagination = usePagination(data as Ref<number[]>, pageSize as Ref<number>)

    pageSize.value = 3

    expect(pagination.totalPages.value).toBe(2)
    expect(pagination.currentData.value).toEqual([1, 2, 3])
  })

  it('handles empty data gracefully', () => {
    data.value = []

    const pagination = usePagination(data as Ref<number[]>, pageSize as Ref<number>)

    expect(pagination.totalPages.value).toBe(0)
    expect(pagination.currentData.value).toEqual([])
    expect(pagination.disablePrev.value).toBe(true)
    expect(pagination.disableNext.value).toBe(true)
  })
})
