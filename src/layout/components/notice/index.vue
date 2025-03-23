<template>
  <el-dropdown trigger="click" placement="bottom-end">
    <span class="dropdown-badge">
      <el-badge :value="noticesNum" :max="99" v-if="noticesNum">
        <span class="header-notice-icon">
          <i-ep-bell />
        </span>
      </el-badge>
      <span class="header-notice-icon" v-else>
        <i-ep-bell />
      </span>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-tabs
          :stretch="true"
          v-model="activeKey"
          class="dropdown-tabs"
          :style="{ width: noticesNum === 0 ? '200px' : '330px' }"
        >
          <el-empty v-if="noticesNum === 0" description="暂无消息" :image-size="60" />
          <template v-else>
            <!-- <el-tab-pane :label="`通知(${noticeData.length})`" name="notice">
              <el-scrollbar max-height="330px">
                <div v-if="noticeData.length" class="noticeList-container">
                  <div
                    class="notice-container border-b-[1px] border-solid border-[#f0f0f0] dark:border-[#303030]"
                    v-for="noticeItem in noticeData"
                  >
                    <el-avatar :size="30" :src="noticeIcon" class="notice-container-avatar" />
                    <div class="notice-container-text">
                      <div class="notice-text-title text-[#000000d9] dark:text-white">
                        <el-tooltip
                          popper-class="notice-title-popper"
                          :disabled="!noticeItem.tooltip"
                          :content="noticeItem.content"
                          effect="light"
                          placement="top-start"
                        >
                          <div
                            class="notice-title-content"
                            @mouseover="hoverContent($event, noticeItem)"
                          >
                            {{ noticeItem.content }}
                          </div>
                        </el-tooltip>
                      </div>
                      <div class="notice-text-datetime text-[#00000073] dark:text-white">
                        {{ noticeItem.datetime }}
                      </div>
                    </div>
                  </div>
                </div>
                <el-empty v-else description="暂无数据" />
              </el-scrollbar>
            </el-tab-pane> -->
            <el-tab-pane :label="`消息(${noticeData.length})`" name="msg">
              <el-scrollbar max-height="330px">
                <div v-if="noticeData" class="noticeList-container">
                  <div
                    @click="onReadClick(noticItem, index)"
                    class="notice-container"
                    v-for="(noticItem, index) in noticeData"
                  >
                    <el-avatar :size="30" :src="defalutAvatar" class="notice-container-avatar" />
                    <div class="notice-container-text">
                      <div class="notice-text-title">
                        <div
                          class="notice-title-content"
                          @mouseover="hoverContent($event, noticItem)"
                        >
                          {{ noticItem.title }}
                        </div>
                      </div>
                      <el-tooltip
                        popper-class="notice-title-popper"
                        :disabled="!noticItem.descriptionTooltip"
                        :content="noticItem.description"
                        placement="top-start"
                        effect="light"
                      >
                        <div
                          class="notice-text-description"
                          @mouseover="hoverDescription($event, noticItem)"
                        >
                          {{ noticItem.description }}
                        </div>
                      </el-tooltip>
                      <div class="notice-text-datetime">
                        {{ noticItem.createTime }}
                      </div>
                    </div>
                  </div>
                </div>
                <el-empty v-else description="暂无数据" />
              </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane :label="`待办(${todoData.length})`" name="todo">
              <el-scrollbar max-height="330px">
                <div class="noticeList-container">
                  <div
                    class="notice-container"
                    v-for="todoItem in todoData"
                    @click="todoItemClick(todoItem)"
                  >
                    <div class="notice-container-text">
                      <div class="notice-text-title">
                        <el-tooltip
                          popper-class="notice-title-popper"
                          :content="todoItem.title"
                          placement="top-start"
                          effect="light"
                          :disabled="!todoItem.tooltip"
                        >
                          <div
                            class="notice-title-content"
                            @mouseover="hoverContent($event, todoItem)"
                          >
                            {{ todoItem.title }}
                          </div>
                        </el-tooltip>
                        <el-tag
                          v-if="todoItem?.extra"
                          :type="todoItem?.statusType"
                          size="small"
                          class="notice-title-extra"
                        >
                          {{ todoItem?.extra }}
                        </el-tag>
                      </div>
                      <el-tooltip
                        popper-class="notice-title-popper"
                        :content="todoItem.description"
                        :disabled="!todoItem.tooltip"
                        placement="top-start"
                        effect="light"
                      >
                        <div
                          class="notice-text-description"
                          @mouseover="hoverDescription($event, todoItem)"
                        >
                          {{ todoItem.description }}
                        </div>
                      </el-tooltip>
                    </div>
                  </div>
                </div>
              </el-scrollbar>
            </el-tab-pane>
          </template>
        </el-tabs>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script>
