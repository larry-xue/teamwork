<template>
  <div class="main">
    <div class="wrapper">
      <div class="head-name">Team Work</div>
      <div class="input-body">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <div class="input-type">
            注册
          </div>
          <el-form-item prop="username" class="input">
            <el-input
              v-model="ruleForm.username"
              prefix-icon="el-icon-user"
              placeholder="username"
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
          <el-form-item prop="rePassword" class="input">
            <el-input
              v-model="ruleForm.rePassword"
              prefix-icon="el-icon-lock"
              show-password placeholder="confirm password"
            >
            </el-input>
          </el-form-item>
          <el-form-item class="input" prop="email">
            <el-input
              v-model="ruleForm.email"
              prefix-icon="el-icon-s-promotion"
              placeholder="email"
            >
              <el-select v-model="ruleForm.select" style="width: 130px" slot="append">
                <el-option value="@qq.com"></el-option>
                <el-option value="@163.com"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item >
            <el-button
              class="input"
              type="info"
              size="medium"
              :loading="loading"
              @click="submitForm('ruleForm')"
            >
              注册
            </el-button>
          </el-form-item>
          <el-divider content-position="center">
            已有账号？立即登录
          </el-divider>
          <div class="otherMethod">
            <div>
              <el-link
                href="/#/user/login"
                type="success"
                icon="el-icon-s-promotion"
              >
                点此登录
              </el-link>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import md5 from 'js-md5';

export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('两次密码不相同'));
      } else if (value.length < 5) {
        callback(new Error('密码长度应大于 6 位'));
      } else if (value.length > 14) {
        callback(new Error('密码长度应小于 15 位'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        username: '',
        password: '',
        email: '',
        select: '@qq.com',
        rePassword: '',
      },
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
            validator: validatePass,
            trigger: 'blur',
          },
        ],
        rePassword: [
          {
            validator: validatePass2,
            trigger: 'blur',
          },
        ],
        email: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'change',
          },
        ],
      },
      loading: false,
    };
  },
  computed: {
    ...mapState({
      loginMethod: (state) => state.loginMethod,
    }),
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        let val = true;
        if (valid) {
          console.log(this.ruleForm);
          this.$http.post('/v1/users', {
            username: this.ruleForm.username,
            email: this.ruleForm.email + this.ruleForm.select,
            password: md5(this.ruleForm.password),
          }).then((res) => {
            if (res.data.code === 1101) {
              this.$message({
                type: 'warning',
                message: '用户名重复！',
              });
            } else {
              // 发送注册成功信息
              // 跳转到团队页面
              console.log(res.data.code);
              this.$message({
                message: '注册成功！页面跳转中~',
                type: 'success',
              });
              setTimeout(() => {
                window.location.href = '/#/user/login';
              }, 1500);
            }
          }).catch((err) => {
            console.log(err);
          });
        } else {
          this.$message({
            message: '注册信息未填写完成！',
            type: 'warning',
          });
          val = false;
        }
        return val;
      });
    },
  },
};
</script>

<style scoped>
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
    margin-top: 10px;
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

  .otherMethod {
    display: flex;
    justify-content: space-around;
  }
</style>
