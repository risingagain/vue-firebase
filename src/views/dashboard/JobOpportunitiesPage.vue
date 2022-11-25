<template>
  <div>
    <h5><b>Job Opportunities</b></h5>
    <div class="row">
      <div class="col-md-6">
        <fieldset class="form-group">
          <input class="form-control" name="name" v-model="selectedItem.name" placeholder="Name"/>
        </fieldset>
        <fieldset class="form-group">
          <input class="form-control" name="email" type="email" v-model="selectedItem.email"
                 placeholder="Email Address"/>
        </fieldset>
        <fieldset class="form-group">
          <input class="form-control" name="description" v-model="selectedItem.description" placeholder="Description"/>
        </fieldset>
        <fieldset class="form-group py-2">
          <input type="checkbox" id="is-active" v-model="selectedItem.active">
          <label for="is-active" class="ml-3">Active</label>
        </fieldset>
      </div>
    </div>
    <div class="text-right">
      <button class="btn btn-secondary px-5" @click="saveItem">{{ selectedItem.id ? 'Save' : 'Add' }}</button>
    </div>
    <div class="table-responsive">
      <table class="table table-striped mt-5">
        <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Description</th>
          <th>Active</th>
          <th style="width: 100px"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in resourceItems" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.active ? 'true' : 'false' }}</td>
          <td class="text-right">
            <button class="btn btn-sm btn-secondary mr-3" @click="selectItem(item)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="removeItem(item)">Delete</button>
          </td>
        </tr>
        <tr v-if="resourceItems.length === 0">
          <td colspan="10">
            <div class="text-center text-muted">
              ...
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {firebaseDB} from "@/utils/firebase"
import {showError} from "@/utils/utils"

export default {
  name: "JobOpportunitiesPage",
  data() {
    return {
      resourceItems: [],
      selectedItem: {},
      loading: false
    }
  },
  computed: {
    selectedItemImage() {
      return this.selectedItem.picture
    }
  },
  methods: {
    selectItem(item) {
      this.selectedItem = JSON.parse(JSON.stringify(item))
      this.selectedItem.id = item.id
    },
    saveItem() {
      // Validate user inputs.
      if (Object.keys(this.selectedItem).length < 3) {
        showError(`Please input all fields`)
        return
      }
      for (const key in this.selectedItem) {
        const value = this.selectedItem[key]
        if (!value) {
          showError(`Please input all fields`)
          return
        }
      }

      this.loading = true
      if (this.selectedItem.id) {
        firebaseDB.collection('jobOpportunities')
            .doc(this.selectedItem.id)
            .set(this.selectedItem)
            .then(() => {
              this.loading = false
            }, error => {
              this.loading = false
              showError(`Failed to save data with error: ${error}`)
            })
      } else {
        firebaseDB.collection('jobOpportunities')
            .add(this.selectedItem)
            .then(() => {
              this.loading = false
            }, error => {
              this.loading = false
              showError(`Failed to save data with error: ${error}`)
            })
      }
      this.selectedItem = {}
    },
    removeItem(item) {
      if (confirm('Are you sure to remove?')) {
        firebaseDB.collection('jobOpportunities').doc(item.id).delete()
      }
    },
  },
  firestore: {
    resourceItems: firebaseDB.collection('jobOpportunities')
  }
}
</script>