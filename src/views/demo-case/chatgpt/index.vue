<template>
  <div class="page-wrapper">
    <div class="chat-container">
      <main class="chat-content">
        <el-scrollbar ref="scrollbarRef">
          <template v-for="(item, index) in messages">
            <div class="l-msg-item" v-if="item.role == 'assistant'">
              <div class="icon-wrapper">
                <!-- <iconGPT /> -->
                <img src="./imgs/logo.jpg" alt="" />
              </div>
              <div>
                <p class="time">{{ item.created }}</p>
                <div class="reply-wrapper">
                  <div class="reply-content">
                    <div class="markdown-body">
                      {{ item.content }}
                    </div>
                  </div>
                  <div>
                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                          aria-hidden="true"
                          role="img"
                          class="iconify iconify--ri"
                          width="1em"
                          height="1em"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M12 3c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m0 14c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m0-7c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2"
                          ></path>
                        </svg>
                      </span>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item>复制</el-dropdown-item>
                          <el-dropdown-item @click="messages.splice(index)">删除</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </div>
                </div>
              </div>
            </div>
            <div class="r-msg-item" v-else>
              <div class="user-avatar">
                <img
                  class="avatar"
                  loading="eager"
                  src="./imgs/avatar.jpg"
                  data-image-src="./imgs/avatar.jpg"
                />
              </div>
              <div>
                <p class="time">{{ item.created }}</p>
                <div class="req-wrapper">
                  <div class="req-content">
                    {{ item.content }}
                  </div>
                  <div>
                    <el-dropdown>
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                          aria-hidden="true"
                          role="img"
                          class="iconify iconify--ri"
                          width="1em"
                          height="1em"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M12 3c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m0 14c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2m0-7c-1.1 0-2 .9-2 2s.9 2 2 2s2-.9 2-2s-.9-2-2-2"
                          ></path>
                        </svg>
                      </span>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item>复制</el-dropdown-item>
                          <el-dropdown-item @click="messages.splice(index)">
                            删除
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </el-scrollbar>
      </main>
      <footer class="input-area">
        <div class="chat-input">
          <div class="input">
            <el-input
              size="large"
              style="width: 100%"
              v-model="inputMessage"
              placeholder="Please input"
              clearable
            >
              <template #prepend>
                <el-select
                  size="large"
                  v-model="selectKB"
                  placeholder="选择知识库"
                  style="width: 115px"
                >
                  <el-option
                    :label="item.kb_name"
                    :value="item.kb_name"
                    v-for="item in knowledgeDB"
                  />
                </el-select>
              </template>
              <template #append>
                <el-button
                  size="large"
                  type="primary"
                  :disabled="!inputMessage"
                  @click="sendMessage"
                >
                  <el-icon class="el-icon--right"><i-ep-search /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>
          <!-- <div class="btn">
            <el-button size="large" type="primary">
              <el-icon class="el-icon"><i-ep-download /></el-icon>
            </el-button>
          </div> -->
        </div>
      </footer>
    </div>
    <div class="origin-wrapper">
      <h4 class="title">搜索内容出处</h4>
      <div class="docs-content">
        <el-scrollbar>
          <div class="docs-html" v-html="currentDocHtml"></div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>
<script setup>
// import iconGPT from '@/assets/svg/gpt.svg?component'
import { $http } from '@/plugins/axios/index'
import dayjs from 'dayjs'
import { marked } from 'marked'
defineOptions({
  name: 'chatgpt'
})
// 1. 定义响应式变量
const inputMessage = ref('')
const messages = ref([
  {
    created: dayjs().format('YYYY/MM/D HH:mm:ss'),
    content: '你好，有什么可以帮助你！',
    role: 'assistant'
  }
])
let currentDocHtml = ref('')

let knowledgeDB = ref([])
let selectKB = ref('samples')

const scrollbarRef = useTemplateRef('scrollbarRef')

// 2. 处理发送消息的逻辑
const sendMessage = async () => {
  if (inputMessage.value.trim() === '') return

  // 3. 添加用户消息
  messages.value.push({
    content: inputMessage.value,
    role: 'user',
    created: dayjs().format('YYYY/MM/D HH:mm:ss')
  })

  // 4. 滚动到底
  scrollToBottom()

  // 5. 清空输入框
  const userMessage = inputMessage.value
  inputMessage.value = ''

  // 6. 添加 GPT 响应占位符
  const created = dayjs().format('YYYY/MM/D HH:mm:ss')
  messages.value.push({ content: '', role: 'assistant', created })
  const gptMessageIndex = messages.value.length - 1

  // 7. GPT 的流式响应
  getChatReply(gptMessageIndex, userMessage)
}

