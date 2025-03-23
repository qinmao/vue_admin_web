import { ElSubMenu, ElMenuItem, ElIcon } from 'element-plus'
import { resolve } from 'path-browserify'
import { Icon } from '@iconify/vue'

export default defineComponent({
  name: 'MenuItem',
  props: {
    menus: {
      type: Array,
      required: true,
      default() {
        return []
      }
    }
  },
  setup(props) {
    const { menus } = props
    function resolvePath(routePath, basePath) {
      const httpReg = /^http(s?):\/\//
      if (httpReg.test(routePath) || httpReg.test(basePath)) {
        return routePath || basePath
      } else {
        return resolve(basePath, routePath)
      }
    }

    function renderMenuItem(index, meta) {
      const slots = {
        default: () => {
          if (meta?.icon) {
            return (
              <>
                <ElIcon>
                  <Icon icon={meta.icon}></Icon>
                </ElIcon>
                <span>{meta.title}</span>
              </>
            )
          }
          return <span>{meta.title}</span>
        }
      }
      return <ElMenuItem index={index} v-slots={slots}></ElMenuItem>
    }

    function renderSubMenuItem(index, item) {
      const slots = {
        title: () => {
          if (item.meta.icon) {
            return (
              <>
                <ElIcon>
                  <Icon icon={item.meta.icon}></Icon>
                </ElIcon>
                <span>{item.meta.title}</span>
              </>
            )
          } else {
            return <span>{item.meta.title}</span>
          }
        }
      }
      return (
        <ElSubMenu index={index} v-slots={slots}>
          {item.children.map((childItem) => {
            const childIndex = resolvePath(childItem.path, index)
            return renderMenuItem(childIndex, childItem.meta)
          })}
        </ElSubMenu>
      )
    }

    function renderMenu(menus, basePath = '') {
      return menus.map((item) => {
        // 有children，就ElSubMenu，没有 ElMenuItem
        const index = resolvePath(item.path, basePath)
        if (!item.children) {
          return renderMenuItem(index, item.meta)
        } else {
          return renderSubMenuItem(index, item)
        }
      })
    }

    return () => <>{renderMenu(menus)}</>
  }
})
