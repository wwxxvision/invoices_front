import Auth from '../pages/auth';
import Page from '../pages/page'

const ROUTER = [
  {
    component: Auth,
    path: '/auth',
    exact: true
  },
  {
    component: Page,
    path: '/clients',
    exact: true,
    name: "clients",
    title: "Клиенты"
  },
  {
    component: Page,
    path: '/',
    exact: true,
    name: "invoices",
    title: "Инвойсы"
  },
]

export default ROUTER;