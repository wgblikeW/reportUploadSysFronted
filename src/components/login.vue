<template>
  <div class="login-container">
    <el-form ref="form" :model="form" label-width="80px" class="login-form" :rules="rules" status-icon>
      <h2 class="login-title">实验报告上传系统</h2>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
      </el-form-item>
      <el-switch
        v-model="value"
        active-color="#2F4F4F"
        inactive-color="#4169E1"
        active-text="教师登录"
        inactive-text="学生登录">
      </el-switch>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      value: true,
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
        password: [{required: true, message: '密码不能为空', trigger: 'blur'}]
      }
    }
  },
  methods: {
    submitForm (formName) {
      let base64 = require('js-base64').Base64
      let sha256 = require('js-sha256')
      const base64username = base64.toBase64(this.form.username)
      const base64password = base64.toBase64(sha256.sha256(this.form.password))
      var isTeacher = this.value ? 'teacher' : 'student'
      console.log(isTeacher)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.get('http://localhost:8081/demo_war/login',
            {
              params: {
                username: base64username,
                password: base64password,
                withToken: null,
                isTeacher: isTeacher
              }
            }).then(res => {
            console.log(res.data.result)
            if (res.data.result === 'DENIED') {
              alert('登录失败，请检查登录使用的用户名与密码。')
            } else {
              // console.log(res)
              sessionStorage.setItem('token', res.data.token)
              console.log(isTeacher)
              if (isTeacher === 'teacher') {
                this.$router.push('/teacherIndoor').catch(err => {
                  console.log(err)
                })
              } else {
                this.$router.push('/indoor').catch(err => {
                  console.log(err)
                })
              }
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          // console.log('登录失败！')
        }
      })
    }
  }
}
</script>

<style scoped>
.login-form {
  width: 350px;
  margin: 160px auto;
  background-color: rgb(255, 255, 255);
  padding: 30px;
  border-radius: 50px;
}

.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../assets/login_background.jpg") center;

}

.login-title {
  color: deeppink;
  text-align: center;
}
</style>
