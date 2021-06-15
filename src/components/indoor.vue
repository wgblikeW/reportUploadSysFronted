<template>
  <div id="app">
    <el-container style="height: 100%; border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1', '3']">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>导航一</template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>导航二</template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="2-1">选项1</el-menu-item>
              <el-menu-item index="2-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="2-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="2-4">
              <template slot="title">选项4</template>
              <el-menu-item index="2-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-setting"></i>导航三</template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="3-1">选项1</el-menu-item>
              <el-menu-item index="3-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="3-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="3-4">
              <template slot="title">选项4</template>
              <el-menu-item index="3-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="logout">登出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>

        <el-main>
          <template>
            <el-table :data="tableData" stripe style="width: 100%">
              <el-table-column prop="proj_name" label="实验项目名称|点击实验名称下载实验报告(及其附件)" width="auto">
                <template slot-scope="scope2">
                  <a v-bind:href=reporturl[scope2.$index] download>{{ scope2.row.proj_name }}</a>
                </template>
              </el-table-column>
              <el-table-column prop="proj_class" label="实验项目所属课程类别"></el-table-column>
              <el-table-column prop="proj_prof" label="授课教师"></el-table-column>
              <el-table-column prop="proj_ddl" label="截止时间"></el-table-column>
              <el-table-column prop="proj_submit" label="提交情况">
                <template slot-scope="scope3">
                  <i class="el-icon-check" v-if="scope3.row.proj_submit == 'submit'"
                     style="font-size:30px"></i>
                  <i class="el-icon-circle-close" v-if="scope3.row.proj_submit == 'no-submit'"
                     style="font-size: 30px"></i>
                </template>
              </el-table-column>
              <el-table-column prop="proj_click" label="操作">
                <template slot-scope="scope">
                  <el-upload
                    class="upload-demo"
                    action="http://localhost:8081/demo_war/fileupload"
                    :before-upload="beforeUpload"
                    :data="upload_data"
                    accept=".PDF"
                    multiple
                    :limit="3">
                    <el-button size="small" type="primary" :disabled="scope.row.status ==-1"
                               @click="proj_nameload(scope.row.proj_name)">点击上传实验报告
                    </el-button>
                    <div slot="tip" class="el-upload__tip">只能上传pdf文件，且不超过10Mb</div>
                  </el-upload>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'indoor',
  data () {
    return {
      tableData: [],
      upload_data: {
        token: sessionStorage.getItem('token'),
        proj_name: ''
      },
      reporturl: []
    }
  },
  methods: {
    logout () {
      sessionStorage.removeItem('token')
      alert('已成功登出')
      this.$router.push('/login').catch(err => {
        console.log(err)
      })
    },
    proj_nameload (name) {
      let base64 = require('js-base64').Base64
      this.upload_data.proj_name = base64.encode(name)
      // console.log(this.upload_data.proj_name)
    },
    beforeUpload (file) {
      const isPDF = file.type === 'application/pdf'
      const SizeLimit = file.size <= 10 * 1024 * 1024
      if (!isPDF) {
        this.$message({
          message: '所支持上传的文件类型仅为pdf',
          type: 'warning'
        })
      }
      if (!SizeLimit) {
        this.$message({
          message: '所支持上传的文件大小不得大于10Mb',
          type: 'warning'
        })
      }
      return isPDF && SizeLimit
    }
  },
  created () {
    // TODO: 端口号在部署的时候需要更改
    this.$http.get('http://localhost:8081/demo_war/getreport?token=' + sessionStorage.getItem('token')).then(res => {
      console.log(res)
      this.tableData = res.data.results
      this.reporturl = res.data.urlsets
      // if (this.tableData.proj_ddl > new Date()) {
      //
      // }
      // console.log(this.reporturl)
    })
  }
}
</script>

<style>
#app {
  /*  font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;*/
}
</style>
