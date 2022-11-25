<template>
  <div class="d-flex align-items-center h-100">
    <div class="card mx-auto shadow-sm">
      <div class="card-body p-0">
        <div class="row no-gutters">
          <div class="col-sm-6">
            <div class="left-panel text-center p-5">
              <h3>WELCOME</h3>
              <img src="../assets/resolver.png" alt="login page logo" class="w-100 mt-3"/>
            </div>
          </div>
          <div class="col-sm-6">
            <div class="right-panel p-4">
              <h5 class="text-center">
                <span class="d-inline-block border-bottom border-secondary px-4">LOGIN</span>
              </h5>
              <section class="mt-5">
                <form>
                  <div class="form-group">
                    <input type="email" name="email" placeholder="Email Address"
                           class="form-control" v-model="email"/>
                  </div>
                  <div class="form-group">
                    <input type="password" name="password" placeholder="Password"
                           class="form-control" autocomplete="on" v-model="password"/>
                  </div>
                </form>
              </section>
              <button type="submit" class="btn btn-secondary w-100 mt-3" :disabled="loading"
                      @click="requestLogin">
                LOGIN
              </button>
              <div class="loading-spinner--container text-center mt-3" v-if="loading">
                <div class="spinner-grow" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {firebaseAuth} from "@/utils/firebase"
import {showError} from "@/utils/utils";

export default {
  name: "Login.vue",
  data() {
    return {
      loading: false,
      email: '',
      password: '',
    }
  },
  methods: {
    requestLogin() {
      this.loading = true
      firebaseAuth.signInWithEmailAndPassword(this.email, this.password).then(user => {
        if (user) {
          this.loading = false
          this.$router.push('dashboard')
        }
      }).catch(() => {
        this.loading = false
        showError(`Failed to login to Firebase with error. Please try again.`)
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.card {
  max-width: 600px;
  width: 100%;

  h3 {
    letter-spacing: 3px;
    font-size: 20px;
    font-weight: 700;
    color: white;
  }

  .left-panel {
    background-color: var(--color-primary);

    img {
      max-width: 200px;
    }
  }
}
</style>