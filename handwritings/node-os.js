const os = require('node:os')

// 测试
console.log("主机名：", os.hostname())
console.log("操作系统：", os.platform())
console.log("系统版本：", os.version())
console.log("CPU: ", os.arch())
console.log('总内存:', os.totalmem() / 1024 / 1024 + 'MB')
console.log('可用内存:', os.freemem() / 1024 / 1024 + 'MB')
console.log("cpus: ", os.cpus())
console.log("net", os.networkInterfaces())
console.log("userInfo", os.userInfo())
