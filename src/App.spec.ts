import { mount } from '@vue/test-utils'
import App from '@/App.vue'
import { describe, expect, it } from 'vitest'

describe('App.vue', () => {
  it('renders without crashing', () => {
    const wrapper = mount(App, {
      global: {
        stubs: ['router-view'], // stub router-view
      },
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'ServiceHeader' }).exists()).toBe(true)
  })
})
