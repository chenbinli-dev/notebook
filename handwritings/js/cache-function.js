function memorize(func) {
  const cache = Object.create(null);
  return (...args) => {
    if (!cache[args]) {
      cache[args] = func.apply(this, args);
    }
    return cache[args];
  };
}
function add(n1, n2) {
  console.log(n1 + n2);
}
const a = memorize(add);

a(1, 2);
a(1, 2);
