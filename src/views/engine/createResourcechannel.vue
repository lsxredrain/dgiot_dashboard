<template>
  <div class="createResourcechannel">
    <el-form
      ref="addchannel"
      :rules="addrules"
      label-width="auto"
      :model="addchannel"
      size="mini"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item
            :label="$translateTitle('developer.channelname')"
            prop="name"
          >
            <el-input
              v-model="addchannel.name"
              style="float: left"
              :placeholder="$translateTitle('developer.channelname')"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属应用" prop="applicationtText">
            <el-input
              v-model="addchannel.applicationtText"
              readonly
              @focus="showTree = !showTree"
            />
            <div v-if="showTree" class="device-tree">
              <el-tree
                default-expand-all
                :data="allApps"
                :props="defaultProps"
                @node-click="handleNodeClick"
              />
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="通道类型" prop="region">
            <el-select
              v-model="addchannel.region"
              style="display: block"
              placeholder="通道类型"
              @change="removeauto"
            >
              <el-option
                v-for="(item, index) in channelregion"
                :key="index"
                style="display: block"
                :label="item.title.zh"
                :value="item.cType"
              />
            </el-select>
          </el-form-item>
          <el-row
            :gutter="24"
            style="
              width: 100%;
              max-height: 500px;
              margin: 0;
              overflow-x: hidden;
              overflow-y: scroll;
              line-height: 30px;
              text-align: center;
            "
          >
            <el-col
              v-for="(item, index) in channelregion"
              :key="index"
              :span="4"
              style="padding: 0; margin: 20px; cursor: pointer"
            >
              <el-card
                :shadow="addchannel.region == item.cType ? 'always' : 'hover'"
                :style="{
                  color:
                    addchannel.region == item.cType ? '#00bad0' : '#c0c4cc',
                }"
                size="mini"
                class="box-card"
              >
                <div slot="header" class="clearfix">
                  <el-button
                    :disabled="resourceid != ''"
                    :type="
                      addchannel.region == item.cType ? 'success' : 'primary'
                    "
                    size="mini"
                    style="text-align: center"
                    @click="setCard(item.cType)"
                  >
                    {{ addchannel.region == item.cType ? '已选' : '选择' }}
                  </el-button>
                  <p>{{ item.title.zh }}</p>
                </div>
                <div class="text item">
                  <el-row :gutter="24">
                    <el-col :span="12">
                      <img
                        :src="
                          item.params.ico.default
                            ? item.params.ico.default
                            : 'http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/logo/logo.png'
                        "
                        class="image"
                        style="width: 50px; height: 50px"
                      />
                    </el-col>
                    <el-col :span="12">
                      <el-tag>{{ item.cType }}</el-tag>
                    </el-col>
                  </el-row>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
        <el-col v-for="(item, index) in arrlist" :key="index" :span="12">
          <el-form-item
            v-show="item.showname != 'ico'"
            :label="item.title.zh"
            :required="item.required"
            :prop="item.showname"
          >
            <el-input
              v-if="item.type == 'string'"
              v-model="addchannel[item.showname]"
            />
            <el-input
              v-else-if="item.type == 'integer'"
              v-model.number="addchannel[item.showname]"
            />
            <el-image
              v-else-if="item.showname == 'ico'"
              style="display: none"
            />
            <el-select
              v-else-if="item.type == 'boolean'"
              v-model="addchannel[item.showname]"
              class="notauto"
              readonly
            >
              <el-option :value="true" label="是" />
              <el-option :value="false" label="否" />
            </el-select>
          </el-form-item>
        </el-col>
        <!---------------------统一的配置描述---------------------------->
        <el-col :span="24">
          <el-form-item :label="$translateTitle('developer.describe')">
            <el-input
              v-model="addchannel.desc"
              :rows="3"
              :placeholder="$translateTitle('developer.describe')"
              autocomplete="off"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">
        {{ $translateTitle('developer.cancel') }}
      </el-button>
      <el-button type="primary" @click="addchannelForm('addchannel')">
        {{ $translateTitle('developer.determine') }}
      </el-button>
    </div>
  </div>
