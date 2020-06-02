<template>
  <div class="work">
    <div class="navMenu">
      <el-tree
        :data="data"
        class="tree"
        node-key="id"
        default-expand-all
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        :render-content="renderContent"
        draggable
        :allow-drop="allowDrop"
        :allow-drag="allowDrag">
      </el-tree>
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
      <div class="worksheetBody">
        <div class="description">
          It's a folder description
        </div>
        <div class="worksheetFile">
          <el-table
            max-height="500"
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              label="名称"
              width="120">
              <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="最后修改人"
              width="120">
            </el-table-column>
            <el-table-column
              prop="address"
              label="最后修改时间"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="worksheetSide">
        <el-dropdown>
            <el-button type="primary">
              创建文档
              <i class="el-icon-plus"></i>
            </el-button>
              <el-dropdown-menu slot="dropdown">
                 <el-dropdown-item>1</el-dropdown-item>
              </el-dropdown-menu>
        </el-dropdown>
        <el-upload
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
        </el-upload>
        <div class="createFolder upload">
          <i class="el-icon-folder"></i>
          创建文件夹
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const files = ['file1', 'file2', 'file3', 'file4'];
export default {
  data() {
    return {
      data: [{
        id: 1,
        label: '公用文件',
        children: [{
          id: 4,
          label: 'public-1-1',
          children: [{
            id: 9,
            label: 'public 1-1-1',
          },
          {
            id: 10,
            label: 'public 1-1-2',
          }],
        }],
      },
      {
        id: 2,
        label: 'private 2',
        children: [{
          id: 5,
          label: 'paivate 2-1',
        },
        {
          id: 6,
          label: 'praivate 2-2',
        }],
      },
      ],
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
      }],
      multipleSelection: [],
    };
  },
  methods: {
    handleOpen() {
      console.log('open');
    },
    handleClose() {
      console.log('close');
    },
    handleCheckAllChange(val) {
      this.checkedFiles = val ? files : [];
      this.isIndeterminate = false;
    },
    handleCheckedFilesChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.Files.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.Files.length;
    },
    handleDragStart(node, ev) {
      console.log('drag start', node);
      console.log(ev);
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      console.log('tree drag enter: ', dropNode.label);
      console.log(ev);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      console.log('tree drag leave: ', dropNode.label);
      console.log(ev);
    },
    handleDragOver(draggingNode, dropNode, ev) {
      console.log('tree drag over: ', dropNode.label);
      console.log(ev);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      console.log('tree drag end: ', dropNode && dropNode.label, dropType);
      console.log(ev);
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      console.log('tree drop: ', dropNode.label, dropType);
      console.log(ev);
    },
    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.data.label === '二级 3-1') {
        return type !== 'inner';
      }
      return true;
    },
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
    },
    renderContent(h, { node }) {
      return (
        <span>
          <i class="el-icon-s-grid"></i>
          <span class="custom-tree-node">{ node.label }</span>
        </span>
      );
    },
    // append(data) {
    //   const newChild = { id: id += 1, label: 'testtest', children: [] };
    //   if (!data.children) {
    //     this.$set(data, 'children', []);
    //   }
    //   data.children.push(newChild);
    // },
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

  .folderName {
    padding-left: 20px;
  }

  .folderMore i {
    padding-right: 20px;
  }

  .worksheetBody {
    width: 70%;
  }

  .worksheetFile {
    margin-top: 20px;
    overflow: hidden;
  }

  .checkbox {
    display: block;
  }

  .description {
    margin-left: 20px;
  }

  .worksheetSide {
    position: absolute;
    right: 9%;
    top: 15%;
  }

  @media (max-width: 650px){
    .work {
      display: block;
    }
  }
</style>
