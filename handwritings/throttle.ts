// 节流函数： 将多次执行改为每隔一段时间执行

// 时间戳版本
// 第一次触发事件时立即执行，以后每过 waitTime 秒之后才执行一次，并且最后一次触发事件不会被执行
function throttle_timestamp(fn: Function, waitTime: number = 500): () => void {
  // 上一次执行的时间
  let lasttime = 0
  return function (...args) {
    // 当前时间
    let now = +new Date()
    // 比较当前时间和上一次执行时间
    if (now - lasttime > waitTime) {
      lasttime = now
      fn.apply(this, args)
    }
  }
}

//定时器版本
// 在第一次触发时不会执行，而是在 delay 秒之后才执行，当最后一次停止触发后，还会再执行一次函数

function throttle_timer(fn: Function, waitTime: number): () => void {
  // 保存定时器
  let timer: null | number = null
  return function (...args) {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null
      }, waitTime)
    }
  }
}