async function scrollToBottom() {
  await nextTick(() => {
    const chatContainer = scrollbarRef.value.wrapRef
    chatContainer.scrollTop = chatContainer.scrollHeight
  })
}

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }) {
  if (code === 'Enter') {
    sendMessage()
  }
}

async function getknowledgeList() {
  const { code, data } = await $http.get('/gpt/knowledge_base/list_knowledge_bases')
  if (code === 200) {
    knowledgeDB.value = data
  }
}

async function getChatReply(messageIndex, query) {
  // 使用 slice 获取最后三条记录
  const lastThreeRecords = messages.value.slice(-3)

  const body = JSON.stringify({
    query, // 我们来玩成语接龙，我先来，生龙活虎
    mode: 'local_kb',
    kb_name: selectKB.value,
    top_k: 3, // 默认
    score_threshold: 2, // 默认
    history: lastThreeRecords,
    stream: true,
    model: 'autodl-tmp-glm-4-9b-chat',
    temperature: 0.7,
    // max_tokens: 0,
    prompt_name: 'default'
    // return_direct: false
  })
  //  第一个 awiat 等待的是请求头
  const response = await fetch('/gpt/chat/kb_chat', {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body
  })
  // 第二个事请求体 获取响应流
  const reader = response.body.getReader()
  // 解码器
  const textDecoder = new TextDecoder()
  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    // 解码并拼接数据
    const chunkStr = textDecoder.decode(value, { stream: true }).replace('data:', '').toString()
    const { choices, docs } = JSON.parse(chunkStr)
    if (docs) {
      // 出处
      const markdownTxt = docs.join('')
      currentDocHtml.value = marked.parse(markdownTxt)
    } else {
      // 内容
      const {
        delta: { content }
      } = choices[0]
      messages.value[messageIndex].content += content
      scrollToBottom()
    }
  }
}

onMounted(() => {
  window.document.addEventListener('keypress', onkeypress)
  getknowledgeList()
})

onBeforeUnmount(() => {
  window.document.removeEventListener('keypress', onkeypress)
})
</script>

<style lang="scss" scoped>
.page-wrapper {
  height: 100%;
  display: flex;
}
.chat-container {
  flex: 1;
  height: 100%;
  background-color: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  border: 0.5px solid lightgray;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.origin-wrapper {
  margin-left: 20px;
  width: 400px;
  height: 100%;
  border: 0.5px solid lightgray;
  border-radius: 6px;
  .title {
    text-align: center;
    height: 40px;
    line-height: 40px;
    border-bottom: 0.5px solid lightgray;
  }
  .docs-content {
    padding: 10px;
    height: 80vh;
  }
}
.chat-content {
  margin: 0 auto;
  padding-top: 20px;
  width: 90%;
  flex: 1 1 0%;
  overflow: hidden;
}

.l-msg-item {
  width: 100%;
  display: flex;
  margin-bottom: 6px;
  overflow: hidden;
  .icon-wrapper {
    margin-right: 8px;
    // font-size: 28px;
    width: 46px;
  }
  .time {
    color: #b4bbc4;
    font-size: 14px;
  }
  .reply-wrapper {
    margin-top: 4px;
    display: flex;
    border-radius: 4px;
    font-size: 14px;
    align-items: flex-end;
    .reply-content {
      min-width: 20px;
      overflow-wrap: break-word;
      background-color: #f4f6f8;
      padding: 10px;
    }
    .markdown-body {
      background-color: transparent;
      font-size: 14px;
    }
  }
}
.r-msg-item {
  width: 100%;
  display: flex;
  margin-bottom: 6px;
  overflow: hidden;
  flex-direction: row-reverse;
  .user-avatar {
    margin-left: 8px;
    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
  .time {
    color: #b4bbc4;
    font-size: 14px;
    text-align: right;
  }
  .req-wrapper {
    margin-top: 4px;
    display: flex;
    border-radius: 4px;
    font-size: 14px;
    align-items: flex-end;
    flex-direction: row-reverse;
    .req-content {
      min-width: 20px;
      overflow-wrap: break-word;
      background-color: #d2f9d1;
      padding: 10px;
      white-space: pre-wrap;
    }
  }
}

.input-area {
  padding: 20px;
  //   border: 1px solid red;
  /* 输入区域 */
  .chat-input {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .input {
      display: inline-flex;
      width: 100%;
    }
    .btn {
      margin-left: 20px;
      .el-icon {
        font-size: 20px;
      }
    }
  }
}
</style>
