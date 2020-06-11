<template>
  <div class="settings">
    <div class="update">
      <el-form
        :model="upDateUser"
        :ruleForm="ruleForm" ref="upDateUser"
        style="max-width: 60%;">
        <div class="uploadPic">
          <upload-and-show-img></upload-and-show-img>
        </div>
        <el-form-item label="姓名:">
          <el-input
            class="input"
            placeholder="请输入姓名"
            v-model="upDateUser.name"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="职务:">
            <el-input
              class="input"
              disabled
              :value="upDateUser.work"
            ></el-input>
        </el-form-item> -->
        <el-form-item label="邮箱:">
            <el-input
              class="input"
              v-model="upDateUser.email"
              placeholder="email"
            >
              <el-select v-model="upDateUser.emailSelect" style="width: 130px" slot="append">
                <el-option value="@qq.com"></el-option>
                <el-option value="@163.com"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        <!-- <el-form-item label="默认首页:">
          <el-select v-model="upDateUser.firstPage" placeholder="请选择默认首页" class="input">
            <el-option value="办公"></el-option>
            <el-option value="日历"></el-option>
            <el-option value="团队"></el-option>
            <el-option value="动态"></el-option>
            <el-option value="自己"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="网页背景:">

        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>

      <el-divider></el-divider>

      <div class="password">
        <el-form :model="passwordForm" :rules="ruleForm" ref="passwordForm">
          <el-form-item prop="oldPassword" label="旧密码:">
            <el-input
              v-model="passwordForm.oldPassword"
              class="input"
              prefix-icon="el-icon-lock"
              show-password placeholder="password"
            >
            </el-input>
          </el-form-item>
          <el-form-item prop="newPassword" label="新密码:">
            <el-input
              class="input"
              v-model="passwordForm.newPassword"
              prefix-icon="el-icon-lock"
              show-password placeholder="confirm password"
            >
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitPassword('passwordForm')">更改密码</el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-divider></el-divider>
        <el-button type="danger" @click="fireMyself">退出团队</el-button>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5';
import { mapState } from 'vuex';
import uploadAndShowImg from '../../../components/uploadAndShowImg.vue';

export default {
  components: {
    uploadAndShowImg,
  },
  computed: {
    ...mapState({
      teamInfo: (state) => state.teamInfo,
      userInfo: (state) => state.userInfo,
    }),
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码长度应大于 6 位'));
      } else if (value.length > 14) {
        callback(new Error('密码长度应小于 15 位'));
      } else {
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else if (value.length < 5) {
        callback(new Error('密码长度应大于 6 位'));
      } else if (value.length > 14) {
        callback(new Error('密码长度应小于 15 位'));
      } else {
        callback();
      }
    };
    return {
      upDateUser: {
        name: '',
        email: '',
        emailSelect: '@qq.com',
      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
      },
      imageUrl: '',
      ruleForm: {
        oldPassword: [
          {
            validator: validatePass,
            trigger: 'blur',
          },
        ],
        newPassword: [
          {
            validator: validatePass2,
            trigger: 'blur',
          },
        ],
      },
    };
  },
  methods: {
    onSubmit() {
      const param = new FormData();
      const file = this.$children[0].$children[0].$el.children[1].children[1].files[0];
      console.log(file);
      if (file !== undefined) {
      // 上传图片
        param.append('file', file);
        this.$http.put('/v1/users/avatar', param, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }).then((res) => {
          console.log(res);
          if (res.data.code === 0) {
          // 更新信息
            this.changeUserInfo(res.data.data.avatar);
          }
        }).catch((err) => {
        // 头像上传失败
          console.log(err);
        });
      } else {
        this.changeUserInfo(false);
      }
    },
    // eslint-disable-next-line consistent-return
    onSubmitPassword(formName) {
    // eslint-disable-next-line consistent-return
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            type: 'info',
            message: '密码更改中.....',
          });
          this.$http.put('/v1/users/password', {
            password: md5(this.passwordForm.oldPassword),
            password2: md5(this.passwordForm.newPassword),
          }).then((res) => {
            console.log(res);
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '密码修改成功~',
              });
            }
          }).catch((err) => {
            this.$message({
              type: 'warning',
              message: err,
            });
          });
        } else {
          return false;
        }
      });
    },
    // eslint-disable-next-line consistent-return
    fireMyself() {
      if (this.userInfo.id === this.teamInfo.leader_id) {
        this.$message({
          message: '你必须先转移职务，才能退出团队',
          type: 'warning',
        });
        return false;
      }
      this.$http.post(`/v1/teams/${this.teamInfo.id}`, {
        uid: this.userInfo.id,
        action: 2,
      }).then((res) => {
        console.log('/v1/teams');
        console.log(res);
        if (res.data.code === 0) {
          this.$message({
            type: 'info',
            message: '退出成功',
          });
        }
      }).catch(() => {
        this.$message({
          type: 'warning',
          message: '退出失败',
        });
      });
    },
    exceedFile() {
      console.log('file');
    },
    changeUserInfo(url) {
      const sendInfo = {};
      if (url) {
        sendInfo.url = url;
      }
      if (this.upDateUser.name.trim() !== '') {
        sendInfo.name = this.upDateUser.name.trim();
      }
      if (this.upDateUser.email.trim() !== '') {
        sendInfo.email = this.upDateUser.email + this.upDateUser.emailSelect;
      }
      console.log(sendInfo);
      if (sendInfo !== {}) {
        this.$http.patch('/v1/users', sendInfo).then((res) => {
          // 更新用户信息
          console.log(res);
          if (res.data.code === 0) {
            this.$store.commit('updateUserInfo', res.data.data);
          }
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '请检查邮箱格式是否正确失败',
          });
        });
      }
    },
  },
};
</script>

<style scoped>
  .input {
    max-width: 300px;
  }
</style>
