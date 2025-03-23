// 定义一个发布订阅的事件中心用来解耦业务

class EventEmitter {
  constructor() {
    this.events = {} // 存储事件名和订阅的回调函数
  }

  // 订阅事件
  on(eventName, listener) {
    // 如果事件名不存在，则初始化为一个空数组
    if (!this.events[eventName]) {
      this.events[eventName] = []
    }
    // 将订阅的回调函数加入事件的订阅队列中
    this.events[eventName].push(listener)
  }

  // 取消订阅事件
  off(eventName, listener) {
    if (!this.events[eventName]) return

    // 过滤出不等于指定 listener 的回调函数，达到取消订阅的目的
    this.events[eventName] = this.events[eventName].filter((fn) => fn !== listener)
  }

  // 发布事件
  emit(eventName, ...args) {
    if (!this.events[eventName]) return

    // 执行所有订阅该事件的回调函数
    this.events[eventName].forEach((listener) => listener(...args))
  }

  // 只触发一次的订阅
  once(eventName, listener) {
    // 创建一次性事件的回调函数
    const onceListener = (...args) => {
      listener(...args)
      this.off(eventName, onceListener) // 执行完毕后取消订阅
    }

    this.on(eventName, onceListener) // 订阅一次性事件
  }
}

export default new EventEmitter()

// // 使用案例
// const bus = new EventEmitter()
// const handler1 = (message) => {
//   console.log('Handler 1 received:', message)
// }
// const handler2 = (message) => {
//   console.log('Handler 2 received:', message)
// }

// // 订阅事件
// bus.on('event1', handler1)
// bus.on('event1', handler2)

// // 发布事件
// bus.emit('event1', 'Hello, EventBus!')

// // 取消订阅某个事件
// bus.off('event1', handler2)

// // 再次发布事件，handler2 将不会被触发
// bus.emit('event1', 'Hello again, EventBus!')

// // 订阅一次性事件
// bus.once('event2', (message) => {
//   console.log('Once handler received:', message)
// })

// // 发布一次性事件
// bus.emit('event2', 'This will be received')
// bus.emit('event2', 'This will not be received')
