import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ServiceCatalog from '@/components/serviceCatalog/ServiceCatalog.vue'
import type { Service } from '@/types/service.interface'
import { createTestingPinia } from '@pinia/testing'
import { useServiceStore } from '@/stores/service'

const mockService: Service = {
  id: '1',
  name: 'Service A',
  description: 'This is Service A',
  type: 'API',
  published: false,
  configured: true,
  metrics: {} as unknown as any,
  versions: [
    {
      id: '1',
      number: '1.0.0',
      createdDate: new Date(),
      updatedDate: new Date(),
    } as unknown as any,
    {
      id: '2',
      number: '1.1.0',
      createdDate: new Date(),
      updatedDate: new Date(),
    } as unknown as any,
  ],
}

describe('ServiceCatalog', () => {
  let wrapper: any
  let pinia: any
  let serviceStore: ReturnType<typeof useServiceStore>

  beforeEach(() => {
    pinia = createTestingPinia({
      stubActions: false,
    })

    wrapper = mount(ServiceCatalog, {
      global: {
        plugins: [pinia],
        stubs: {
          Teleport: true,
          InputSearch: {
            template: '<input @input="$emit(\'update:modelValue\', $event.target.value)" />',
          },
          BaseButton: {
            props: ['label', 'imgSrc'],
            template: '<button class="create-btn" @click="$emit(\'click\')">{{ label }}</button>',
          },
          ServiceCatalogCard: true,
          VersionDetailsCard: true,
          AppSpinner: {
            template: '<div class="spinner"></div>',
          },
        },
      },
    })

    serviceStore = useServiceStore()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    wrapper.unmount()
  })

  it('shows spinner when loading is true', async () => {
    serviceStore.loading = true
    serviceStore.service = []

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.spinner').exists()).toBe(true)
  })

  it('renders service list when data is fetched', async () => {
    serviceStore.service = [mockService]
    serviceStore.loading = false

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.spinner').exists()).toBe(false)
    expect(wrapper.find('.service-catalog-list').exists()).toBe(true)
    expect(wrapper.findAll('.service-catalog-card').length).toBe(1)
  })

  it('filters services by search query', async () => {
    serviceStore.service = [
      mockService,
      {
        id: '2',
        name: 'Service B',
        description: 'This is Service B',
        type: 'API',
        published: false,
        configured: false,
        versions: [],
        metrics: {
          latency: 0,
          uptime: 0,
          requests: 0,
          errors: 0,
        },
      },
    ]
    serviceStore.loading = false

    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.service-catalog-card').length).toBe(2)

    await wrapper.find('input').setValue('Service B')
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.service-catalog-card').length).toBe(1)

    await wrapper.find('input').setValue('Service A')
    await wrapper.vm.$nextTick()
    expect(wrapper.findAll('.service-catalog-card').length).toBe(1)
  })

  it('opens version dialog when clicking a service with versions', async () => {
    serviceStore.service = [mockService]
    serviceStore.loading = false

    await wrapper.vm.$nextTick()

    await wrapper.find('.service-catalog-card').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-test="version-dialog"]').exists()).toBe(true)
  })

  it('closes version dialog when update:modelValue emitted', async () => {
    serviceStore.service = [mockService]
    serviceStore.loading = false

    await wrapper.vm.$nextTick()
    await wrapper.find('.service-catalog-card').trigger('click')
    await wrapper.vm.$nextTick()

    const dialog = wrapper.findComponent({ name: 'VersionDetailsCard' })
    dialog.vm.$emit('update:modelValue', false)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-test="version-dialog"]').exists()).toBe(false)
  })

  it('does not open dialog when service has no versions', async () => {
    serviceStore.service = [{ ...mockService, versions: [] }]
    serviceStore.loading = false

    await wrapper.vm.$nextTick()
    await wrapper.find('.service-catalog-card').trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-test="version-dialog"]').exists()).toBe(false)
  })

  it('renders empty list when no services exist', async () => {
    serviceStore.service = []
    serviceStore.loading = false

    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.service-catalog-card').length).toBe(0)
  })

  it('disables prev button on first page', async () => {
    serviceStore.service = Array.from({ length: 10 }, (_, i) => ({
      ...mockService,
      id: String(i),
    }))
    serviceStore.loading = false

    await wrapper.vm.$nextTick()

    expect(wrapper.find('.pagination-btn:disabled').exists()).toBe(true)
  })

  it('resets pagination when search changes', async () => {
    serviceStore.service = Array.from({ length: 20 }, (_, i) => ({
      ...mockService,
      id: String(i),
      name: `Service ${i}`,
    }))
    serviceStore.loading = false

    await wrapper.vm.$nextTick()
    await wrapper.find('input').setValue('Service 1')
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.service-catalog-card').length).toBeGreaterThan(0)
  })

  it('calls alert when "Service Package" button is clicked', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {})

    const wrapper = mount(ServiceCatalog, {
      global: {
        stubs: {
          InputSearch: true,
          BaseButton: {
            props: ['label', 'imgSrc'],
            template: '<button class="create-btn" @click="$emit(\'click\')">{{ label }}</button>',
          },
          ServiceCatalogCard: true,
          VersionDetailsCard: true,
          AppSpinner: {
            template: '<div class="spinner"></div>',
          },
          Teleport: true,
        },
        plugins: [createTestingPinia({ stubActions: false })],
      },
    })

    const button = wrapper.find('.create-btn')
    expect(button.exists()).toBe(true)

    await button.trigger('click')

    expect(alertMock).toHaveBeenCalledWith('Service Package button clicked!')

    alertMock.mockRestore()
  })

})
