import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from '../App.vue'

describe('App', () => {
  it('mounts with router and shows main landmark', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', name: 'home', component: { template: '<div class="page-home" />' } }],
    })
    await router.push('/')
    await router.isReady()

    const wrapper = mount(App, {
      global: {
        plugins: [createPinia(), router],
        stubs: {
          Header: { template: '<nav data-testid="app-header-nav" />' },
          ContactSection: true,
          Footer: true,
          RouterView: { template: '<div class="router-view-stub" />' },
        },
      },
    })

    await flushPromises()
    expect(wrapper.find('main#app').exists()).toBe(true)
    expect(wrapper.find('[data-testid="app-header-nav"]').exists()).toBe(true)
    expect(wrapper.find('.router-view-stub').exists()).toBe(true)
  })
})