</template>

<script>
  import { Roletree } from '@/api/Menu/index'
  import { resourceTypes } from '@/api/Rules'
  import { postChannel } from '@/api/Channel'
  import { mapActions, mapGetters } from 'vuex'
  import { handleActivePath } from '@/utils/routes'
  export default {
    name: 'CreateResourcechannel',
    components: {},
    data() {
      return {
        channelregion: [],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        resourceid: '',
        showTree: false,
        allApps: [],
        arrlist: [],
        addrules: {
          applicationtText: [
            { required: true, message: '请选择所属应用', trigger: 'change' },
          ],
          name: [
            { required: true, message: '请输入通道名称', trigger: 'blur' },
          ],
          region: [
            { required: true, message: '请选择通道类型', trigger: 'change' },
          ],
        },
        addchannel: {
          name: '',
          region: '',
        },
      }
    },
    computed: {},
    mounted() {
      this.getRole()
      this.getResource()
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {},
    methods: {
      ...mapActions({
        addVisitedRoute: 'tabs/addVisitedRoute',
        delVisitedRoute: 'tabs/delVisitedRoute',
        delOthersVisitedRoutes: 'tabs/delOthersVisitedRoutes',
        delLeftVisitedRoutes: 'tabs/delLeftVisitedRoutes',
        delRightVisitedRoutes: 'tabs/delRightVisitedRoutes',
        delAllVisitedRoutes: 'tabs/delAllVisitedRoutes',
      }),
      // initFrom
      initFrom() {
        this.addchannel = {}
        this.channelForm = false
        this.$refs['addchannel'].resetFields()
        this.resourceid = ''
      },
      // 关闭本页面
      handleClose() {
        this.handleTabRemove()
      },
      addchannelForm(formName) {
        console.log(this.addchannel.applicationtText)
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var obj = {}
            for (var key in this.addchannel) {
              obj[key] = this.addchannel[key]
            }
            delete obj.region
            delete obj.desc
            delete obj.type
            delete obj.isEnable
            delete obj.name
            const aclKey = 'role' + ':' + this.addchannel.applicationtText
            const aclObj = {}
            aclObj[aclKey] = { read: true, write: true }
            const data = {
              ACL: aclObj,
              config: obj,
              name: this.addchannel.name,
              cType: this.addchannel.region,
              desc: this.addchannel.desc,
              isEnable: false,
              status: 'OFFLINE',
              type: this.addchannel.type.toString(),
            }
            this.addchannelaxios(data)
          } else {
            this.$message('有必填项未填')
          }
        })
      },
      setCard(item) {
        this.removeauto(item)
      },
      orderObject(object) {
        var arr = []
        for (var key in object) {
          object[key].showname = key
          arr.push(object[key])
        }
        return arr.sort(this.arrSort)
      },
      removeauto(val) {
        var obj = {}
        var obj1 = {
          applicationtText: [
            { required: true, message: '请选择所属应用', trigger: 'change' },
          ],
          name: [
            { required: true, message: '请输入通道名称', trigger: 'blur' },
          ],
          region: [
            { required: true, message: '请选择通道类型', trigger: 'change' },
          ],
        }
        if (this.resourceid == '') {
          this.channelregion.map((item) => {
            if (item.cType == val) {
              this.$forceUpdate()
              this.selectregion = item
              this.arrlist = this.orderObject(this.selectregion.params)
              this.arrlist.map((item) => {
                //  这里过滤掉 showname 为ico的
                if (item.default) {
                  obj[item.showname] = item.default
                } else {
                  obj[item.showname] = ''
                }
                if (item.required) {
                  if (item.type == 'string' || item.type == 'integer') {
                    obj1[item.showname] = [{ required: true, trigger: 'blur' }]
                  } else {
                    obj1[item.showname] = [
                      { required: true, trigger: 'change' },
                    ]
                  }
                }
              })
              obj.region = val
              obj.desc = ''
              obj.name = ''
              obj.type = this.selectregion.type
              obj.isEnable = false
            }
          })
        } else {
          this.channelregion.map((item) => {
            if (item.cType == val) {
              this.selectregion = item
              this.$forceUpdate()
              this.arrlist = this.orderObject(this.selectregion.params)
              this.arrlist.map((item) => {
                for (var key in this.channelrow.config) {
                  if (item.showname == key) {
                    obj[item.showname] = this.channelrow.config[key]
                  }
                  if (item.required) {
                    if (item.type == 'string' || item.type == 'integer') {
                      obj1[item.showname] = [
                        { required: true, trigger: 'blur' },
                      ]
                    } else {
                      obj1[item.showname] = [
                        { required: true, trigger: 'change' },
                      ]
                    }
                  }
                  obj.region = val
                  obj.desc = this.channelrow.desc
                  obj.name = this.channelrow.name
                  obj.type = this.selectregion.type
                  obj.isEnable = this.channelrow.isEnable
                  // obj.applicationtText =
                }
              })
            }
          })
        }
        // 读取acl列表,获取所属应用名称
        if (this.channelrow) {
          for (var key in this.channelrow.ACL) {
            obj.applicationtText = key ? key.substr(5) : ''
          }
        }
        console.log('obj', obj)
        this.addchannel = obj
        this.addchannel.region = val
        this.addrules = obj1
      },
      async addchannelaxios(data) {
        await postChannel(data).then((results) => {
          if (results) {
            this.$message({
              type: 'success',
              message: this.channelupdated == '编辑' ? '编辑成功' : '创建成功',
            })
            // this.$refs['addchannel'].resetFields()
            this.addchannel = {}
            // this.reload()
            this.channelForm = false
            this.resourceid = ''
            // 创建成功后返回通道管理页，关闭当前页
            this.handleTabRemove()
          }
        })
      },
      /**
       * 根据原生路径删除标签中的标签
       * @param rawPath 原生路径
       * @returns {Promise<void>}
       */
      async handleTabRemove() {
        const rawPath = this.$route.path
        await this.delVisitedRoute(rawPath)
        this.$router.go(-1)
      },
      handleNodeClick(data) {
        this.$set(this.addchannel, 'applicationtText', data.name)
        this.showTree = !this.showTree
      },
      clearValidate(type) {
        console.log(`清除了 ${type} 的规则校验`)
        this.$refs.addchannel.clearValidate(`${type}`)
      },
      async getResource() {
        const res = await resourceTypes()
        res.forEach((item) => {
          if (!item.params.ico) {
            item.params.ico = {
              title: { en: 'channel ICO', zh: '通道ICO' },
              description: { en: 'channel ICO', zh: '通道ICO' },
              default:
                'http://dgiot-1253666439.cos.ap-shanghai-fsi.myqcloud.com/logo/logo.png',
            }
          }
        })
        this.channelregion = res
        this.$nextTick(() => {
          this.initFrom()
        })
      },
      async getRole() {
        const { results = [] } = await Roletree()
        this.allApps = results
      },
      onSubmit() {
        console.log('submit!')
      },
    }, //如果页面有keep-alive缓存功能，这个函数会触发
  }
</script>

<style lang="scss" scoped>
  /* @import url() */
  .createResourcechannel {
    margin: 20px;
    .device-tree {
      height: 200px;
      overflow: auto;
      ::v-deep {
        .el-scrollbar .el-scrollbar__wrap {
          overflow-x: hidden;
        }
        .clearfix {
          margin: 0;
        }
        .el-tree > .el-tree-node {
          display: inline-block;
          min-width: 100%;
          height: 200px; //这里的高根据实际情况
        }
      }
    }
    .dialog-footer {
      text-align: center;
    }
  }
</style>
