import React from 'react'
import { Radio } from 'antd'

const ListSort = ({onChange, value}) => {

  return (
    <div>
      <span>排序方式：</span>
      <Radio.Group onChange={(e)=>onChange(e.target.value)} value={value}>
        <Radio value={1}>默认</Radio>
        <Radio value={2}>补贴从高到底</Radio>
        <Radio value={3}>补贴从低到高</Radio>
      </Radio.Group>
    </div>
  )
}

export default ListSort
