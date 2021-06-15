<template>
  <div>
    <el-button type="text" @click="newProjectVisible = true">点击打开 Dialog</el-button>
    <el-dialog title="创建新的实验项目" :visible.sync="newProjectVisible" width="510px">
      <el-form :model="newProject" :rules="rules" ref="newProject" label-width="110px" class="demo-ruleForm"
               style="margin: 0 5%">
        <el-form-item label="所属课程名称" prop="project_course" required>
          <el-input v-model="newProject.project_course" placeholder="例：计算机组成原理" style="width: 295px;"></el-input>
        </el-form-item>
        <el-form-item label="实验项目名称" prop="project_name" required>
          <el-input v-model="newProject.project_name" placeholder="例：路由器实验" style="width: 295px;"></el-input>
        </el-form-item>
        <el-form-item label="发布范围" prop="project_class" required>
          <el-select v-model="newProject.project_class" placeholder="请选择教学班级" style="width: 220px;">
            <el-option v-for="item in newProject.class" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <el-button type="text" @click="newClassVisible = true" style="width: 60px;">新建班级</el-button> <!-- TODO -->
        </el-form-item>
        <el-form-item label="截止时间" required>
          <el-col :span="12">
            <el-form-item prop="date">
              <el-date-picker value-format="yyyy-MM-dd" v-model="newProject.date" placeholder="选择日期"
                              style="width: 140px;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-time-select readonly v-model="time" style="width: 140px;"></el-time-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="实验项目文档" required>
          <el-upload class="upload-demo"
                     ref="projectUpload"
                     action="http://localhost:8081/demo_war/addProject"
                     :before-upload="beforeUpload"
                     :data="newProject"
                     :auto-upload="false"
                     limit="1"
                     accept=".PDF, .doc, .docx, .rar, .zip, .7z">
            <el-button slot="trigger" size="small" type="text">选择文件（仅能上传pdf/doc/docx/rar/zip/7z文件，且不超过10Mb）</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('newProject')">立即发布</el-button>
          <el-button @click="resetForm('newProject')">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 创建新的教学班级 内嵌dialog append-to-body -->
      <el-dialog width="450px" title="创建新的教学班级" :visible.sync="newClassVisible" append-to-body>
        <el-form :model="newClass" :rules="rules" ref="newClass" label-width="110px" class="demo-ruleForm"
                 style="margin: 0 5%">
          <el-form-item label="教学班级名称" prop="class_name" required>
            <el-input v-model="newClass.class_name" placeholder="例：计算机网络信安191" style="width: 250px;"></el-input>
          </el-form-item>
          <el-form-item label="学生学号" prop="class_student_id" required>
            <el-input v-model="newClass.class_student_id" type="textarea" :autosize="{ minRows: 2, maxRows: 200}"
                      maxlength="2200" show-word-limit placeholder="例如：1910100001        通过换行区分每个学号"
                      style="width: 250px;"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('newClass')">提交</el-button>
            <el-button @click="resetForm('newClass')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      newProject: {
        project_course: '',
        project_name: '',
        project_class: '',
        date: '',
        class: [{
          id: '00001',
          name: '计网信安191'
        }, {
          id: '00002',
          name: '双皮奶'
        }, {
          id: '00003',
          name: '蚵仔煎'
        }, {
          id: '00004',
          name: '龙须面'
        }, {
          id: '00005',
          name: '北京烤鸭'
        }],
        token: sessionStorage.getItem('token'),
        file_name: ''
      },
      newClass: {
        class_name: '',
        class_student_id: '',
        token: sessionStorage.getItem('token')
      },
      rules: {
        project_course: [
          {required: true, message: '请输入课程名称', trigger: 'blur'},
          {required: true, message: '请输入课程名称', trigger: 'change'},
          {max: 32, message: '最长为 32 个字符', trigger: 'change'}
        ],
        project_name: [
          {required: true, message: '请输入项目名称', trigger: 'blur'},
          {max: 32, message: '最长为 32 个字符', trigger: 'blur'}
        ],
        project_class: [
          {required: true, message: '请选择教学班级', trigger: 'blur'}
        ],
        date: [
          {required: true, message: '请选择日期', trigger: 'blur'}
        ],
        class_name: [
          {required: true, message: '请输入教学班级名称', trigger: 'blur'},
          {max: 16, message: '最长为 16 个字符', trigger: 'change'}
        ],
        class_student_id: [
          {required: true, message: '请输入学生学号', trigger: 'blur'},
          {max: 2200, message: '最多可输入200个学号', trigger: 'change'}
        ]
      },
      newProjectVisible: false,
      newClassVisible: false,
      time: '23:59:59'
    }
  },
  methods: {
    /*
    change: function () {
      console.log('abc');
      this.newProject.date2 = "23:59:59"    //a1就是响应式的
      console.log('abcd');
    },
    */
    submitForm (formName) { // 俩表单提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === 'newProject') {
            console.log('cc')
            this.$refs.projectUpload.submit()
          } else if (formName === 'newClass') {
            var temp = JSON.parse(JSON.stringify(this.newClass))
            temp.class_name = require('js-base64').toBase64(temp.class_name)
            this.$http.post('http://localhost:8081/demo_war/addClass', {
              newClass: temp
            }).then(res => {
              console.log(res)
              this.updateClassStatus()
              this.newClassVisible = false
            }).catch(err => {
              console.log(err)
            })
          }
        } else {
          console.log('gg')
          return false
        }
      })
    },
    resetForm (formName) { // 重置表单
      this.$refs[formName].resetFields()
    },
    beforeUpload (file) { // 教师实验项目文档选择
      console.log('cd')
      /* 文件验证 */
      const prefix = file.name.lastIndexOf('.')
      const sizelimit = file.size <= 10 * 1024 * 1024
      if (prefix !== -1) {
        var suffix = file.name.substr(prefix + 1).toUpperCase()
        suffix = suffix.toLowerCase()
        if (suffix !== 'pdf' && suffix !== 'doc' && suffix !== 'docx' && suffix !== 'rar' && suffix !== 'zip' && suffix !== '7z') {
          this.$message({
            message: '所支持上传的文件类型仅为 pdf, doc, docx, rar, zip, 7z',
            type: 'warning'
          })
          return false
        }
        if (!sizelimit) {
          this.$message({
            message: '所支持上传的文件大小不得大于10Mb',
            type: 'warning'
          })
          return false
        }
      } else {
        this.$message({
          message: '所支持上传的文件类型仅为 pdf, doc, docx, rar, zip, 7z',
          type: 'warning'
        })
        return false
      }
      /* 文件名字转码 */
      let base64 = require('js-base64').Base64
      this.newProject.project_name = base64.encode(this.newProject.project_name)
      this.newProject.project_course = base64.encode(this.newProject.project_course)
      this.newProject.file_name = base64.encode(file.name)
      console.log(this.newProject.file_name)
      // this.newProject.file_name = file.name.substr(0, prefix)
      console.log(this.newProject.file_name)
      if (this.newProject.file_name === undefined) {
        this.$message({
          message: '请上传实验项目文档文件（仅能上传pdf/doc/docx/rar/zip/7z文件，且不超过10Mb）',
          type: 'warning'
        })
      }
      return true
    },
    updateClassStatus () {
      this.$http.get('http://localhost:8081/demo_war/getClass', {
        params: {
          token: sessionStorage.getItem('token')
        }
      }).then(res => {
        console.log(res)
        this.newProject.class = res.data.results
      })
    }
  },
  created () {
    this.$http.get('http://localhost:8081/demo_war/getClass', {
      params: {
        token: sessionStorage.getItem('token')
      }
    }).then(res => {
      console.log(res)
      this.updateClassStatus()
    })
  }
}
</script>

<style scoped>

</style>
