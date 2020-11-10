<template>
  <div>
    <button @click="toogleDialogEmoji">😃</button>
    <VEmojiPicker
      v-show="showDialog"
      @select="selectEmoji" />
  </div>
</template>

<script>
import VEmojiPicker from 'v-emoji-picker';
export default {
name: "emoji",
  components: {
    VEmojiPicker
  },
  data: () => ({
    showDialog:false
  }),
  methods: {
    selectEmoji(emoji) {
      // console.log(emoji)
      this.valueInput += emoji.data;
    },
    toogleDialogEmoji() {
      this.showDialog = !this.showDialog;
    },
  }
}
</script>

<style scoped>

</style>
