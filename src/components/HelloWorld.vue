<template>
  <div class="home">
    <h1 class="ignore">{{name}}</h1>
    <p>{{user}}</p>
    <h1 class="ignore">测试</h1>
  </div>
</template>

<script>
import {
  mapState,
  mapGetters,
  mapMutations,
  mapActions
} from 'vuex'
export default {
  name: 'home',
  data () {
    return {}
  },
  methods: {
    ...mapMutations({}),
    ...mapActions({})
  },
  computed: {
    ...mapState({
      name: state => state.name,
      user: state => state.chat.user
    }),
    ...mapGetters({})
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  width: 750px;
}
h1.ignore, h2.ignore {
  font-size: 14px;
  font-weight: normal;
}
</style>
