import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/view/Login'
import Index from '@/view/Index'
import MyProfile from '@/view/MyProfile'
import Discover from '@/view/Discover'
import Topic from '@/view/Topic'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'/index',
      meta:{
        title:"Lucere"
      }
    },
    {
      path:'/login',
      component:Login,
      meta:{
        title:"Welcome to Lucere!"
      }
    },
    {
      path:'/index',
      component:Index,
      meta:{
        title:"Lucere"
      }
    },
    {
      path:"/myprofile/:id",
      component:MyProfile,
      meta:{
        title:"Personal Lucere"
      }
    },
    {
      path:"/discover",
      component:Discover,
      meta:{
        title:"发现Lucere"
      }
    },
    {
      path:"/topic/:name",
      component:Topic,
      meta:{
        title:"#Lucere"
      }
    }
  ],
  mode:'history'
})
