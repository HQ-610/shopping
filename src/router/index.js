import Vue from 'vue'
import Router from 'vue-router'
import Goodlists from '@/monkeyShop/goodLists'
import Carts from '@/monkeyShop/carts'
import Address from '@/monkeyShop/address'
import OrderConfirm from '@/monkeyShop/orderConfirm'
import OrderSuccess from '@/monkeyShop/orderSuccess'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Goodlists',
      component: Goodlists
    },
    {
      path: '/carts',
      name: 'carts',
      component: Carts
    },
    {
      path: '/address',
      name: 'address',
      component: Address
    },
    {
      path: '/orderConfirm',
      name: 'orderConfirm',
      component: OrderConfirm
    },
    {
      path: '/orderSuccess',
      name: 'orderSuccess',
      component: OrderSuccess
    }
  ]
})
