import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Header from '@/components/header/Header.vue'

describe('Header.vue', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(Header)
  })

  it('renders the brand logo and title', () => {
    const logo = wrapper.find('.logo img')
    expect(logo.exists()).toBe(true)
    expect(logo.attributes('src')).toBe('/logo.svg')
    expect(logo.attributes('alt')).toBe('Konnect logo')

    expect(wrapper.find('.logo').text()).toContain('Konnect')
  })

  it('renders navigation links correctly', () => {
    const navItems = wrapper.findAll('nav div')
    expect(navItems.length).toBe(2)

    expect(navItems[0].text()).toContain('Organization')
    expect(navItems[0].find('img').attributes('src')).toBe('/user_group.svg')
    expect(navItems[0].find('img').attributes('alt')).toBe('Organization logo')

    expect(navItems[1].text()).toContain('Settings')
    expect(navItems[1].find('img').attributes('src')).toBe('/settings.svg')
    expect(navItems[1].find('img').attributes('alt')).toBe('Settings logo')
  })

  it('renders user info correctly', () => {
    const userDiv = wrapper.find('.right-header')
    expect(userDiv.text()).toContain('Katherine Ellis')

    const userImg = userDiv.find('img')
    expect(userImg.exists()).toBe(true)
    expect(userImg.attributes('src')).toBe('/user.svg')
    expect(userImg.attributes('alt')).toBe('Katherine Ellis logo')
  })
})
