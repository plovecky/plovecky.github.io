import { createRouter, createWebHistory } from 'vue-router'

import EventsView from '../views/EventsView.vue'
import MyEventsView from '../views/MyEventsView.vue'
import MyTicketsView from '../views/MyTicketsView.vue'
import CreateEventView from '../views/CreateEventView.vue'
import EventDetailView from '../views/EventDetailView.vue'
import BuyTicketView from '../views/BuyTicketView.vue'
import TutorialView from '../views/TutorialView.vue'
import TicketOwnersView from '../views/TicketOwnersView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'events',
      component: EventsView
    },
    {
      path: '/my-events',
      name: 'my-events',
      component: MyEventsView
    },
    {
      path: '/my-tickets',
      name: 'my-tickets',
      component: MyTicketsView
    },
    {
      path: '/create-event',
      name: 'create-event',
      component: CreateEventView
    },
    {
      path: '/event-detail:id',
      name: 'event-detial',
      component: EventDetailView
    },
    {
      path: '/buy-ticket:id',
      name: 'buy-ticket',
      component: BuyTicketView
    },
    {
      path: '/tutorial',
      name: 'tutorial',
      component: TutorialView
    },
    {
      path: '/ticket-owners:id',
      name: 'ticket-owners',
      component: TicketOwnersView
    }
    

  ]
})

export default router
