<template>
  <div>
    <ul class="mt-3">
      <li class="appointment-item" v-for="item in appointments" :key="item.id">
        <input type="checkbox" :id="`appointment-${item.id}`" v-model="item.respond"
               @change="respondToAppointment(item)">
        <label :for="`appointment-${item.id}`" class="ml-3">
          <span>
            {{ getTimeString(item.accidentDate.seconds) }} --
            The user <b>{{ item.firstName }} {{ item.lastName }}</b>
            requested a Call to <b>{{ item.phoneNumber }}</b>
          </span>
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
import {firebaseDB} from "@/utils/firebase"
import {format} from 'date-fns'

export default {
  name: "NewsPage",
  data() {
    return {
      appointments: []
    }
  },
  firestore: {
    appointments: firebaseDB.collection('appointments')
  },
  methods: {
    getTimeString(seconds) {
      const date = new Date(seconds * 1000)
      return format(date, 'h:mm a - MM/dd/yyyy')
    },
    respondToAppointment(item) {
      firebaseDB.collection('appointments')
          .doc(item.id)
          .update({respond: item.respond})
    },
  },
}
</script>

<style lang="scss" scoped>
ul {
  list-style: none;

  li {
    font-size: 16px;
  }
}
</style>