<template>
  <div class="h-100 p-0 p-md-5">
    <div class="card mx-auto shadow-sm mb-5">
      <div class="card-header">
        <ul class="nav nav-pills nav-justified">
          <li class="nav-item" :class="activeClass('news')">
            <router-link to="/dashboard/news" class="nav-link">News</router-link>
          </li>
          <li class="nav-item" :class="activeClass('tasks')">
            <router-link to="/dashboard/tasks" class="nav-link">Tasks</router-link>
          </li>
          <li class="nav-item dropdown" :class="activeClass('resources')">
            <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button"
               aria-haspopup="true" aria-expanded="false">Resources</a>
            <div class="dropdown-menu">
              <router-link to="/dashboard/resources/clinics" class="dropdown-item">
                Clinics
              </router-link>
              <router-link to="/dashboard/resources/attornies" class="dropdown-item">
                Attorneys
              </router-link>
              <router-link to="/dashboard/resources/services" class="dropdown-item">
                Services
              </router-link>
              <router-link to="/dashboard/resources/benefits" class="dropdown-item">
                Benefits
              </router-link>
              <router-link to="/dashboard/resources/job-opportunities" class="dropdown-item">
                Job Opportunities
              </router-link>
              <router-link to="/dashboard/resources/general-information" class="dropdown-item">
                General Information
              </router-link>
            </div>
          </li>
          <li class="nav-item" :class="activeClass('members')">
            <router-link to="/dashboard/members" class="nav-link">Members</router-link>
          </li>
          <li class="nav-item">
            <a href="javascript:" @click="logout" class="nav-link">Logout</a>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import {firebaseAuth} from "@/utils/firebase";

export default {
  name: "Dashboard.vue",
  watch: {
    '$route'() {
      $('.dropdown-toggle').dropdown('hide')
    }
  },
  methods: {
    activeClass(path) {
      return this.$route.path.includes(path) ? 'is-link-active' : '';
    },
    logout() {
      firebaseAuth.signOut().then(() => {
        this.$router.push({name: 'login'})
      }, error => {
        alert(`Logout failed with error: ${error}`)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
div.card {
  max-width: 1200px;
  width: 100%;
  min-height: 800px;

  .card-header {
    background-color: var(--color-primary);
    color: white;

    .nav-link {
      background-color: transparent;
      color: lightgray;
      font-weight: 800;
      margin-left: 10px;
      margin-right: 10px;
      transition: 200ms;

      @media (hover: hover) {
        &:hover {
          background-color: rgba(0, 0, 0, 0.5);
        }
      }
    }

    .nav-item.is-link-active {
      .nav-link {
        background-color: rgba(255, 255, 255, 0.9);
        color: black;
      }
    }
  }
}
</style>