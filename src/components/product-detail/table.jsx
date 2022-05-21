import React, { useState, useEffect } from 'react';
import { Table } from 'antd';

export default function EditTable(props) {
  const { tableHead, tableData } = props;
  const [columns, setColumns] = useState([])

  useEffect(() => {
    const arr = [];
    tableHead.forEach((item, index) => {
      if (item) {
        arr.push({
          title: item,
          dataIndex: `spec${index + 1}`,
        })
      }
    });

    setColumns([
      {
        title: '规格图片',
        dataIndex: 'imageUrl',
        render: (text) => {
          return <img src={text} width="50" height="50" />
        }
      },
      ...arr,
      {
        title: '货号',
        dataIndex: 'supplierSkuId',
      },
      {
        title: '零售供货价(元)',
        dataIndex: 'retailSupplyPrice',
      },
      {
        title: '批发供货价(元)',
        dataIndex: 'wholesaleSupplyPrice',
      },
      {
        title: '最低批发量',
        dataIndex: 'wholesaleMinNum',
      },
      {
        title: '库存预警值',
        dataIndex: 'stockAlarmNum',
      },
      {
        title: '可用库存',
        dataIndex: 'stockNum',
      },
    ])

  }, [tableHead])

  return (
    <Table
      columns={columns}
      rowKey="key"
      dataSource={tableData}
      bordered
      style={{ marginBottom: 20, width: '60vw' }}
      pagination={false}
    />
  )
}
