import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ServiceCatalogCard from '@/components/serviceCatalogCard/ServiceCatalogCard.vue'
import type { Service } from '@/types/service.interface'
import { Status } from '@/constants/status.enum'

const mockService = (overrides: Partial<Service> = {}): Service => ({
  id: '1',
  name: 'Test Service',
  description: 'This is a test service',
  configured: true,
  published: false,
  metrics: { latency: 10.12345, uptime: 0.987, requests: 1234567, errors: 0.01 },
  type: 'REST',
  versions: [
    { id: 'v1', developer: { avatar: '/avatar1.png', id: '1', name: 'John Doe', email: 'johndoe@me.com' }, updated_at: '2022-01-01T00:00:00.000Z', name: '1.0.0' },
    { id: 'v2', developer: { avatar: '/avatar2.png', id: '2', name: 'Jane Doe', email: 'janedoe@me.com' }, updated_at: '2022-02-01T00:00:00.000Z', name: '2.0.0' },
    { id: 'v3', developer: { avatar: '/avatar3.png', id: '3', name: 'Bob Doe', email: 'bobdoe@me.com' }, updated_at: '2022-03-01T00:00:00.000Z', name: '3.0.0' },
  ],
  ...overrides,
})

describe('ServiceCatalogCard.vue', () => {
  it('renders service name and description', () => {
    const wrapper = mount(ServiceCatalogCard, { props: { service: mockService() } })
    expect(wrapper.text()).toContain('Test Service')
    expect(wrapper.text()).toContain('This is a test service')
  })

  it('computes correct status text and icon', () => {
    let service = mockService({ configured: false })
    let wrapper = mount(ServiceCatalogCard, { props: { service } })
    expect(wrapper.text()).toContain(Status.INPROGRESS)
    expect(wrapper.find('img').attributes('src')).toBe('/inprogress.svg')

    service = mockService({ configured: true, published: true })
    wrapper = mount(ServiceCatalogCard, { props: { service } })
    expect(wrapper.text()).toContain(Status.PUBLISHED)
    expect(wrapper.find('img').attributes('src')).toBe('/right.svg')

    service = mockService({ configured: true, published: false })
    wrapper = mount(ServiceCatalogCard, { props: { service } })
    expect(wrapper.text()).toContain(Status.UNPUBLISHED)
    expect(wrapper.find('img').attributes('src')).toBe('/cross.svg')
  })

  it('renders version count correctly', () => {
    const wrapper = mount(ServiceCatalogCard, { props: { service: mockService() } })
    expect(wrapper.text()).toContain('3 Versions')
  })

  it('formats metrics correctly', () => {
    const wrapper = mount(ServiceCatalogCard, { props: { service: mockService() } })
    const text = wrapper.text()
    expect(text).toContain('10.12ms latency')
    expect(text).toContain('98.70% uptime')
    expect(wrapper.text()).toContain('1.2M requests')

    expect(text).toContain('1.00% errors')
  })

  it('renders developer avatars with overflow indicator', () => {
    const wrapper = mount(ServiceCatalogCard, { props: { service: mockService() } })
    const imgs = wrapper.findAll('img')
    expect(imgs.length).toBeGreaterThanOrEqual(2)
    expect(wrapper.text()).toContain('+1')
  })

  it('shows "Not configured with runtime yet" if metrics missing', () => {
    const service = mockService({ metrics: undefined })
    const wrapper = mount(ServiceCatalogCard, { props: { service } })
    expect(wrapper.text()).toContain('Not configured with runtime yet')
  })

  it('formats large request counts correctly', () => {
    const service = mockService({ metrics: { requests: 1_500_000_000, latency: 0, uptime: 1, errors: 0 } })
    const wrapper = mount(ServiceCatalogCard, { props: { service } })
    expect(wrapper.text()).toContain('1.5B')
  })
})
