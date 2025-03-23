import TypeIt from 'typeit'

// 打字机效果组件（只是简单的封装下，更多配置项参考 https://www.typeitjs.com/docs/vanilla/usage#options）
export default defineComponent({
  name: 'CyTypeIt',
  props: {
    /** 打字速度，以每一步之间的毫秒数为单位，默认`200` */
    speed: {
      type: Number,
      default: 200
    },
    strings: {
      type: String
    },
    cursor: {
      type: Boolean,
      default: true
    }
  },
  render() {
    return h('span', {
      default: () => []
    })
  },
  mounted() {
    new TypeIt(this.$el, {
      strings: this.strings,
      speed: this.speed,
      cursor: this.cursor
    }).go()
  }
})
