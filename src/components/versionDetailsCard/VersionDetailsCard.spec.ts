import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VersionDetailsCard from '@/components/versionDetailsCard/versionDetailsCard.vue'
import type { Service } from '@/types/service.interface'

const mockService: Service = {
  id: '1',
  name: 'Service A',
  description: 'This is Service A',
  published: false,
  configured: true,
  type: 'API',
  metrics: {
    latency: 0,
    uptime: 0,
    requests: 0,
    errors: 0,
  },
  versions: [
    {
      id: '1',
      name: '1.0.0',
      description: 'Initial release',
      updated_at: new Date().toISOString(),
      developer: {
        id: '1',
        name: 'John Doe',
        email: 'johndoe@me.com',
        avatar: '/avatar.png',
      },
    },
    {
      id: '2',
      name: '1.1.0',
      description: 'Bug fixes',
      updated_at: new Date().toISOString(),
      developer: {
        id: '2',
        name: 'Jane Doe',
        email: 'janedoe@me.com',
        avatar: '/avatar.png',
      },
    },
  ],
}

describe('VersionDetailsCard.vue', () => {
  it('renders nothing when modelValue is false', () => {
    const wrapper = mount(VersionDetailsCard, {
      props: { modelValue: false, service: mockService },
    })
    expect(wrapper.find('.backdrop').exists()).toBe(false)
  })

  it('renders dialog and versions when modelValue is true', () => {
    const wrapper = mount(VersionDetailsCard, {
      props: { modelValue: true, service: mockService },
    })
    const backdrop = wrapper.find('.backdrop')
    expect(backdrop.exists()).toBe(true)

    const versions = wrapper.findAll('.version-details')
    expect(versions.length).toBe(mockService.versions.length)
  })

  it('computes correct version count', () => {
    const wrapper = mount(VersionDetailsCard, {
      props: { modelValue: true, service: mockService },
    })
    expect(wrapper.find('.title').text()).toContain(mockService.versions.length.toString())
  })

  it('formats developer name correctly', () => {
    const wrapper = mount(VersionDetailsCard, {
      props: { modelValue: true, service: mockService },
    })
    const devName = wrapper.find('.publisher-name').text()
    expect(devName).toBe('John D.')
  })

  it('emits update:modelValue on backdrop click', async () => {
    const wrapper = mount(VersionDetailsCard, {
      props: { modelValue: true, service: mockService },
    })
    await wrapper.find('.backdrop').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([])
  })

  it('does not close dialog when clicking inside dialog', async () => {
    const wrapper = mount(VersionDetailsCard, {
      props: { modelValue: true, service: mockService },
    })
    await wrapper.find('.dialog').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })
})
