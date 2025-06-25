import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterPatient from '@/components/Register/RegisterPatient.vue'
import First from '@/components/First.vue'
import NotFound from '@/components/NotFound.vue'
import Register from '@/components/Register/Register.vue'
import Ambulatory from '@/components/Ambulatory.vue'
import Logs from '@/components/Logs.vue'
import DrugDatas from '@/components/Pharmacy/DrugDatas.vue'
import RecipeInput from '@/components/Form/RecipeInput.vue'
import Recipes from '@/components/Pharmacy/Recipes.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home-main',
      component: HomeView,
      children: [
        {
          path: '',
          name: 'home',
          component: First
        },
        {
          path: 'register',
          name:'register',
          children: [
            {
              path: 'patient-registration',
              name: 'patient-registration',
              component: RegisterPatient
            },
            {
              path: 'service-registration',
              name: 'service-registration',
              component: Register
            },
          ]
        },
        {
          path: 'ambulatory-care',
          name: 'ambulatory-care',
          component: Ambulatory
        },
        {
          path: 'recipe-input',
          name: 'recipe-input',
          component: RecipeInput,
        },
        {
          path: 'logs',
          name: 'logs',
          component: Logs,
        },
        {
          path: 'pharmacy',
          name: 'pharmacy',
          children: [
            {
              path: '',
              name: 'drug-datas',
              component: DrugDatas
            },
            {
              path: 'drug-datas',
              name: 'drug-datas',
              component: DrugDatas
            },
            {
              path: 'recipes',
              name: 'recipes',
              component: Recipes
            },
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFound
    }
  ]
})

export default router
