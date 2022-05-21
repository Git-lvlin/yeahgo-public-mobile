import React, { useState, useEffect } from 'react';
import { Cascader } from 'antd';
import { detailExt } from '@/services/common';
import { arrayToTree } from '@/utils/utils'

const GcCascader = ({ value, onChange, supplierId }) => {
  const [gcData, setGcData] = useState([]);

  const changeHandle = (v) => {
    onChange(v)
  }

  useEffect(() => {
    detailExt({
      supplierId,
    })
      .then(res => {
        if (res.code === 0) {
          const data = res.data.records.gcInfo.filter(item => item.gcShow === 1).map(item => ({ ...item, pid: item.gcParentId, label: item.gcName, value: item.id }))
          setGcData(arrayToTree(data))
        }
      });
    return () => {
      setGcData([])
    }
  }, [])

  return (
    <Cascader value={value} onChange={changeHandle} options={gcData} placeholder="请选择商品品类" changeOnSelect />
  )
}

export default GcCascader;

