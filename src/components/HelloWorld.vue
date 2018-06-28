<template>
  <div class="home">
    <h1 class="ignore">{{name}}</h1>
    <a href="javascript:void(0)">{{user}}</a>
    <h1 class="ignore">测试</h1>
    <p>这是一段测试文本</p>
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
<style lang="scss" scoped>
.hello {
  width: 750px;
}
h1.ignore, h2.ignore {
  font-size: 14px;
  font-weight: normal;
}
a {
  color: #555;
  text-decoration: none;
  &:hover {
    color: red;
  }
  &:active {
    color: #444;
  }
}
p {
  font-size: 18px;
  width: 300px;
  margin: 0 auto;
}
</style>
