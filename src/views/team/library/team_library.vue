<template>
  <div class="work">
    <div class="navMenu">
      <div class="createDoc">
        <div class="doc-item">
          <el-link href="/#/document/markdown" type="primary">创建markdown文档</el-link>
        </div>
        <div class="doc-item">
          <el-link href="/#/document/word" type="primary">创建普通文档</el-link>
        </div>
      </div>
      <div class="doc-list">
        <el-card>
          <h3 slot="header">markdown & 富文本</h3>
        </el-card>
      </div>
    </div>
    <div class="worksheet">
      <div class="folderNav">
        <div class="folderName">
          test1
        </div>
        <div class="folderMore">
          <i class="editFolder el-icon-edit-outline"></i>
          <i class="folderOpt el-icon-more"></i>
        </div>
      </div>
      <el-divider></el-divider>

      <div class="worksheetSide">

        <!-- <el-upload
           class="upload"
        >
          <i class="el-icon-upload2"></i>
          上传文件
        </el-upload>
        <el-upload
           multiple
           class="upload"
        >
          <i class="el-icon-upload2"></i>
          上传文件夹
        </el-upload> -->
        <div class="createFolder upload" style="cursor: pointer" @click="createFolder">
          <i class="el-icon-folder"></i>
          创建文件夹
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {

  },
  mounted() {
    // const screenWidth = window.screen.availWidth;
    // let workWidth = screenWidth - 300;
    // workWidth += 'px';
    // document.querySelector('.worksheet').style.width = workWidth;
  },
};
</script>


<style scoped>
  .custom-tree-node {
    align-items: center;
    font-size: 14px;
    padding-right: 8px;
    transition: 3s ease-in-out;
  }

  .custom-tree-node:hover {
    background: red;
  }

  .upload {
    margin-top: 12px;
  }

  .work {
    width: 100%;
    margin-top: 20px;
    margin-left: 20px;
    display: flex;
  }

  .work .navMenu {
    width: 15%;
    height: 800px;
    background-color: #fff;
    min-width: 250px;
    position: relative;
  }

  /* .tree {
  } */

  .work .worksheet {
    width: 80%;
    margin: 0 auto;
    background-color: white;
    padding: 20px;
  }

  .worksheet .folderNav {
    display: flex;
    justify-content: space-between;
  }

  .worksheetSide {
    position: absolute;
    right: 9%;
    top: 15%;
  }

  .createDoc {
    position: absolute;
    left: 60px;
    bottom: 20px;
  }

  .doc-item {
    width: 150px;
    height: 40px;
    margin-top: 20px;
    text-align: center;
    line-height: 40px;
    background-color: #eee;
  }
</style>
