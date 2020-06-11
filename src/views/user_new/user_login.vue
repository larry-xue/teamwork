// login page

<template>
  <div class="main">
    <div class="wrapper">
      <div class="head-name">
        Team work
      </div>
      <div class="input-body">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <div class="input-type">
            登录
          </div>
          <el-form-item prop="username" class="input">
            <el-input
              v-model="ruleForm.username"
              prefix-icon="el-icon-user"
              placeholder="username or email"
            >
            </el-input>
          </el-form-item>

          <el-form-item prop="password" class="input">
            <el-input
              v-model="ruleForm.password"
              prefix-icon="el-icon-lock"
              show-password placeholder="password"
            >
            </el-input>
          </el-form-item>
          <div class="more-option">
            <el-checkbox v-model="loginNextTime">记住密码</el-checkbox>
            <el-link href="#" type="primary">忘记密码?</el-link>
          </div>
          <el-form-item >
            <el-button
              class="input"
              @click="submitForm('ruleForm')"
              type="info"
              size="medium"
              :loading="loading"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
        <el-divider content-position="center">
        </el-divider>
        <div class="registor">
          <el-link href="/user/register" @click="gotoRegister">
            没有账号？立即注册
          </el-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import md5 from 'js-md5';
import Storage from '../../storage/storage';
import init from '../../init/init';

export default {
  mounted() {
    console.log('test');
  },
  watch: {
    loginMethod(newVal, oldVal) {
      this.otherMethod = oldVal;
    },
  },
  data() {
    return {
      ruleForm: {
        username: '',
        password: '',
      },
      loading: false,
      loginNextTime: false,
      otherMethod: 'email',
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'change',
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符之间',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '密码错误',
            trigger: 'blur',
          },
        ],
      },
    };
  },
  computed: {
    ...mapState({
      loginMethod: (state) => state.loginMethod,
    }),
  },
  methods: {
    gotoRegister() {
      console.log('fff');
      this.$router.push({
        name: 'register',
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        let val = true;
        if (valid) {
          this.$http.get('/v1/users/token', {
            auth: {
              username: this.ruleForm.username,
              password: md5(this.ruleForm.password),
            },
          }).then((res) => {
            console.log(res);
            let meg = '';
            if (res.data.code === 1002) {
              meg = '用户不存在！';
            } else if (res.data.code === 1003) {
              meg = '密码错误！';
            } else {
              // status 200
              // 存token
              Storage.localSet('token', res.data.data.access_token);
              Storage.localSet('username', this.ruleForm.username);
              // init
              init();
              if (this.loginNextTime) {
                Storage.localSet('refresh_token', res.data.data.refresh_token);
              }
            }
            if (meg !== '') {
              this.$message({
                type: 'warning',
                message: meg,
              });
            }
          }).catch((err) => {
            console.log(err);
          });
        } else {
          this.$message({
            message: '登录信息未填写完成！',
            type: 'warning',
          });
          val = false;
        }
        return val;
      });
    },
    changeLoginMethod(login) {
      this.$store.commit({
        type: 'changeLoginMethod',
        log: login,
      });
    },
  },
};
</script>

<style scropd>
  .main {
    font-family: -apple-system,Helvetica Neue,Helvetica,
                  PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,Segoe UI,Roboto,sans-serif;
    color: #000;
    min-width: 1000px;
    margin: 0 auto;
  }

  .wrapper {
    width: 900px;
    margin: 0 auto;
    margin-top: 100px;
    padding: 20px;
  }

  .wrapper .head-name {
    text-align: center;
    padding: 20px;
    font-size: 60px;
  }

  .wrapper .input-body {
    width: 440px;
    margin: 0 auto;
    border: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    text-align: center;
    padding: 20px;
    background-color: #fff;
  }

  .input-body .input-type {
    font-size: 30px;
  }

  .more-option {
    margin-top: 30px;
    display: flex;
    justify-content: space-around;
  }

  .email-login {
    padding-bottom: 20px;
  }

  .input-body .input {
    margin: 0 auto;
    margin-top: 20px;
    width: 300px;
  }
</style>
