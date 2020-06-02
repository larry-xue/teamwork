<template>
    <div class="ctr-editor">
        <!--按钮区-->
        <div class="nav">
          <button @click="execCommand('insertUnorderedList')">无序列表</button>
          <button @click="execCommand('insertHorizontalRule')">水平线</button>
          <button @click="execCommand('undo')">后退</button>
          <button @click="execCommand('redo')">前进</button>
          <button @click="execCommand('bold')">加粗</button>
          <button @click="execCommand('formatBlock', '<p>')">段落</button>
          <button class="nav__img">插入图片
            <input type="file" accept="image/gif, image/jpeg, image/png" @change="insertImg">
          </button>

        </div>
        <!--编辑区-->
        <div class="editor" contenteditable="true">
          asd
        </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      editor: '',
    };
  },
  mounted() {
    this.editor = document.querySelector('.editor');
    this.editor.addEventListener('click', this.handleClick);
  },
  methods: {
    execCommand(name, args = null) {
      document.execCommand(name, false, args);
    },
    insertImg(e) {
      const reader = new FileReader();
      const file = e.target.files[0];
      reader.onload = () => {
        const base64Img = reader.result;
        this.execCommand('insertImage', base64Img);
        document.querySelector('.nav__img input').value = ''; // 解决同一张图片上传无效的问题
      };
      reader.readAsDataURL(file);
    },
    handleClick(e) {
      if (
        e.target
            && e.target.tagName
            && e.target.tagName.toUpperCase() === 'IMG'
      ) {
        this.handleClickImg(e.target);
      }
    },

  },
};
</script>

<style>
/* 若加入scoped 则样式对编辑区的内容不生效 */
  .ctr-editor {
    width: 95%;
    height: 800px;
    margin: 0 auto;
    padding: 10px;
  }

  .nav {
    display: flex;
  }
</style>
