<template>
  <div>
    <el-container>
      <el-main>
        <template>
          <el-table
            :data="tableData.filter(data => !search || data.proj_name.toLowerCase().includes(search.toLowerCase()) || data.proj_class.toLowerCase().includes(search.toLowerCase()))"
            stripe style="width: auto">
            <el-table-column prop="project_course" label="课程"></el-table-column>
            <el-table-column prop="project_name" label="实验项目"></el-table-column>
            <el-table-column prop="class_name" label="教学班级"></el-table-column>
            <el-table-column prop="project_deadline" label="截止时间" min-width="100px"></el-table-column>
            <el-table-column prop="" label="已提交人数" min-width="70px">
              <template slot-scope="scope">
                {{ scope.row.project_submitted + '/' + scope.row.project_headcount }}
              </template>
            </el-table-column>
            <el-table-column prop="project_id" width="180px">
              <template slot="header" slot-scope="scope">
                <el-input
                  v-model="search"
                  size="small"
                  placeholder="输入关键字搜索"/>
              </template>
              <template slot-scope="scope">
                <el-button size="small" type="primary" icon="el-icon-setting"
                           @click="proj_nameload(scope.row.proj_name)">管理
                </el-button>
                <el-button size="small" type="danger" icon="el-icon-delete" @click="proj_nameload(scope.row.proj_name)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import addDialog from '../components/addProjectDialog'

export default {
  components: {
    addDialog
  },
  name: 'indoor',
  data () {
    return {
      tableData: [{
        project_id: '00001',
        project_course: '计算机网络',
        project_name: '路由器的基本应用实验',
        project_deadline: '2021-06-05',
        class_name: '计网信安191',
        project_submitted: '22',
        project_headcount: '50'
      }],
      search: '',
      upload_data: {
        token: sessionStorage.getItem('token'),
        proj_name: ''
      },
      reporturl: []
    }
  },
  methods: {
    proj_nameload (name) {
      let base64 = require('js-base64').Base64
      this.upload_data.proj_name = base64.encode(name)
      console.log(this.upload_data.proj_name)
    }
  },
  created () {
    this.$http.get('http://localhost:8081/demo_war/getTeacherManager', {
      params: {
        token: sessionStorage.getItem('token')
      }
    }).then(res => {
      // this.tableData.project_id = res.data.project_id
      // this.tableData.project_name = res.data.project_name
      // this.tableData.project_deadline = res.data.project_deadline
      // this.tableData.project_course = res.data.project_course
      // this.tableData.project_submitted = res.data.project_submitted
      // this.tableData.project_headcount = res.data.project_headcount
      // this.tableData.class_name = res.data.class_name
      this.tableData = res.data.results
    })
  }
}
</script>
