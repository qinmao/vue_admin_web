import './reset.css'
import { zxcvbn } from '@zxcvbn-ts/core'
import { $http } from '@/plugins/axios/index'

export function usePwd() {
  const passwordRef = ref()
  const pwdDialogVisible = ref(false)
  // 重置的新密码
  const pwdForm = reactive({
    password: ''
  })

  const pwdProgress = reactive([
    { color: '#e74242', text: '非常弱' },
    { color: '#EFBD47', text: '弱' },
    { color: '#ffa500', text: '一般' },
    { color: '#1bbf1b', text: '强' },
    { color: '#008000', text: '非常强' }
  ])
  // 当前密码强度（0-4）
  const curScore = ref()

  const resetPwdTitle = ref('')
  const pwdBtnloading = ref(false)
  let editId = ''

  watch(pwdForm, ({ password }) => (curScore.value = !password ? -1 : zxcvbn(password).score))

  function onResetPwdClick(row) {
    resetPwdTitle.value = `重置 ${row.userName} 用户的密码`
    editId = row.id
    pwdDialogVisible.value = true
    nextTick(() => {
      passwordRef.value.resetFields()
    })
  }
  function onPwdAbortClick() {
    passwordRef.value.resetFields()
    pwdBtnloading.value = false
  }
  function onPwdSubmitClick() {
    passwordRef.value.validate((valid) => {
      if (valid) {
        pwdBtnloading.value = true
        $http
          .post(`/api/user/updatePassword/${editId}`, pwdForm)
          .then(() => {
            ElMessage({
              message: `密码已成功重置`,
              type: 'success'
            })
            pwdDialogVisible.value = false
          })
          .finally(() => {
            pwdBtnloading.value = false
          })
      }
    })
  }
  function pwdHandleClose(done) {
    ElMessageBox.confirm('确定要关闭吗?')
      .then(() => {
        pwdForm.password = ''
        done()
      })
      .catch(() => {
        // catch error
      })
  }
  return {
    pwdDialogVisible,
    passwordRef,
    pwdForm,
    pwdProgress,
    curScore,
    resetPwdTitle,
    pwdBtnloading,
    pwdHandleClose,
    onResetPwdClick,
    onPwdAbortClick,
    onPwdSubmitClick
  }
}
// 给用户分配角色
export function useRole() {
  const roleTitle = ref('')
  const roleDialogVisible = ref(false)
  const roleBtnloading = ref(false)

  const roleForm = reactive({
    userId: '',
    userName: '',
    roleIds: []
  })
  const roleList = ref([])

  function roleHandleClose(done) {
    ElMessageBox.confirm('确定要关闭吗?')
      .then(() => {
        roleForm.roleIds = []
        done()
      })
      .catch(() => {
        // catch error
      })
  }

  async function getRoleList() {
    const { result } = await $http.get('/api/role/list')
    roleList.value = result || []
  }

  async function onRoleClick(row) {
    roleTitle.value = `分配 ${row.userName} 用户的角色`
    const { id, userName } = row
    roleForm.userId = id
    roleForm.userName = userName
    // 获取当前用户用户的角色
    const { result } = await $http.get(`/api/user/getUsertDetail/${id}`)
    const roleIds = result.roles.map((item) => item.id) || []
    roleForm.roleIds = roleIds

    roleDialogVisible.value = true
  }
  function onRoleSubmitClick() {
    roleBtnloading.value = true
    const { roleIds, userId } = roleForm

    $http
      .post(`/api/user/updateUserRole/${userId}`, { roleIds })
      .then(() => {
        ElMessage({
          message: `分配角色成功`,
          type: 'success'
        })
        roleDialogVisible.value = false
      })
      .finally(() => {
        roleBtnloading.value = false
      })
  }

  return {
    roleTitle,
    roleDialogVisible,
    roleBtnloading,
    roleForm,
    roleList,
    roleHandleClose,
    getRoleList,
    onRoleClick,
    onRoleSubmitClick
  }
}
