<!-- eslint-disable-next-line -->

<template>
  <div class="structure">
    <div class="adduserDiadlog">
      <el-dialog :visible.sync="adduserDiadlog" title="新增用户" width="600px">
        <div>
          <el-form
            ref="userInfoFormRef"
            :model="userInfoForm"
            :rules="userFormRules"
            status-icon
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="姓名" prop="nick">
              <el-input
                v-model="userInfoForm.nick"
                placeholder="2-7个文字"
                auto-complete="off"
              />
            </el-form-item>

            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="userInfoForm.phone"
                :maxlength="11"
                placeholder="请输入手机号"
                auto-complete="off"
              />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="userInfoForm.email"
                placeholder="请输入邮箱"
                auto-complete="off"
              />
            </el-form-item>
            <el-form-item label="账号" prop="account">
              <el-input
                v-model="userInfoForm.account"
                placeholder="请输入账号"
                auto-complete="off"
              />
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input
                v-model="userInfoForm.password"
                type="password"
                auto-complete="off"
                placeholder="请输入6-10位数字字母组合"
              />
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input
                v-model="userInfoForm.checkPass"
                type="password"
                auto-complete="off"
                placeholder="请再次输入密码"
              />
            </el-form-item>
            <el-form-item label="部门选择" prop="departmentid">
              <el-select
                v-model="userInfoForm.departmentid"
                placeholder="请选择部门"
              >
                <el-option
                  v-for="item in deptOption"
                  :key="item.objectId"
                  :value="item.objectId"
                  :label="item.name + ':' + item.desc"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer">
          <el-button @click="adduserDiadlog = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <!--表格渲染-->
        <div class="tabContent">
          <el-row :gutter="24">
            <el-col :span="7">
              <div class="elTree">
                <div v-show="false" class="setting">
                  <el-input
                    v-model="query.value"
                    :placeholder="$translateTitle('user.name')"
                    clearable
                    style="width: 200px"
                    class="filter-item"
                    size="small"
                  />
                  <el-button
                    class="filter-item"
                    type="primary"
                    icon="el-icon-search"
                    size="small"
                    :disabled="query.value == ''"
                    @click="userFordepartment(0)"
                  >
                    {{ $translateTitle('developer.search') }}
                  </el-button>
                  <!--               <el-button
                    class="filter-item"
                    type="primary"
                    icon="el-icon-circle-plus"
                    @click="adduser"
                    size="small"
                    >{{  $translateTitle("user.newusers") }}</el-button
                  >-->
                  <el-button
                    class="filter-item"
                    type="primary"
                    size="small"
                    @click="userFordepartment()"
                  >
                    所有用户
                  </el-button>
                </div>
                <!-- <el-tree
              :data="treeData"
              :props="elTreedefaultProps"
              @node-click="handleNodeClick"
                ></el-tree>-->
                <div class="leftTree">
                  <el-tree
                    :data="deptTreeData"
                    :props="elTreedefaultProps"
                    :expand-on-click-node="false"
                    node-key="id"
                    default-expand-all
                  >
                    <!-- eslint-disable-next-line -->
                    <span slot-scope="{ node, data }" class="custom-tree-node">
                      <span
                        :class="{ selected: data.objectId == curDepartmentId }"
                        @click="handleNodeClick(data)"
                      >
                        {{ node.label }}
                      </span>
                      <span>
                        <!-- <el-button
                          type="text"
                          size="mini"
                          @click="() => appendChildTree(data)"
                          title="添加子节点"
                        >
                          <i class="el-icon-plus"></i>
                        </el-button>-->
                        <i
                          class="el-icon-circle-plus-outline"
                          title="添加用户"
                          @click="addItemUser(data)"
                        />
                      </span>
                    </span>
                  </el-tree>
                </div>
              </div>
            </el-col>
            <el-col :span="17">
              <div class="elTable">
                <el-table
                  v-loading="pictLoading"
                  :data="tableFilterData"
                  style="width: 90%; margin-top: 20px"
                >
                  <el-table-column label="用户名">
                    <template slot-scope="scope">
                      <div>{{ scope.row.username }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="电话">
                    <template slot-scope="scope">
                      <div>{{ scope.row.phone }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column :show-overflow-tooltip="true" label="邮箱">
                    <template slot-scope="scope">
                      <div>{{ scope.row.email }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="部门">
                    <template slot-scope="scope">
                      <div>
                        {{ scope.row.departmentname || departmentname }}
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column
                    :show-overflow-tooltip="true"
                    label="创建时间"
                  >
                    <template slot-scope="scope">
                      <span>
                        {{ new Date(scope.row.createdAt).toLocaleDateString() }}
                      </span>
                    </template>
                  </el-table-column>

                  <el-table-column
                    :label="$translateTitle('developer.operation')"
                    align="center"
                    width="400"
                  >
                    <template slot-scope="scope">
                      <el-button
                        type="success"
                        size="small"
                        @click="handleEditor(scope.row)"
                      >
                        {{ $translateTitle('developer.edit') }}
                      </el-button>
                      <el-button
                        type="danger"
                        size="small"
                        :disabled="!curDepartmentId"
                        @click="handleDetele(scope.row)"
                      >
                        {{ $translateTitle('developer.delete') }}
                      </el-button>
                      <!-- <el-button
                        size="mini"
                        type="primary"
                        @click="editorrole(scope.row.objectId)"
                      >{{  $translateTitle("user.assignroles") }}</el-button
                      > -->
                    </template>
                  </el-table-column>
                </el-table>
                <!--分页组件-->
                <el-pagination
                  :total="total"
                  :page-sizes="[1, 5, 10]"
                  :page-size="pagesize"
                  style="margin-top: 8px"
                  layout="total, prev, pager, next, sizes"
                  class="total_pagination"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                />
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <!--分配角色-->
      <el-dialog
        :title="$translateTitle('user.assignroles')"
        :visible.sync="roleacl"
        :close-on-click-modal="false"
      >
        <el-table
          ref="multipleTable"
          :data="rolelist"
          height="500px"
          size="mini"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column :label="$translateTitle('user.name')" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.alias }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$translateTitle('developer.describe')"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.desc }}</span>
            </template>
          </el-table-column>
          <el-table-column label="ID" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.objectId }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="roleacl = false">
            {{ $translateTitle('developer.cancel') }}
          </el-button>
          <el-button type="primary" @click="adduseracl">
            {{ $translateTitle('developer.determine') }}
          </el-button>
        </div>
      </el-dialog>
    </el-row>
  </div>
</template>
<script>
  import { Promise } from 'q'
  import { Roletree } from '@/api/Menu/index'
  import {
    postUser,
    delUser,
    queryUser,
    EmployeesHired,
    EmployeeTurnover,
  } from '@/api/User/index'
  import { queryRoledepartment } from '@/api/Role/index'
  var arr = []
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          // if (!/^\w{6,10}$/.test(value)) {
          //   // if (!/^([\w]|[.]){6,10}$/.test(value)) {
          //   callback(new Error("密码格式不正确"));
          // }
          callback()
        }
      }
      var validatecheckPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.userInfoForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        departmentObj: [],
        departmentname: '',
        curDepartmentId: '',
        deptTreeData: [],
        deptOption: [],
        departmentidFlag: 'false',
        height: document.documentElement.clientHeight - 180 + 'px;',
        delLoading: false,
        sup_this: this,
        loading: false,
        deptName: '',
        depts: [],
        deptId: null,
        structure: [],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
        data: [],
        elTreedefaultProps: {
          children: 'children',
          label: 'name',
        },
        dataforuser: [],
        total: 0,
        query: {
          value: '',
          type: '',
          enabled: '',
        },
        tableData: [],
        pagesize: 10,
        start: 0,
        departmentid: [],
        userlist: [],
        rolelist: [],
        objectId: '',
        roleacl: false,
        multipleSelection: [],
        userrolelist: [],
        tempData: [],
        roleData: [],
        adduserDiadlog: false,
        userInfoForm: {
          account: '',
          phone: '',
          nick: '',
          password: '',
          email: '',
          checkPass: '',
          departmentid: [],
        },
        userFormRules: {
          account: [
            { required: true, message: '请输入账号名', trigger: 'blur' },
          ],
          phone: [
            { required: false, message: '请输入手机号', trigger: 'blur' },
            {
              validator: function (rule, value, callback) {
                var MobileRegex = /^1[34578]\d{9}$/
                if (value) {
                  if (!MobileRegex.test(value)) {
                    callback(new Error('手机号码格式不正确！'))
                  } else {
                    callback()
                  }
                } else {
                  callback()
                }
              },
              trigger: 'blur',
            },
          ],
          password: [
            { validator: validatePass, trigger: 'blur', required: true },
          ],
          checkPass: [
            { validator: validatecheckPass, trigger: 'blur', required: true },
          ],
          departmentid: [
            { required: true, message: '请选择部门', trigger: 'blur' },
          ],
          nick: [
            { required: true, message: '请输入昵称', trigger: 'blur' },
            { min: 2, max: 7, message: '昵称格式不正确', trigger: 'blur' },
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change'],
            },
          ],
        },
        treeprops: {
          value: 'objectId',
          label: 'name',
        },
        pictLoading: false,
      }
    },
    computed: {
      tableFilterData() {
        return this.tempData
      },
    },
    mounted() {
      this.userFordepartment()
      this.searchAllOption()
    },
    methods: {
      // addItemUser
      addItemUser(item) {
        this.deptOption = []
        this.departmentObj = item
        console.log(item)
        this.deptOption.push(item)
        this.adduserDiadlog = true
        this.userInfoForm.departmentid = item.objectId
      },
      // 添加用户
      addUser() {
        this.$refs['userInfoFormRef'].validate(async (valid) => {
          if (!valid) {
            this.$message({
              message: '用户信息不完整',
              type: 'danger',
            })
            return false
          }

          // if (this.userInfoForm.departmentid) {
          //   var departmentStr = this.userInfoForm.departmentid[
          //     this.userInfoForm.departmentid.length - 1
          //   ];
          // } else {
          //   var departmentStr = "";
          // }
          const params = {
            username: this.userInfoForm.account,
            nick: this.userInfoForm.nick,
            password: this.userInfoForm.password,
            phone: this.userInfoForm.phone,
            email: this.userInfoForm.email,
            department: this.userInfoForm.departmentid,
            emailVerified: true,
            // aclId:this.aclId
          }
          const res = await EmployeesHired(params)
          if (res) {
            this.$message({
              message: '用户添加成功！',
              type: 'success',
            })
            this.adduserDiadlog = false
            this.handleNodeClick(this.departmentObj)
          } else {
            this.$message('添加失败')
          }
        })
      },
      async editorrole(id) {
        const params = {
          order: 'createdAt',
          where: {
            users: {
              className: '_User',
              __type: 'Pointer',
            },
          },
        }
        this.rolelist = []
        this.userrolelist = []
        this.objectId = id
        const { results } = await this.$query_object('_User', {
          limit: 1,
          where: {
            objectId: this.objectId,
          },
        })
        if (results.length) {
          params.where.users.objectId = results[0].objectId
        }
        const req = await this.$query_object('_Role', params)
        const result = req.results
        this.rolelist = result
        console.log('result', req.results)
        if (result.length) {
          result.map((roleitem, index) => {
            console.log(
              roleitem.objectId,
              roleitem,
              this.objectId == roleitem.objectId
            )
            if (this.objectId == roleitem.objectId) {
              this.$refs.multipleTable.toggleRowSelection(
                this.rolelist[index],
                true
              )
              this.userrolelist.push(roleitem.objectId)
            }
          })
          console.log(this.userrolelist)
          this.roleacl = true
        }
      },
      seleItem(arr1, arr2, arr3) {
        console.log('arr1, arr2, arr3', arr1, arr2, arr3)
        arr1.map((items) => {
          if (!arr2.includes(items)) {
            arr3.push(items)
          }
        })
        arr2.map((disitem) => {
          if (!arr1.includes(disitem)) {
            arr3.push(disitem)
          }
        })
        this.userRolereset(arr3)
      },

      userRolereset(disroles) {
        Promise.all([
          disroles.map((nowitems) => {
            console.log(nowitems)
            this.testroles(nowitems)
          }),
        ]).then((data) => {
          if (data.length != 0) {
            this.$message({
              type: 'success',
              message: '分配成功',
            })
            this.roleacl = false
          }
        })
      },
      testroles(id) {
        console.log(id)
        // var Roles = Parse.Object.extend("_Role");
        // var roles = new Roles();
        // var User = Parse.Object.extend("_User");
        // var userrelation = new User();
        //
        // roles.id = id;
        // if (this.multipleSelection.includes(id)) {
        //   var relation = roles.relation("users");
        //   userrelation.set("objectId", this.objectId);
        //   relation.add(userrelation);
        //   roles.save().then(resultes => {});
        // } else {
        //   var relation = roles.relation("users");
        //   userrelation.set("objectId", this.objectId);
        //   relation.remove(userrelation);
        //   roles.save().then(resultes => {});
        // }
      },
      adduseracl() {
        this.seleItem(this.userrolelist, this.multipleSelection, [])
        // this.userRolereset(this.userrolelist, this.multipleSelection);
        // var roles = Parse.Object.extend("_Role");
        // var query = new Parse.Query(roles);
        // var User = Parse.Object.extend("_User");
        // var user = new Parse.Query(User);
        // var userrelation = new User()
        // user.get(this.objectId).then(object => {
        //   this.multipleSelection.map(items => {
        //     query.get(items).then(resultes => {
        //       var relation = resultes.relation("users");
        //       if (!this.userrolelist.includes(items)) {
        //         userrelation.set("objectId", this.objectId);
        //         relation.add(userrelation);
        //       }
        //       this.userrolelist.map(items => {
        //         if (!this.multipleSelection.includes(items)) {
        //           userrelation.set("objectId", this.objectId);
        //           relation.remove(userrelation);
        //         }
        //       });
        //       resultes.save().then(resulte => {
        //         this.$message({
        //           type: "success",
        //           message: "成功!"
        //         });
        //         this.roleacl = false;
        //       });
        //     });
        //   });
        // });
      },
      handleSelectionChange(val) {
        this.multipleSelection = []

        val.map((items) => {
          this.multipleSelection.push(items.id)
        })
      },
      // 编辑
      handleEditor(row) {
        console.log(row)
        this.$router.push({
          path: '/roles/edituser',
          query: {
            id: row.objectId,
          },
        })
      },
      // 删除
      handleDetele(row) {
        this.$confirm('此操作将永久删除此用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async () => {
          // const data = {
          //   department: this.curDepartmentId,
          //   username: row.username,
          // }
          const params = {
            department: this.curDepartmentId,
            username: row.username,
          }
          const res = await EmployeeTurnover(params)
          if (res) {
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            this.handleNodeClick({ name: this.departmentname })
          }
        })
      },
      handleSizeChange(val) {
        this.pagesize = val
        this.userFordepartment()
      },
      handleCurrentChange(val) {
        this.start = Number(val - 1) * Number(this.pagesize)
        this.userFordepartment()
      },
      // 初始化用户
      async userFordepartment(start) {
        return false
        this.pictLoading = true
        this.tempData = []
        if (start == 0) {
          this.start = 0
        } else {
          this.query.value = ''
        }
        let params = {
          limit: this.pagesize,
          skip: this.start,
          where: {},
          count: 'objectId',
        }
        const { results } = await queryUser(params)
        if (results) {
          if (this.query.value) {
            this.tempData = results.filter((item) => {
              return item.username.indexOf(this.query.value) != -1
            })
          } else {
            this.tempData = results
          }
          this.pictLoading = false
        } else {
          this.pictLoading = false
        }
        this.total = this.tempData.length
      },
      // adduser() {
      //   this.adduserDiadlog = true
      //   // this.$router.push({
      //   //   path: "/roles/adduser"
      //   // });
      // },
      async handleNodeClick(data) {
        this.departmentname = data.name
        this.curDepartmentId = data.objectId
        this.tempData = []
        this.pictLoading = true
        const params = {
          name: data.name,
        }
        const { users } = await queryRoledepartment(params)
        if (users) {
          this.tempData = users.filter((item) => {
            return item.username.indexOf('user_for_') == -1
          })
          this.pictLoading = false
          this.total = this.tempData.length
        } else {
          this.pictLoading = false
          this.total = 0
        }
      },
      // 查询部门
      async searchAllOption() {
        const { results = [] } = await Roletree()
        if (results) {
          this.deptTreeData = results
          // this.handleNodeClick(this.deptTreeData[0])
          this.userFordepartment()
        } else {
          this.$message('部门列表获取失败')
          this.deptTreeData = []
          console.log(err)
        }
      },
    },
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .elTable ::v-deep .el-table th > .cell,
  .elTable ::v-deep .el-table--enable-row-transition .el-table__body td {
    text-align: center;
  }

  .structure {
    box-sizing: border-box;
    width: 100%;
    background: #ffffff;

    .tabContent {
      .elTree {
        float: left;
        margin-top: 30px;
        margin-left: 20px;
      }
      .leftTree {
        height: calc(100vh - #{$base-top-bar-height}* 4 - 25px);
        overflow-x: hidden;
        overflow-y: scroll;
      }

      .elTable {
        .total_pagination {
          width: 90%;
          margin-top: 20px;
          text-align: center;
        }
      }
    }
  }
</style>
<style>
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: #cccccc;
  }

  .structure .el-switch__label--left {
    color: #ff4949 !important;
  }

  .structure .el-switch__label--right {
    color: rgb(19, 206, 102) !important;
  }
  .custom-tree-node .el-icon-circle-plus-outline:hover {
    color: #409eff;
  }
</style>
