// shallow clone
function cloneShallow(target) {
  if (typeof target !== "object") {
    return target;
  }
  const targetClone = Array.isArray(target) ? [] : {};
  for (const key in target) {
    if (Object.hasOwnProperty.call(target, key)) {
      targetClone[key] = target[key];
    }
  }
  return targetClone;
}
// deep clone, core is recursion and traversal
function cloneDeep(target, hash = new WeakMap()) {
  if (typeof target !== "object" || target === null) {
    return target;
  }
  if (hash.has(target)) {
    return hash.get(target);
  }
  const targetClone = Array.isArray(target) ? [] : {};
  hash.set(target, targetClone);
  // check Symbol properties
  const symbolProperties = Object.getOwnPropertySymbols(target);
  if (symbolProperties.length > 0) {
    symbolProperties.forEach((key) => {
      if (typeof target[key] === "object" && target[key] !== null) {
        targetClone[key] = cloneDeep(target[key]);
      } else {
        targetClone[key] = target[key];
      }
    });
  }
  // common properties
  for (const key in target) {
    if (Object.hasOwnProperty.call(target, key)) {
      targetClone[key] =
        typeof target[key] === "object"
          ? cloneDeep(target[key], hash)
          : target[key];
    }
  }
  return targetClone;
}

// 深拷贝优化版本
function cloneDeep_v2(obj, hash = new WeakMap()) {
  if (obj == null) return obj; // 如果是null、undefined
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);

  if (typeof obj !== "object") return obj; // 基础类型或者函数

  if (hash.has(obj)) return hash.get(obj); // 有缓存 直接使用

  const clone = new obj.constructor(); // 对于obj可能是数组或者对象的情况，通过它的所属类的构造函数来创建空数组或者空对象

  hash.set(obj, clone); // 加入缓存

  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      clone[key] = cloneDeep(obj[key], hash);
    }
  }
  return clone;
}

// test
const fn = Symbol("fn");
const a = {
  key1: "value1",
  key2: {
    name: "xx",
    cards: [],
  },
  fn: [1, 2, 3, 4, 5],
};
const cloneShallowTarget = cloneShallow(a);
const cloneDeepTarget = cloneDeep(a);
console.log(cloneShallowTarget);
console.log(cloneDeepTarget);
a.key2.name = "value2";
console.log(cloneShallowTarget);
console.log(cloneDeepTarget);
