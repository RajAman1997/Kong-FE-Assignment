import { mount, flushPromises } from '@vue/test-utils'
import { it, expect, beforeEach, vi } from 'vitest'
import ServiceCatalog from '@/components/ServiceCatalog.vue'

const mockServices = [
  { id: 1, name: 'Service A', description: 'Desc', type: 'api', versions: [{ v: 1 }] },
  { id: 2, name: 'Service B', description: 'Desc', type: 'api', versions: [] },
  { id: 3, name: 'Another', description: 'Desc', type: 'api', versions: [{ v: 2 }] },
]

beforeEach(() => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockServices),
    }),
  ) as any

  vi.spyOn(window, 'alert').mockImplementation(() => {})
})

const mountPage = () =>
  mount(ServiceCatalog, {
    attachTo: document.body,
  })

const wait = async () => {
  await flushPromises()
  await Promise.resolve()
}

it('renders loading spinner initially', async () => {
  global.fetch = vi.fn(() => new Promise(() => {}))

  const wrapper = mountPage()
  await wrapper.vm.$nextTick()

  expect(wrapper.find('.spinner').exists()).toBe(true)
})

it('search filters the list', async () => {
  const wrapper = mountPage()
  await wait()

  await wrapper.find('input').setValue('Service A')
  await wait()

  const cards = wrapper.findAll('.service-catalog-card')
  expect(cards.length).toBe(1)
  expect(cards[0].text()).toContain('Service A')
})

it('opens version dialog when clicking a service with versions', async () => {
  const wrapper = mountPage()
  await wait()

  const first = wrapper.findAll('.service-catalog-card')[0]
  await first.trigger('click')
  await wait()

  const dialog = document.querySelector('[data-test="version-dialog"]')
  expect(dialog).not.toBeNull()
})

it('closes version dialog when update:modelValue emitted', async () => {
  const wrapper = mountPage()
  await wait()

  await wrapper.findAll('.service-catalog-card')[0].trigger('click')
  await wait()

  const component = wrapper.findComponent({ name: 'VersionDetailsCard' })
  expect(component.exists()).toBe(true)

  component.vm.$emit('update:modelValue', false)
  await wait()

  const dialog = document.body.querySelector('[data-test-version-dialog]')
  expect(dialog).toBeNull()
})

it('pagination works (next / prev)', async () => {
  const wrapper = mountPage()
  await wait()

  const vm = wrapper.vm as any

  vm.serviceList = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    name: `Service ${i}`,
    description: 'x',
    type: 'api',
    versions: [],
  }))

  vm.pagination.totalPages = Math.ceil(vm.serviceList.length / vm.pagination.itemsPerPage)
  await wait()

  const allButtons = wrapper.findAllComponents({ name: 'BaseButton' })
  const nextBtn = allButtons.find(b => b.props().label === '→')
  const prevBtn = allButtons.find(b => b.props().label === '←')

  if (!nextBtn || !prevBtn) {
    throw new Error('Pagination buttons not found')
  }

  expect(vm.pagination.currentPage).toBe(1)
  await nextBtn.trigger('click')
  await wait()
  expect(vm.pagination.currentPage).toBe(2)

  await prevBtn.trigger('click')
  await wait()
  expect(vm.pagination.currentPage).toBe(1)
})

it('create service button triggers alert', async () => {
  const wrapper = mountPage()
  await wait()

  const createBtn = wrapper.find('.create-btn')
  await createBtn.trigger('click')

  expect(window.alert).toHaveBeenCalledWith('Service Package button clicked!')
})
