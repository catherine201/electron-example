export function getParams(key) {
  if (window.location.href.indexOf('?') !== -1) {
    const str = window.location.href.split('?')[1]
    if (str.indexOf('&') !== -1) {
      const arr = str.split('&')
      let output = ''
      arr.forEach(item => {
        const ar = item.split('=')
        if (ar[0] === key) {
          output = ar[1]
        }
      })
      return output
    }
    const arr = str.split('=')
    if (key === arr[0]) {
      return arr[1]
    }
  }
}
