import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InputSearch from '@/components/search/Search.vue'

describe('InputSearch.vue', () => {
  it('renders input and search icon', () => {
    const wrapper = mount(InputSearch, {
      props: {
        modelValue: '',
      },
    })

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('placeholder')).toBe('Search')

    const icon = wrapper.find('.search-icon')
    expect(icon.exists()).toBe(true)
  })

  it('binds v-model correctly', async () => {
    const wrapper = mount(InputSearch, {
      props: {
        modelValue: '',
      },
    })

    const input = wrapper.find('input')

    // Simulate typing
    await input.setValue('Test Search')

    // Expect event emitted
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted![0]).toEqual(['Test Search'])
  })

  it('reflects modelValue prop in input', async () => {
    const wrapper = mount(InputSearch, {
      props: {
        modelValue: 'Initial',
      },
    })

    const input = wrapper.find('input')
    expect((input.element as HTMLInputElement).value).toBe('Initial')

    // Update prop and verify input updates
    await wrapper.setProps({ modelValue: 'Updated' })
    expect((input.element as HTMLInputElement).value).toBe('Updated')
  })
})
