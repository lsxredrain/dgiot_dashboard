<template>
  <div class="department">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-table
          :data="roletempList"
          :row-class-name="tableRowClassName"
          :row-style="selectedHighlight"
          size="small"
          border
          highlight-current-row
          @row-click="getDetailmenu"
        >
          <el-table-column label="名称" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.data.name }}</span>
              <span>( {{ scope.row.key }} )</span>
            </template>
          </el-table-column>

          <el-table-column
            :label="$translateTitle('developer.operation')"
            width="180"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click.stop="exportRoletemp(scope.row)"
              >
                更新模版
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click.stop="
                  handleDelete(scope.$index, scope.row, roletempList)
                "
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <el-col :span="8">
        <el-col :span="12">
          <!--权限 -->
          <div class="footerleft">
            <p class="top">
              <span class="svg-container">
                <vab-icon icon="role_group" />
              </span>
              <span>分配权限</span>
            </p>
            <div class="rolecontrol">
              <el-tree
                ref="permissionTree"
                :data="permissionTreeData"
                :default-checked-keys="rolePermissonList"
                :expand-on-click-node="false"
                show-checkbox
                node-key="name"
                accordion
              >
                <span slot-scope="{ node }" class="custom-tree-node">
                  <span>{{ node.label }}</span>
                </span>
              </el-tree>
            </div>
          </div>
        </el-col>

        <el-col :span="12">
          <!--菜单-->
          <div class="footerright">
            <p class="top">
              <span class="svg-container">
                <vab-icon icon="menu_group" />
              </span>
              <span>菜单分配</span>
            </p>
            <div class="menucontrol" style="margin-top: 30px">
              <el-tree
                ref="menusTree"
                :data="menuTreeData"
                :default-checked-keys="roleMenuList"
                :expand-on-click-node="false"
                show-checkbox
                node-key="objectId"
                accordion
              >
                <!-- eslint-disable-next-line -->
                <span slot-scope="{ node, data }" class="custom-tree-node">
                  {{ data.title ? data.title : node.label }}
                </span>
              </el-tree>
            </div>
          </div>
        </el-col>
      </el-col>
      <el-col :span="10">
        <div class="footerleft">
          <p class="top">
            <span class="svg-container">
              <vab-icon icon="role_group" />
            </span>
            <span>标签信息</span>
          </p>
        </div>
        <div class="tags">
          <el-form ref="form" :rules="Rule" :model="form" label-width="120px">
            <!-- <el-form-item label="平台">
                    <el-select v-model="form.product" placeholder="请选择平台"  style="width:80%">
                      <el-option v-for="(item,index) in selectapp" :key="index" :label="item.attributes.subtitle" :value="item.id"></el-option>
                   </el-select>
              </el-form-item>-->
            <el-form-item label="访问密钥">
              <el-input v-model="form.secret" style="width: 80%" readonly>
                <el-button
                  slot="append"
                  icon="el-icon-refresh-right"
                  @click="handleClickRefresh"
                />
              </el-input>
            </el-form-item>
            <el-form-item label="Token有效时间">
              <el-input
                v-model="form.expires"
                type="number"
                style="width: 80%"
                placheholder="请输入应用时间"
              />
              <span style="margin-left: 5px">秒</span>
            </el-form-item>
            <el-form-item label="word预览服务器">
              <el-input
                v-model="form.wordpreview"
                style="width: 80%"
                placheholder="请输入word预览服务器地址"
              />
            </el-form-item>
            <el-form-item label="word生产服务器">
              <el-input
                v-model="form.wordproduct"
                style="width: 80%"
                placheholder="请输入word生产服务器地址"
              />
            </el-form-item>
            <el-form-item label="文件资源" prop="file">
              <el-input
                v-model="form.file"
                style="width: 80%"
                placheholder="请输入url"
              />
            </el-form-item>

            <el-form-item label="组态资源" prop="topo">
              <el-input
                v-model="form.topo"
                style="width: 80%"
                placheholder="请输入url"
              />
            </el-form-item>

            <el-form-item label="Graphql API" prop="graphql">
              <el-input
                v-model="form.graphql"
                style="width: 80%"
                placheholder="请输入url"
              />
            </el-form-item>

            <el-form-item label="Restful API" prop="rest">
              <el-input
                v-model="form.rest"
                style="width: 80%"
                placheholder="请输入url"
              />
            </el-form-item>

            <el-form-item label="home">
              <el-input
                v-model="form.home"
                style="width: 80%"
                placheholder="请输入路径"
              />
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import { queryDict, delDict, putDict } from '@/api/Dict/index'
  import { queryPermission } from '@/api/Permission/index'
  import { queryMenu } from '@/api/Menu/index'

  // const Base64 = require('js-base64').Base64
  export default {
    name: 'Department',
    components: {},
    data() {
      const validatorUrl = (rule, value, callback) => {
        var regStr = /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/
        if (value === '' || value === null) {
          callback(new Error('请输入url地址'))
        } else if (!regStr.test(value)) {
          callback(new Error('请输入正确的url地址'))
        } else {
          callback()
        }
      }
      return {
        Rule: {
          desc: [
            { required: true, message: '请输入应用名称', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                if (value.length === 0) {
                  callback(new Error('应用名称不能为空'))
                } else {
                  callback()
                }
              },
            },
          ],
          file: [{ trigger: 'blur', validator: validatorUrl }],
          topo: [{ trigger: 'blur', validator: validatorUrl }],
          graphql: [{ trigger: 'blur', validator: validatorUrl }],
          rest: [{ trigger: 'blur', validator: validatorUrl }],
        },
        form: {
          file: 'http://127.0.0.1:1250/shapes/upload',
          rest: 'http://127.0.0.1:5080/iotapi',
          topo: 'http://127.0.0.1:1350/',
          expires: 18000,
          wordpreview: 'http://pump.iotn2n.com:8012',
          wordproduct: 'http://pump.iotn2n.com/',
          graphql: 'http://127.0.0.1:5080/graphql',
          secret: 'RTc3MDk4MTgxNjAzMTc1MTUxMDY0',
          home: 'E:/shuwa/4.1.0/shuwa_data_center/datacenter/file/files',
        },
        roletempList: [],
        dataMenus: [],
        roleMenuList: [],
        dataPermissions: [],
        rolePermissonList: [],
      }
    },
    computed: {
      permissionTreeData() {
        return this.dataPermissions.filter((father) => {
          const branchArr = []

          this.dataPermissions.forEach((child) => {
            if (father.objectId == child.parentId) {
              branchArr.push(child)
            }
          })

          /*     let branchArr = this.dataPermissions.filter( (child) => {
            return father.objectId == child.parentId
            }
        ); */

          // 如果存在子级，则给父级添加一个children，并赋值
          if (branchArr.length > 0) {
            father.children = branchArr
          }
          return father.parentId == 0
        })
      },
      menuTreeData() {
        return this.dataMenus.filter((father) => {
          father.title =
            father.meta && father.meta.title ? father.meta.title : ''
          const branchArr = this.dataMenus.filter(
            (child) => father.objectId == child.parentId
          )

          if (branchArr.length > 0) {
            father.children = branchArr
          }
          return father.parentId == 0
        })
      },
    },
    mounted() {
      this.gettable()
      this.getMenu()
      this.getRoleschema()

      /* eventBus.$on("dialogHide", () => {
      this.centerDialogRole = false;
    }); */
    },

    methods: {
      handleClickRefresh() {
        const ranNum = Math.ceil(Math.random() * 25)
        this.form.secret = Base64.encode(
          String.fromCharCode(65 + ranNum) +
            Math.ceil(Math.random() * 10000000) +
            Number(new Date())
        )
      },
      async getMenu() {
        this.data = []
        this.dataMenus = []
        const { results } = await queryMenu({})
        if (results) {
          this.menuListRes = results
          results.map((items) => {
            var obj = {}
            obj.label = items.name
            obj.meta = items.meta
            obj.objectId = items.objectId
            obj.parentId = items.parent.objectId
            obj.createtime = new Date(items.createdAt).toLocaleDateString()
            this.data.push(obj)
            this.dataMenus.push(obj)
          })
        }
      },
      async gettable() {
        const { results } = await queryDict({
          where: {
            type: 'roletemp',
          },
        })
        if (results) this.roletempList = results
      },
      // 获取权限
      async getRoleschema() {
        this.dataPermissions = []
        const { results } = await queryPermission({})
        if (results) {
          this.permissionListRes = results
          results.map((items) => {
            var obj = {}
            obj.label = items.alias
            obj.name = items.name
            obj.objectId = items.objectId
            obj.parentId = items.parent.objectId
            obj.createtime = new Date(items.createdAt).toLocaleDateString()
            this.dataPermissions.push(obj)
          })
        }
      },
      tableRowClassName({ row, rowIndex }) {
        // 把每一行的索引放进row

        row.index = rowIndex
      },
      selectedHighlight({ row, rowIndex }) {
        if (this.currentSelectIndex === rowIndex) {
          return {
            color: '#409EFF',
            'font-weight': 'bold',
          }
        }
      },
      getDetailmenu(row, column, event, cell) {
        if (row.data.tag && row.data.tag.appconfig) {
          this.form = row.data.tag.appconfig
        } else {
          this.handleClickRefresh()
        }
        if (column && column.label == '操作') {
          return
        }
        this.currentSelectIndex = row.index

        this.doSetChecked(row.data.menus, row.data.rules)
      },
      doSetChecked(allMenus, allPermissions) {
        this.roleMenuList = []
        this.rolePermissonList = []

        const tempMenuList = []
        const tempPermissonList = []

        this.menuListRes.map((items) => {
          allMenus.map((mentItem) => {
            if (items.name == mentItem) {
              tempMenuList.push(items.name)
            }
          })
        })

        this.roleMenuList = [...new Set(tempMenuList)]
        // set ###
        this.$refs.menusTree.setCheckedKeys(this.roleMenuList)

        this.permissionListRes.map((items) => {
          allPermissions.map((mentItem) => {
            if (items.name == mentItem) {
              tempPermissonList.push(items.name)
            }
          })
        })

        this.rolePermissonList = [...new Set(tempPermissonList)]

        // set ###
        this.$refs.permissionTree.setCheckedKeys(this.rolePermissonList)
      },
      // 删除模板
      async handleDelete(index, row, data) {
        const res = await delDict(row.objectId)
        if (res) {
          this.$message({
            type: 'success',
            message: '删除成功',
          }),
            data.splice(index, 1)
        } else {
          this.$message({
            type: 'error',
            message: '删除失败',
          })
        }
      },
      // 保存模板
      exportRoletemp(row) {
        this.$confirm('确定要更新吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(async () => {
            const checkrole = []
            const checkmenu = []
            const selectMenu = this.$refs.menusTree.getCheckedNodes()
            const selectRermission = this.$refs.permissionTree.getCheckedNodes()

            if (
              selectMenu &&
              selectRermission &&
              selectMenu.length > 0 &&
              selectRermission.length > 0
            ) {
              selectMenu.forEach((item) => {
                checkmenu.push(item.label)
              })
              selectRermission.forEach((item) => {
                checkrole.push(item.name)
              })
            } else {
              this.$message({ mesaage: '数据为空' })
              return
            }

            var newData = row.data
            if (!row.data.tag) {
              newData.tag = {}
            }
            newData['tag'].appconfig = this.form
            newData.menus = checkmenu
            newData.rules = checkrole

            const loading = this.$loading({
              background: 'rgba(0, 0, 0, 0.5)',
            })
            const res = await putDict(row.objectId, {
              data: newData,
            })
            if (res) {
              loading.close()
              if (res) {
                this.$message({ message: '更新成功' })
              }
            } else {
              loading.close()
              this.$message({ message: '更新失败' })
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },
    },
  }
</script>
<style scoped lang="scss">
  .department {
    width: 90%;
    margin: auto;
    margin-top: 20px;
  }
</style>
<style lang="scss">
  .roles .search .el-input {
    width: 200px;
  }

  .leftTree {
    span.selected {
      font-weight: bold;
      color: #409eff;
    }
    .el-tree-node {
      margin-top: 5px;
    }

    .custom-tree-node .el-icon-circle-plus-outline:hover {
      color: #409eff;
    }
  }
</style>
