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
  type: 'REST',
  metrics: { latency: 10.12345, uptime: 0.987, requests: 1234567, errors: 0.01 },
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

  it('renders version count div only when versions exist', () => {
    let service = mockService({ versions: [] })
    let wrapper = mount(ServiceCatalogCard, { props: { service } })
    expect(wrapper.find('.versions').exists()).toBe(false)

    service = mockService({ versions: [{ id: 'v1', developer: {} } as any] })
    wrapper = mount(ServiceCatalogCard, { props: { service } })
    expect(wrapper.find('.versions').exists()).toBe(true)
    expect(wrapper.find('.versions').text()).toContain('1 Versions')
  })

  it('formats latency correctly', () => {
    const service = mockService({ metrics: { latency: 12.3456, uptime: 1, requests: 0, errors: 0 } })
    const wrapper = mount(ServiceCatalogCard, { props: { service } })
    expect(wrapper.text()).toContain('12.35ms latency')
  })

  it('formats requests and errors correctly', () => {
    const service = mockService({ metrics: { requests: 1234567, latency: 0, uptime: 1, errors: 0.02 } })
    const wrapper = mount(ServiceCatalogCard, { props: { service } })
    expect(wrapper.text()).toContain('1.2M requests')
    expect(wrapper.text()).toContain('2.00% errors')
  })

  it('renders "Not configured with runtime yet" if metrics missing', () => {
    const service = mockService({ metrics: undefined })
    const wrapper = mount(ServiceCatalogCard, { props: { service } })
    expect(wrapper.text()).toContain('Not configured with runtime yet')
  })

  it('formats large request counts correctly', () => {
    const service = mockService({ metrics: { requests: 1_500_000_000, latency: 0, uptime: 1, errors: 0 } })
    const wrapper = mount(ServiceCatalogCard, { props: { service } })
    expect(wrapper.text()).toContain('1.5B')
  })

  it('formats requests in "k" when >= 1000 but < 1M', () => {
    const service = mockService({ metrics: { requests: 12345, latency: 0, uptime: 1, errors: 0 } })
    const wrapper = mount(ServiceCatalogCard, { props: { service } })
    expect(wrapper.text()).toContain('12k requests')
  })

  it('returns "0" requests when requests is 0', () => {
    const service = mockService({ metrics: { requests: 0, latency: 0, uptime: 1, errors: 0.01 } })
    const wrapper = mount(ServiceCatalogCard, { props: { service } })
    expect(wrapper.text()).toContain('0 requests')
  })

  it('formats requests < 1000 correctly', () => {
    const service = mockService({ metrics: { requests: 42, latency: 0, uptime: 1, errors: 0 } })
    const wrapper = mount(ServiceCatalogCard, { props: { service } })
    expect(wrapper.text()).toContain('42 requests')
  })

  it('renders developer avatars with overflow indicator', () => {
    const service = mockService({
      versions: [
        { id: 'v1', developer: { avatar: '/a1.png' } as any } as any,
        { id: 'v2', developer: { avatar: '/a2.png' } as any } as any,
        { id: 'v3', developer: { avatar: '/a3.png' } as any } as any,
        { id: 'v4', developer: { avatar: '/a4.png' } as any } as any,
      ],
    })
    const wrapper = mount(ServiceCatalogCard, { props: { service } })
    const avatarDiv = wrapper.find('.publisher-avatar div')
    expect(avatarDiv.exists()).toBe(true)
    expect(avatarDiv.text()).toBe('+2') // extra avatars beyond 2
  })
})
