import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '@/components/button/Button.vue'

describe('BaseButton', () => {
  it('renders label text', () => {
    const wrapper = mount(BaseButton, {
      props: { label: 'Click Me' },
    })

    expect(wrapper.text()).toContain('Click Me')
  })

  it('renders image when imgSrc is provided', () => {
    const wrapper = mount(BaseButton, {
      props: { label: 'Add', imgSrc: '/plus.svg' },
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/plus.svg')
    expect(img.attributes('alt')).toBe('add')
  })

  it('does not render img when imgSrc is not provided', () => {
    const wrapper = mount(BaseButton, {
      props: { label: 'No Image' },
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(false)
  })

  it('renders default label when none provided', () => {
    const wrapper = mount(BaseButton)
    expect(wrapper.text()).toBe('')
  })
})
