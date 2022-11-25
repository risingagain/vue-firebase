<template>
  <div>
    <h5><b>Clinics</b></h5>
    <div class="row">
      <div class="col-lg-4">
        <div class="h-100">
          <div class="image-container border border-secondary text-center">
            <img :src="selectedItemImage" alt="picture" class="d-inline-block" v-if="selectedItemImage" />
            <img src="../../assets/img_avatar.png" alt="picture" class="d-inline-block" v-else />
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
          <input class="form-control" name="name" v-model="selectedItem.name" placeholder="Name" />
        </fieldset>
        <fieldset class="form-group">
          <input class="form-control" name="address" v-model="selectedItem.address"
                 placeholder="Address" />
        </fieldset>
        <fieldset class="form-group">
          <input class="form-control" name="city" v-model="selectedItem.city" placeholder="City" />
        </fieldset>
        <div class="row">
          <div class="col-md-6">
            <fieldset class="form-group">
              <input class="form-control" name="state" v-model="selectedItem.state"
                     placeholder="State" />
            </fieldset>
          </div>
          <div class="col-md-6">
            <fieldset class="form-group">
              <input class="form-control" name="zipcode" v-model="selectedItem.zipCode"
                     type="number"
                     placeholder="Zip Code" />
            </fieldset>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <fieldset class="form-group">
          <input class="form-control" name="zipcode" v-model="selectedItem.phoneNumber"
                 type="tel"
                 placeholder="Phone Number" />
        </fieldset>
        <fieldset class="form-group">
          <input class="form-control" name="email" v-model="selectedItem.email"
                 type="email"
                 placeholder="Email Address" />
        </fieldset>
        <fieldset class="form-group">
          <input class="form-control" name="type" v-model="selectedItem.type"
                 type="text"
                 placeholder="Type" />
        </fieldset>
        <fieldset class="form-group">
          <input
              class="form-control"
              name="type"
              v-model="selectedItem.rank"
              type="number"
              placeholder="Rank"
          />
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
      <button class="btn btn-secondary px-5" @click="getLocation" :disabled="loading">
        {{ selectedItem.id ? 'Save' : 'Add' }}
      </button>
    </div>
    <div class="table-responsive">
      <table class="table table-striped mt-5">
        <thead>
        <tr>
          <th>Picture</th>
          <th>Name</th>
          <th>Address</th>
          <th>City</th>
          <th>State</th>
          <th>Zipcode</th>
          <th>Phone</th>
          <th>Email</th>
          <th>Type</th>
          <th>Rank</th>
          <th>Active</th>
          <th style="width: 100px"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in resourceItems" :key="item.id">
          <td>
            <div class="item-picture">
              <img alt="item-picture" :src="item.picture" v-if="item.picture" />
              <img alt="item-picture" src="../../assets/img_avatar.png" v-else />
            </div>
          </td>
          <td>{{ item.name }}</td>
          <td>{{ item.address }}</td>
          <td>{{ item.city }}</td>
          <td>{{ item.state }}</td>
          <td>{{ item.zipCode }}</td>
          <td>{{ item.phoneNumber }}</td>
          <td>{{ item.email }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.rank }}</td>
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
  name: "ClinicsPage",
  data () {
    return {
      resourceItems: [],
      selectedFile: null,
      selectedItem: {},
      loading: false,
      // eslint-disable-next-line no-undef
      geocoder: new google.maps.Geocoder()
    }
  },
  computed: {
    selectedItemImage () {
      if (this.selectedFile) {
        return URL.createObjectURL(this.selectedFile)
      } else {
        return this.selectedItem.picture
      }
    }
  },
  methods: {
    getLocation () {
      const geocoder = this.geocoder
      geocoder.geocode({'address': this.selectedItem.address}, (results, status) => {
        if (status === 'ZERO_RESULTS') {
          this.selectedItem.geocode = ''
          this.saveItem()
        } else {
          const latitude = results[0].geometry.location.lat()
          const longitude = results[0].geometry.location.lng()
          this.selectedItem.geocode = `${latitude},${longitude}`
          this.saveItem()
        }
      })
    },
    onFileChange (e) {
      const file = e.target.files[0]
      if (file) {
        this.selectedFile = file
      } else {
        this.selectedFile = null
      }
      this.$refs.upload.value = null
    },
    selectItem (item) {
      this.selectedItem = JSON.parse(JSON.stringify(item))
      this.selectedItem.id = item.id
      this.selectedFile = null
    },
    saveItem () {
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
        if (!value && key !== 'geocode') {
          showError(`Please input all fields`)
          return
        }
      }

      this.loading = true
      if (this.selectedItem.id) {
        firebaseDB.collection('clinics')
            .doc(this.selectedItem.id)
            .set(this.selectedItem)
            .then(() => {
              this.loading = false
            }, error => {
              this.loading = false
              showError(`Failed to save data with error: ${error}`)
            })
      } else {
        firebaseDB.collection('clinics')
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
    removeItem (item) {
      if (confirm('Are you sure to remove?')) {
        firebaseDB.collection('clinics').doc(item.id).delete()
      }
    },
  },
  firestore: {
    resourceItems: firebaseDB.collection('clinics')
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
