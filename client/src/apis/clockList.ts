import request from '@/wxCloud/request'
export const apiGetClockList = (data) => {
  return request({
    name: 'clocks',
    data: {
      $url: 'get',
      ...data
    }
  })
}

export const apiAddClock = (data) => {
  return request({
    name: 'clocks',
    data: {
      $url: 'add',
      clock: data
    }
  })
}

export const apiEditClock = (data: any) => {
  return request({
    name: 'clocks',
    data: {
      $url: 'edit',
      ...data
    }
  })
}

export const apiDelClock = (data: any) => {
  return request({
    name: 'clocks',
    data: {
      $url: 'delete',
      ...data
    }
  })
}