// import dayjs from 'dayjs'
import { todoData, noticeData } from './data'
import noticeIcon from './imgs/notice-icon.png'
import defalutAvatar from '@/assets/police.jpg'

export default {
  data() {
    return {
      noticeIcon,
      defalutAvatar,

      noticeData: [],
      todoData: [],
      activeKey: 'msg'
    }
  },
  computed: {
    noticesNum() {
      return this.todoData.length + this.noticeData.length
    }
  },
  mounted() {
    this.getNoticList()
    this.getToDoList()
  },
  methods: {
    async getNoticList() {
      //   const { result } = await this.$http.get('/api/task-msg/getUserMsg')
      //   this.noticeData = result || []
      this.noticeData = noticeData
    },
    async getToDoList() {
      //   const { result } = await this.$http.get('/api/task/getToDoList')
      //   const todoData = result.map((item) => {
      //     const { name, deadline, status, id } = item
      //     const day = dayjs(deadline).diff(dayjs(), 'd')
      //     let extra = '',
      //       statusType = 'success'
      //     if (day === 0) {
      //       extra = '马上到期'
      //       statusType = 'danger'
      //     } else if (day < 0) {
      //       extra = `已超时 ${Math.abs(day)} 天`
      //       statusType = 'warning'
      //     } else {
      //       extra = '进行中'
      //     }
      //     return {
      //       title: name,
      //       description: `任务需要在 ${deadline} 前完成`,
      //       extra,
      //       statusType,

      //       status,
      //       id
      //     }
      //   })
      //   this.todoData = todoData || []
      this.todoData = todoData
    },
    onReadClick(noticItem, index) {
      //   this.$http.post(`/api/task-msg/updateStatus/${noticItem.id}`).then(() => {
      //     this.noticeData.splice(index, 1)
      //   })
      //   this.$router.push(`/task/detail?id=${noticItem.taskId}`)
    },
    todoItemClick(todoItem) {
      //   // 已签收的跳转详情页，
      //   if (todoItem.status === 30) {
      //     this.$router.push(`/task/detail?id=${todoItem.id}`)
      //   } else {
      //     // 未签收的跳转列表也
      //     this.$router.push(`/task/center`)
      //   }
    },
    hoverContent(event, item) {
      const titleRef = event.target
      if (titleRef.scrollWidth > titleRef?.clientWidth) {
        item.tooltip = true
      }
    },
    hoverDescription(event, item) {
      // currentWidth 为文本在页面中所占的宽度，创建标签，加入到页面，获取currentWidth ,最后在移除
      const tempTag = document.createElement('span')
      tempTag.innerText = item.description
      tempTag.className = 'getDescriptionWidth'
      document.querySelector('body').appendChild(tempTag)
      const currentWidth = document.querySelector('.getDescriptionWidth').offsetWidth
      document.querySelector('.getDescriptionWidth').remove()

      // cellWidth为容器的宽度
      const cellWidth = event.target.offsetWidth

      // 当文本宽度大于容器宽度两倍时，代表文本显示超过两行
      if (currentWidth > 2 * cellWidth) {
        item.descriptionTooltip = true
      }
    }
  }
}
</script>
<style>
.notice-title-popper {
  max-width: 238px;
}
</style>
<style lang="scss" scoped>
.dropdown-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 48px;
  cursor: pointer;

  .header-notice-icon {
    font-size: 18px;
  }
}

.dropdown-tabs {
  .noticeList-container {
    padding: 15px 24px 0;
  }

  .notice-container {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 12px 0;
    cursor: pointer;
    border-bottom: 0.5px solid var(--el-border-color);
    &:last-child {
      border: none;
    }
    .notice-container-avatar {
      margin-right: 16px;
    }

    .notice-container-text {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;

      .notice-text-title {
        display: flex;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 400;
        line-height: 1.5715;
        cursor: pointer;

        .notice-title-content {
          flex: 1;
          width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .notice-title-extra {
          float: right;
          margin-top: -1.5px;
          font-weight: 400;
        }
      }

      .notice-text-description,
      .notice-text-datetime {
        font-size: 12px;
        line-height: 1.5715;
      }

      .notice-text-description {
        display: -webkit-box;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .notice-text-datetime {
        margin-top: 4px;
      }
    }
  }
}
</style>
