// 防抖函数： 将多次执行改为最后一次执行
function debounce(fn: Function, wait: number): () => void {
  // 缓存一个定时器ID
  let timer = 0
  // 将用户实际需要自行的函数进行返回
  // 如果计时器已经设定则清空，重新计时,延迟执行
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, wait)
  }
}
