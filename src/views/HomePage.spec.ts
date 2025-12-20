import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HomePage from '@/views/HomePage.vue'
import ServiceCatalog from '@/components/serviceCatalog/ServiceCatalog.vue'

describe('HomePage.vue', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(HomePage, {
      global: {
        stubs: {
          ServiceCatalog: true,
        },
      },
    })
  })

  it('renders without crashing', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('renders ServiceCatalog component', () => {
    const catalog = wrapper.findComponent(ServiceCatalog)
    expect(catalog.exists()).toBe(true)
  })
})
