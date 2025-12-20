import { computed, ref, watch, type Ref, type ComputedRef } from 'vue'

export function usePagination<T>(data: Ref<T[]>, pageSize: Ref<number>): {
  currentPage: Ref<number>
  totalPages: ComputedRef<number>
  startIndex: ComputedRef<number>
  endIndex: ComputedRef<number>
  currentData: ComputedRef<T[]>
  disablePrev: ComputedRef<boolean>
  disableNext: ComputedRef<boolean>
  handleNextPage: () => void
  handlePrevPage: () => void
  resetPage: () => void
} {
  const currentPage = ref(1)
  const totalPages = computed(() => Math.ceil(data.value.length / pageSize.value))
  const startIndex = computed(() => (currentPage.value - 1) * pageSize.value)
  const endIndex = computed(() => {
    const endIndex = startIndex.value + pageSize.value
    return endIndex > data.value.length ? data.value.length : endIndex
  })
  const currentData = computed(() => data.value.slice(startIndex.value, endIndex.value))
  const disablePrev = computed(() => currentPage.value <= 1)
  const disableNext = computed(() => {
    if (totalPages.value === 0) return true
    return currentPage.value >= totalPages.value
  })

  const handleNextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  const handlePrevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  const resetPage = () => {
    currentPage.value = 1
  }

  watch(
    () => data.value.length,
    () => {
      if (currentPage.value > totalPages.value) {
        resetPage()
      }
    },
  )

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    currentData,
    disablePrev,
    disableNext,
    handleNextPage,
    handlePrevPage,
    resetPage,
  }
}