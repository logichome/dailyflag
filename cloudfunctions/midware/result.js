export function success(data = null) {
  return {
    code: 0,
    data,
    msg: 'success'
  }
}