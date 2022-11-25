<template>
  <div>
    <h5><b>General Information</b></h5>
    <div class="row">
      <div class="col-md-6">
        <fieldset class="form-group">
          <input class="form-control" name="phone-number" v-model="selectedItem.phoneNumber"
                 placeholder="Phone Number" type="tel"/>
        </fieldset>
        <fieldset class="form-group">
          <input class="form-control" name="email" v-model="selectedItem.email"
                 type="email"
                 placeholder="Email Address"/>
        </fieldset>
      </div>
      <div class="col-md-6">
        <fieldset class="form-group">
          <input class="form-control" name="website" v-model="selectedItem.website"
                 type="text"
                 placeholder="Website"/>
        </fieldset>
        <fieldset class="form-group">
          <input class="form-control" name="twitter" v-model="selectedItem.twitter"
                 type="text"
                 placeholder="Twitter"/>
        </fieldset>
        <fieldset class="form-group">
          <input class="form-control" name="facebook" v-model="selectedItem.facebook"
                 type="text"
                 placeholder="Facebook"/>
        </fieldset>
        <fieldset class="form-group">
          <input class="form-control" name="quality-control-number"
                 v-model="selectedItem.qualityControlNumber"
                 type="number"
                 placeholder="Quality Control Number"/>
        </fieldset>
      </div>
    </div>
    <div class="text-right">
      <button class="btn btn-secondary px-5" @click="saveItem">Save</button>
    </div>
  </div>
</template>

<script>
import {firebaseDB} from "@/utils/firebase"
import {showError} from "@/utils/utils"

export default {
  name: "GeneralInformationPage",
  data() {
    return {
      resourceItems: [],
      selectedItem: {},
      loading: false
    }
  },
  watch: {
    resourceItems: function (newItems) {
      if (newItems.length > 0) {
        this.selectedItem = newItems[0]
      }
    }
  },
  methods: {
    saveItem() {
      // Validate user inputs.
      if (Object.keys(this.selectedItem).length < 6) {
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

      if (this.selectedItem.id) {
        this.loading = true
        firebaseDB.collection('generalInformation')
            .doc(this.selectedItem.id)
            .set(this.selectedItem)
            .then(() => {
              this.loading = false
            }, error => {
              this.loading = false
              showError(`Failed to save data with error: ${error}`)
            })
      }
    }
  },
  firestore: {
    resourceItems: firebaseDB.collection('generalInformation')
  }
}
</script>

<style lang="scss" scoped>
.table {
  max-height: 600px;
  overflow-y: auto;
}
</style>