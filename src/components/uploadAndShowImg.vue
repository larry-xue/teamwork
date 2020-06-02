<template>
  <div class="avatar">
    <div class="pic" :style="{ backgroundColor: picBgc}">
      <i class="el-icon-picture-outline" style="color: white;" v-show="havePic"></i>
      <!-- <img
        :src="picsrc"
        :style="picsize"
      > -->
      <el-image
      :src="picsrc"
      v-show="!havePic"
      fit="fit"></el-image>
    </div>
    <p>
      <span @click="uploadPic">选择新头像</span>
      <input
        type="file"
        ref="inputPic"
        @change="updatePic"
        accept="image/png,image/gif,image/jpeg"
      >
      <br>
      你可以选择 png/jpg 图片
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // eslint-disable-next-line global-require
      // picsrc: require('../assets/pic.png'),
      picsrc: '',
      havePic: true,
      picsize: {
        width: '40%',
        height: '',
        'object-fit': 'contain',
      },
      picBgc: 'rgb(1,118,255)',
    };
  },
  methods: {
    updatePic(source) {
      const file = source.target.files[0];
      if (window.FileReader) {
        const fr = new FileReader();
        fr.onloadend = (e) => {
          this.picsrc = e.target.result;
          this.picsize.width = '';
          this.picsize.height = '100%';
        };
        fr.readAsDataURL(file);
        this.havePic = false;
      }
    },
    uploadPic() {
      console.log(1);
      this.$refs.inputPic.click();
    },
  },
};
</script>

<style scoped>
.avatar {
  margin-bottom: 20px;
  height: 100%;
  width: 97%;
  border-radius: 50%;
  position: relative;

  display: flex;
  justify-content: left;
  align-items: center;
}

.avatar .pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}


.avatar p {
  font-size: 1.0em;
  color: rgb(178,183,189);
  text-align: left;
  font-size: 14px;
  padding-left: 10px;
}

.avatar p input {
display: none;
}
</style>
