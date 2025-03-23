<template>
  <div class="header-right">
    <el-switch
      inline-prompt
      v-model="isDark"
      :active-icon="useIcon('ep-sunny')"
      :inactive-icon="useIcon('ep-moon')"
      @click="toggleDark"
    />
    <Notice class="set-icon" />
    <el-dropdown trigger="hover">
      <div class="el-dropdown-link">
        <img class="avatar" :src="userInfo.avatarUrl ? userInfo.avatarUrl : policeAvatar" />
        <p class="account" v-if="userInfo.userName">{{ userInfo.userName }}</p>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="logout">
            <i-ri-logout-circle-r-line style="margin: 5px" />
            退出系统
          </el-dropdown-item>
          <el-dropdown-item @click="$router.push('/system/profile')">
            <i-ep-user style="margin: 5px" />
            个人信息
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <span class="set-icon" title="打开项目配置" @click="toggleSetting">
      <i-ri-settings-3-line />
    </span>
  </div>
</template>

<script setup>
defineOptions({
  name: 'HeaderRight'
})
import Notice from '@/layout/components/notice/index.vue'
import { useNav } from '@/layout/components/utils/hook'
import { useIcon } from '@/components/CyIcon/hook'
import policeAvatar from '@/assets/police.jpg'
const { toggleSetting, userInfo, logout } = useNav()

const isDark = ref(false)
// 切换主题
const toggleDark = (e) => {
  //   localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  // 获取到 transition API 实例
  const transition = document.startViewTransition(() => {
    document.documentElement.classList.toggle('dark')
  })

  // 在 transition.ready 的 Promise 完成后，执行自定义动画
  transition.ready.then(() => {
    // 由于我们要从鼠标点击的位置开始做动画，所以我们需要先获取到鼠标的位置
    const { clientX, clientY } = e

    // 计算半径，以鼠标点击的位置为圆心，到四个角的距离中最大的那个作为半径
    const radius = Math.hypot(
      Math.max(clientX, innerWidth - clientX),
      Math.max(clientY, innerHeight - clientY)
    )
    const clipPath = [
      `circle(0% at ${clientX}px ${clientY}px)`,
      `circle(${radius}px at ${clientX}px ${clientY}px)`
    ]
    const isDark = document.documentElement.classList.contains('dark')
    // 自定义动画
    document.documentElement.animate(
      {
        // 如果要切换到暗色主题，我们在过渡的时候从半径 100% 的圆开始，到 0% 的圆结束
        clipPath: isDark ? clipPath.reverse() : clipPath
      },
      {
        duration: 500,
        // 如果要切换到暗色主题，我们应该裁剪 view-transition-old(root) 的内容
        pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)'
      }
    )
  })
}
</script>

<style lang="scss" scoped>
.header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 280px;
  height: 100%;
  .el-dropdown-link {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 10px;
    cursor: pointer;

    .account {
      max-width: 100px;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .avatar {
      margin-right: 10px;
      width: 26px;
      height: 26px;
      border-radius: 50%;
    }
  }
  .set-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 48px;
    cursor: pointer;
  }
  /* 告警 */
  .dropdown-badge,
  /* 用户名 */
  .el-dropdown-link,
  /* 设置 */
  .set-icon {
    &:hover {
      background: var(--icon-hover-bg-color);
    }
  }
}
</style>
