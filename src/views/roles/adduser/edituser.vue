<template>
  <div class="edituser">
    <div class="admin" style="margin-bottom: 20px">编辑用户</div>
    <el-form
      ref="ruleForm2"
      :model="ruleForm2"
      status-icon
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="账号" prop="account">
        <el-input v-model="ruleForm2.account" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="ruleForm2.phone"
          :maxlength="11"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm2.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="ruleForm2.username"
          :maxlength="5"
          placeholder="2-5个文字"
        />
      </el-form-item>
      <!-- <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm2.password"></el-input>
      </el-form-item> -->
      <el-form-item label="部门选择">
        <el-cascader
          v-model="ruleForm2.departmentid"
          :props="treeprops"
          :options="data"
          :show-all-levels="false"
          style="width: 600px"
          placeholder="请选择部门"
          auto-complete="off"
          change-on-select
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit_edituser(ruleForm2)">
          保存
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { putUser, getUser } from '@/api/User/index'
  import { roletree } from '@/api/Role/index'

  export default {
    data() {
      return {
        data: [],
        treeprops: {
          value: 'objectId',
          label: 'name',
        },
        ruleForm2: {
          account: '',
          phone: '',
          username: '',
          password: '',
          email: '',
          checkPass: '',
          departmentid: [],
        },
        id: '',
      }
    },
    computed: {},
    mounted() {
      this.editUser()
    },

    methods: {
      async submit_edituser(formName) {
        console.log(formName)
        // 更新用户详情
        const params = {
          username: this.ruleForm2.account,
          nick: this.ruleForm2.username,
          phone: this.ruleForm2.phone,
          email: this.ruleForm2.email,
          emailVerified: true,
        }
        const res = await putUser(this.$route.query.id, params)
        if (res) {
          this.$message({
            message: '更改成功',
            type: 'success',
          })
        } else {
          this.$message({
            type: 'error',
            message: '修改用户失败',
          })
        }
      },

      editUser() {
        // 获取用户详情
        getUser(this.$route.query.id)
          .then((res) => {
            this.ruleForm2.username = res.nick
            this.ruleForm2.phone = res.phone
            this.ruleForm2.account = res.username
            this.ruleForm2.email = res.email
            this.getDepartment()
          })
          .catch((err) => {
            this.$message({
              type: 'error',
              message: '用户详情获取失败',
            })
            console.log(err)
          })
      },
      getDepartment() {
        roletree()
          .then((res) => {
            const results = res.results
            results.forEach((element) => {
              console.log(element)
            })
            this.data = res.results
          })
          .catch((err) => {
            this.$message('部门列表获取失败')
            this.data = []
            console.log(err)
          })
      },
    },
  }
</script>
<style scoped>
  .edituser {
    width: 100%;
    min-height: 875px;
    padding: 20px;
    box-sizing: border-box;
    background: #ffffff;
  }
  .admin {
    font-size: 24px;
    margin: 20px 0 10px 20px;
  }
  .admin .des {
    padding-left: 5px;
    font-size: 15px;
    color: #777;
  }
  .goodslist {
    margin-left: 20px;
    margin-bottom: 10px;
  }
  .el-input {
    width: 600px;
  }
  .el-form {
    margin-left: 20px;
  }
</style>
