<template>
  <div class="clients-view">
    <div class="page-title">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/clients' }">
          {{ $translateTitle('leftbar.clients') }}
        </el-breadcrumb-item>
        <el-breadcrumb-item class="breadcrumb-name">
          {{ $translateTitle('clients.view') }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="client-oper">
      <span
        :class="[
          basicRecord.connected ? 'connected' : 'disconnected',
          'status-circle',
        ]"
      ></span>
      <el-popover
        v-if="clientId.length > 90"
        placement="top-start"
        trigger="hover"
        :content="clientId"
      >
        <span slot="reference">{{ interceptString(clientId, 90) }}</span>
      </el-popover>
      <span v-else>{{ clientId }}</span>
      <el-button
        :class="[
          basicRecord.connected ? 'connected' : 'disconnected',
          'connect-btn',
        ]"
        size="mini"
        @click="handleDisconnect"
      >
        {{
          basicRecord.connected
            ? $translateTitle('clients.kickOut')
            : $translateTitle('websocket.cleanSession')
        }}
      </el-button>
    </div>

    <el-tabs v-model="activeName" class="normal-tabs" type="card">
      <el-tab-pane :label="$translateTitle('clients.basicInfo')" name="basic">
        <clients-basic :record="basicRecord" />
      </el-tab-pane>
      <el-tab-pane
        :label="$translateTitle('clients.subsInfo')"
        name="subscription"
      >
        <clients-subscriptions
          :client-id="clientId"
          :table-data="subscriptionsData"
          :reload="loadSubscription"
          :mountpoint="mountpoint"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import ClientsBasic from '@/components/ClientsBasic'
  import ClientsSubscriptions from '@/components/ClientsSubscriptions'
  import { intercept } from '@/utils'
  export default {
    name: 'ClientsView',
    components: {
      ClientsBasic,
      ClientsSubscriptions,
    },
    data() {
      return {
        activeName: 'basic',
        basicRecord: {},
        subscriptionsData: [],
        nodeName: '',
        mountpoint: '',
      }
    },
    computed: {
      clientId() {
        return this.$route.params.id
      },
    },
    watch: {
      activeName(val) {
        if (val === 'basic') {
          this.loadBasicData()
        } else if (val === 'subscription') {
          this.loadSubscription()
        }
      },
    },
    created() {
      this.loadBasicData()
    },
    methods: {
      interceptString(text, len) {
        return intercept(text, len)
      },
      handleCommand(command) {
        this[command]()
      },
      handleDisconnect() {
        const confirmMsg = this.basicRecord.connected
          ? this.$translateTitle('oper.confirmKickOut')
          : this.$translateTitle('oper.confirmCleanSession')
        this.$confirm(confirmMsg, this.$translateTitle('oper.warning'), {
          confirmButtonClass: 'confirm-btn',
          cancelButtonClass: 'cache-btn el-button--text',
          type: 'warning',
        })
          .then(() => {
            this.$httpDelete(`/clients/${encodeURIComponent(this.clientId)}`)
              .then(() => {
                this.$message.success(
                  this.$translateTitle('oper.disconnectSuccess')
                )
                this.$set(this.basicRecord, 'connected', false)
                setTimeout(() => {
                  this.$router.push({ path: '/clients' })
                }, 500)
              })
              .catch((error) => {
                this.$message.error(
                  error || this.$translateTitle('error.networkError')
                )
              })
          })
          .catch(() => {})
      },
      loadBasicData() {
        this.$httpGet(`/clients/${encodeURIComponent(this.clientId)}`)
          .then((res) => {
            this.basicRecord = res.data[0]
            this.nodeName = this.basicRecord.node
            if (res.data[0].mountpoint) {
              this.mountpoint = res.data[0].mountpoint
            }
            this.loadSubscription()
          })
          .catch(() => {})
      },
      loadSubscription() {
        this.$httpGet(
          `/nodes/${this.nodeName}/subscriptions/${encodeURIComponent(
            this.clientId
          )}`
        )
          .then((res) => {
            this.subscriptionsData = res.data
          })
          .catch(() => {})
      },
    },
  }
</script>

<style lang="scss">
  .clients-view {
    .client-oper {
      float: right;
      margin-top: -32px;
      color: #adafb4;
      .connect-btn {
        border: 1px solid;
        background: transparent;
        margin-left: 20px;
        min-width: 80px;
        font-size: 14px;
        font-weight: normal;
        &.disconnected {
          border-color: #ff6d6d;
          color: #ff6d6d;
        }
        &.connected {
          border-color: #adafb4;
          color: #adafb4;
        }
        &:hover {
          background: transparent !important;
        }
      }
    }
    .el-card.tabs-card {
      border-radius: 0 0 4px 4px;
    }
    .el-card .el-card__body {
      padding: 10px 36px;
    }
    .card-subtitle {
      font-size: 16px;
      margin: 24px 0;
    }
  }
</style>
