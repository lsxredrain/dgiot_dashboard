<template>
  <div class="topic-metrics">
    <div class="page-title">
      {{ $t('analysis.topicMetrics') }}
      <span class="sub-tip">{{ $t('analysis.metricsTip') }}</span>
      <el-button
        v-if="!modClosed"
        class="confirm-btn"
        round
        plain
        type="success"
        icon="el-icon-plus"
        size="medium"
        style="float: right"
        :disable="$store.state.loading"
        @click="handleOperation"
      >
        {{ $t('rule.create') }}
      </el-button>
      <el-button
        v-else
        class="confirm-btn"
        round
        plain
        type="success"
        size="medium"
        style="float: right"
        :disable="$store.state.loading"
        @click="handleModLoad"
      >
        {{ $t('modules.enable') }}
      </el-button>
    </div>
    <el-table
      ref="crudTable"
      v-loading="$store.state.loading"
      border
      :data="topics"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      @expand-change="handleExpandChange"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="expand-header">
            {{ $t('analysis.details') }}
            <el-radio-group
              v-model="topicQos"
              :prop="props"
              class="topic-qos-radio"
              size="mini"
            >
              <el-radio-button label="all">
                {{ $t('analysis.all') }}
              </el-radio-button>
              <el-radio-button label="qos0">QoS 0</el-radio-button>
              <el-radio-button label="qos1">QoS 1</el-radio-button>
              <el-radio-button label="qos2">QoS 2</el-radio-button>
            </el-radio-group>
          </div>
          <el-row class="expand-body" :gutter="20">
            <el-col :span="8">
              <div class="message-card in">
                <div>
                  {{ $t('analysis.messageIn') }}
                  <span class="message-rate">
                    {{
                      $t('analysis.rateItem', [
                        getCurrentTopicData('in', 'rate'),
                      ])
                    }}
                    {{ $t('analysis.rate') }}
                  </span>
                </div>
                <div class="message-card--body">
                  {{ getCurrentTopicData('in', 'count') }}
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="message-card out">
                <div>
                  {{ $t('analysis.messageOut') }}
                  <span class="message-rate">
                    {{
                      $t('analysis.rateItem', [
                        getCurrentTopicData('out', 'rate'),
                      ])
                    }}
                    {{ $t('analysis.rate') }}
                  </span>
                </div>
                <div class="message-card--body">
                  {{ getCurrentTopicData('out', 'count') }}
                </div>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="message-card drop">
                <div>
                  {{ $t('analysis.messageDrop') }}
                  <span class="message-rate">
                    {{
                      $t('analysis.rateItem', [
                        getCurrentTopicDropRate(
                          currentTopic['messages.dropped.rate']
                        ),
                      ])
                    }}
                    {{ $t('analysis.rate') }}
                  </span>
                </div>
                <div class="message-card--body">
                  {{ currentTopic['messages.dropped.count'] }}
                </div>
              </div>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="topic" :label="$t('topics.topic')" />
      <el-table-column prop="messageIn" :label="$t('analysis.messageIn')" />
      <el-table-column prop="messageOut" :label="$t('analysis.messageOut')" />
      <el-table-column prop="messageDrop" :label="$t('analysis.messageDrop')" />
      <el-table-column width="180px" :label="$t('oper.oper')">
        <template slot-scope="props">
          <el-button
            type="success"
            size="mini"
            plain
            @click="viewTopicDetails(props.row, props.$index)"
          >
            {{ $t('oper.view') }}
          </el-button>
          <el-popover placement="right" trigger="click" :value="popoverVisible">
            <p>{{ $t('oper.confirmDelete') }}</p>
            <div style="text-align: right">
              <el-button
                size="mini"
                type="text"
                class="cache-btn"
                @click="hidePopover"
              >
                {{ $t('oper.cancel') }}
              </el-button>
              <el-button
                size="mini"
                type="success"
                @click="deleteTopicMetric(props.row)"
              >
                {{ $t('oper.confirm') }}
              </el-button>
            </div>
            <el-button slot="reference" size="mini" type="danger" plain>
              {{ $t('oper.delete') }}
            </el-button>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="$t('analysis.addTopic')"
      width="400px"
      :visible.sync="addVisible"
      class="create-subscribe"
      @keyup.enter.native="handleAdd"
    >
      <el-form
        ref="record"
        class="el-form--public"
        :model="record"
        :rules="rules"
        size="small"
        label-position="top"
      >
        <el-form-item prop="topic" :label="$t('subscriptions.topic')">
          <el-input v-model="record.topic" placeholder="Topic" />
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button type="text" class="cache-btn" @click="handleClose">
          {{ $t('oper.cancel') }}
        </el-button>
        <el-button
          type="success"
          class="confirm-btn"
          :loading="$store.state.loading"
          @click="handleAdd"
        >
          {{ $t('oper.add') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'TopicMetrics',
    components: {},
    beforeRouteLeave(to, from, next) {
      clearInterval(this.timer)
      next()
    },
    props: {},
    data() {
      return {
        expands: [],
        addVisible: false,
        popoverVisible: false,
        modClosed: false,
        topicQos: 'all',
        timer: 0,
        topics: [],
        currentExpandRow: {},
        currentTopic: {},
        record: {},
        rules: {
          topic: {
            required: true,
            message: this.$t('oper.pleaseEnter'),
          },
        },
      }
    },
    watch: {
      currentExpandRow: {
        deep: true,
        handler() {
          clearInterval(this.timer)
        },
      },
    },
    created() {
      this.loadData()
    },
    beforeDestroy() {
      clearInterval(this.timer)
    },
    methods: {
      getRowKeys(row) {
        return row.topic
      },
      loadData() {
        this.$httpGet('/topic-metrics')
          .then((res) => {
            const { data } = res
            this.topics = data.map((item) => {
              const { metrics } = item
              return {
                topic: item.topic,
                messageIn: metrics['messages.in.count'],
                messageOut: metrics['messages.out.count'],
                messageDrop: metrics['messages.dropped.count'],
              }
            })
            this.modClosed = false
          })
          .catch((error) => {
            this.$message.warning(this.$t(`error.${error.message}`))
            this.modClosed = true
          })
      },
      hidePopover() {
        this.popoverVisible = true
        setTimeout(() => {
          this.popoverVisible = false
        }, 0)
      },
      handleOperation() {
        this.addVisible = true
      },
      handleModLoad() {
        this.$httpPut('/modules/emqx_mod_topic_metrics/load')
          .then(() => {
            this.$message.success(this.$t('oper.enableSuccess'))
            this.loadData()
            this.modClosed = false
          })
          .catch((error) => {
            this.$message.error(error || this.$t('error.networkError'))
          })
      },
      deleteTopicMetric(row) {
        this.$httpDelete(`/topic-metrics/${encodeURIComponent(row.topic)}`)
          .then(() => {
            this.loadData()
            this.hidePopover()
          })
          .catch((error) => {
            this.$message.error(error || this.$t('error.networkError'))
          })
      },
      handleAdd() {
        this.$refs.record.validate((valid) => {
          if (!valid) {
            return
          }
          const body = {}
          Object.assign(body, this.record)
          this.$httpPost('/topic-metrics', body)
            .then(() => {
              this.handleClose()
              this.loadData()
            })
            .catch(() => {})
        })
      },
      handleClose() {
        this.addVisible = false
        this.$refs.record.resetFields()
      },
      viewTopicDetails(row, index) {
        const elExpand = document.querySelectorAll('.el-table__expand-icon')[
          index
        ]
        if (elExpand) {
          elExpand.click()
        }
      },
      loadDetail() {
        this.$httpGet(
          `/topic-metrics/${encodeURIComponent(this.currentTopic.topic)}`
        )
          .then((res) => {
            this.currentTopic = res.data
            this.loadData()
          })
          .catch(() => {})
      },
      setLoadDetailInterval() {
        this.timer = setInterval(() => {
          this.$httpGet(
            `/topic-metrics/${encodeURIComponent(this.currentExpandRow.topic)}`
          )
            .then((res) => {
              this.currentTopic = res.data
            })
            .catch(() => {})
        }, 10000)
      },
      handleExpandChange(row, expandedRows) {
        if (!expandedRows.length) {
          this.currentExpandRow = {}
          clearInterval(this.timer)
          return
        }
        this.currentExpandRow = row
        this.currentTopic = {}
        this.$httpGet(`/topic-metrics/${encodeURIComponent(row.topic)}`)
          .then((res) => {
            this.currentTopic = res.data
            this.$refs.crudTable.store.states.expandRows = expandedRows.length
              ? [row]
              : []
            this.loadData()
            this.setLoadDetailInterval()
          })
          .catch(() => {})
      },
      getCurrentTopicData(type, analysis) {
        const label = {
          all: 'messages',
          qos0: 'messages.qos0',
          qos1: 'messages.qos1',
          qos2: 'messages.qos2',
        }
        const key = label[this.topicQos]
        const res = this.currentTopic[`${key}.${type}.${analysis}`]
        if (analysis === 'rate' && res) {
          return res.toFixed(2)
        }
        return res
      },
      getCurrentTopicDropRate(rate) {
        if (rate) {
          return rate.toFixed(2)
        }
        return rate
      },
    },
  }
</script>

<style lang="scss">
  .topic-metrics {
    .sub-tip {
      font-size: 14px;
      color: #9e9e9f;
      text-transform: none;
      margin-right: 10px;
    }
    .el-table {
      margin-top: 24px;
      .expand-header {
        height: 32px;
        line-height: 32px;
        margin-bottom: 20px;
      }
      .topic-qos-radio {
        float: right;
      }
      .message-card {
        height: 112px;
        border-radius: 4px;
        padding: 6px 12px;
        .message-card--body {
          font-size: 28px;
          height: 80px;
          line-height: 80px;
          text-align: center;
        }
        .message-rate {
          float: right;
        }
      }
    }
  }
</style>
