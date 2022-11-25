<template>
  <div>
    <h5><b>Members</b></h5>
    <div class="row">
      <div class="col-lg-4">
        <div class="h-100">
          <div class="image-container border border-secondary text-center">
            <img :src="selectedItemImage" alt="picture" class="d-inline-block" v-if="selectedItemImage"/>
            <img src="../../assets/img_avatar.png" alt="picture" class="d-inline-block" v-else/>
          </div>
          <div class="form-group text-center mt-1">
            <label for="item-image" class="btn btn-sm btn-secondary d-inline-block w-100">
              Select Image
            </label>
            <input type="file" id="item-image" name="item-image" accept="image/*" class="form-group d-none"
                   @change="onFileChange" ref="upload">
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <fieldset class="form-group">
          <input class="form-control" name="first-name" v-model="selectedItem.firstName"
                 placeholder="First Name"/>
        </fieldset>
        <fieldset class="form-group">
          <input class="form-control" name="last-name" v-model="selectedItem.lastName"
                 placeholder="Last Name"/>
        </fieldset>
        <fieldset class="form-group">
          <input class="form-control" name="zipcode" v-model="selectedItem.zipCode"
                 type="number"
                 placeholder="Zip Code"/>
        </fieldset>
        <fieldset class="form-group">
          <input class="form-control" name="last-name" v-model="selectedItem.areasOfInterest"
                 placeholder="Areas of Interest"/>
        </fieldset>
      </div>
      <div class="col-lg-4">
        <fieldset class="form-group">
          <input class="form-control" name="zipcode" v-model="selectedItem.phoneNumber"
                 type="tel"
                 placeholder="Phone Number"/>
        </fieldset>
        <fieldset class="form-group">
          <input class="form-control" name="email" v-model="selectedItem.email"
                 type="email"
                 placeholder="Email Address"/>
        </fieldset>
        <fieldset class="form-group">
          <input class="form-control" name="created-at" v-model="selectedItem.createdAt"
                 type="date"
                 placeholder="Date of Registration"/>
        </fieldset>
        <fieldset class="form-group">
          <input class="form-control" name="last-login" v-model="selectedItem.lastLogin"
                 type="date"
                 placeholder="Last Login"/>
        </fieldset>
        <fieldset class="form-group py-2">
          <input type="checkbox" id="is-active" v-model="selectedItem.active">
          <label for="is-active" class="ml-3">Active</label>
        </fieldset>
      </div>
    </div>
    <div class="d-flex align-items-center justify-content-end">
      <div class="loading-spinner--container text-center mr-3" v-if="loading">
        <div class="spinner-grow" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <button class="btn btn-secondary px-5" @click="saveItem" :disabled="loading">
        {{ selectedItem.id ? 'Save' : 'Add' }}
      </button>
    </div>
    <div class="table-responsive">
      <table class="table table-striped mt-5">
        <thead>
        <tr>
          <th>Picture</th>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Zip Code</th>
          <th>Areas of Interest</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Date of Registration</th>
          <th>Last Login</th>
          <th>Active</th>
          <th style="width: 100px"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in resourceItems" :key="item.id">
          <td>
            <div class="item-picture">
              <img alt="item-picture" :src="item.picture" v-if="item.picture"/>
              <img alt="item-picture" src="../../assets/img_avatar.png" v-else/>
            </div>
          </td>
          <td>{{ item.firstName }}</td>
          <td>{{ item.lastName }}</td>
          <td>{{ item.zipCode }}</td>
          <td>{{ item.areasOfInterest }}</td>
          <td>{{ item.phoneNumber }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.createdAt }}</td>
          <td>{{ item.lastLogin }}</td>
          <td>{{ item.active ? 'true' : 'false' }}</td>
          <td class="text-right">
            <button class="btn btn-sm btn-secondary mr-3" @click="selectItem(item)">Edit</button>
            <button class="btn btn-sm btn-danger" @click="removeItem(item)">Delete</button>
          </td>
        </tr>
        <tr v-if="resourceItems.length === 0">
          <td colspan="11">
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
import {firebaseDB, firebaseStorage, TaskState} from "@/utils/firebase"
import {showError} from "@/utils/utils"

export default {
  name: "MembersPage",
  data() {
    return {
      resourceItems: [],
      selectedFile: null,
      selectedItem: {},
      loading: false,
    }
  },
  computed: {
    selectedItemImage() {
      if (this.selectedFile) {
        return URL.createObjectURL(this.selectedFile)
      } else {
        return this.selectedItem.picture
      }
    }
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0]
      if (file) {
        this.selectedFile = file
      } else {
        this.selectedFile = null
      }
      this.$refs.upload.value = null
    },
    selectItem(item) {
      this.selectedItem = JSON.parse(JSON.stringify(item))
      this.selectedItem.id = item.id
      this.selectedFile = null
    },
    saveItem() {
      if (this.selectedFile) {
        this.loading = true
        const filename = this.selectedFile.name
        firebaseStorage.ref('images')
            .child(filename)
            .put(this.selectedFile)
            .then(snapshot => {
              if (snapshot.state === TaskState.SUCCESS) {
                this.selectedFile = null
                snapshot.ref.getDownloadURL().then(url => {
                  this.selectedItem.picture = url
                  this.saveItem()
                })
              } else {
                this.loading = false
                showError("Failed to upload image to storage")
              }
            })
        return
      }

      // Validate user inputs.
      if (Object.keys(this.selectedItem).length < 8) {
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
        firebaseDB.collection('members')
            .doc(this.selectedItem.id)
            .set(this.selectedItem)
            .then(() => {
              this.loading = false
            }, error => {
              this.loading = false
              showError(`Failed to save data with error: ${error}`)
            })
      } else {
        firebaseDB.collection('members')
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
        firebaseDB.collection('members').doc(item.id).delete()
      }
    },
  },
  firestore: {
    resourceItems: firebaseDB.collection('members')
  }
}
</script>

<style lang="scss" scoped>
.image-container {
  width: 150px;
  height: 200px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;

  img {
    max-width: 100%;
  }
}

.item-picture {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 40px;
  height: 40px;

  img {
    max-width: 100%;
  }
}
</style>