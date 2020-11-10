<template>
  <div>
    <VEmojiPicker @select="selectEmoji" />
  </div>
</template>

<script>
import VEmojiPicker from 'v-emoji-picker';
export default {
  name: "testemoji",
  components: {
    VEmojiPicker
  },
  data: () => ({}),
  methods: {
    selectEmoji(emoji) {
      // console.log(emoji)
    }
  }
}
</script>

<style scoped>

</style>
