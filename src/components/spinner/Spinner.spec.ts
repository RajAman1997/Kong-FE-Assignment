import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Spinner from '@/components/spinner/Spinner.vue'

describe('Spinner.vue', () => {
  it('renders spinner container', () => {
    const wrapper = mount(Spinner)
    const container = wrapper.find('.loading')
    expect(container.exists()).toBe(true)
  })

  it('renders spinner element', () => {
    const wrapper = mount(Spinner)
    const spinner = wrapper.find('.spinner')
    expect(spinner.exists()).toBe(true)
  })

  it('has correct CSS classes', () => {
    const wrapper = mount(Spinner)
    const container = wrapper.find('.loading')
    expect(container.classes()).toContain('flex')
    expect(container.classes()).toContain('align-center')
    expect(container.classes()).toContain('justify-center')
    expect(container.classes()).toContain('full-width')
  })
})
