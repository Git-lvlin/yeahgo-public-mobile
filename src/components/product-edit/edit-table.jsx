import React, { useState, useEffect } from 'react';
import { EditableProTable } from '@ant-design/pro-table';
import { Form } from 'antd';
import Upload from '@/components/upload';
import styles from './edit-table.less';

export default function EditTable(props) {
  const { tableHead, tableData, setTableData, goodsSaleType } = props;
  const [columns, setColumns] = useState([])
  const [editableKeys, setEditableKeys] = useState([])
  const [dataSource, setDataSource] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const arr = [];
    tableHead.forEach((item, index) => {
      if (item) {
        arr.push({
          title: item,
          dataIndex: `spec${index + 1}`,
          editable: false,
          width: 130,
        })
      }
    });

    setColumns([
      {
        title: '规格图片',
        dataIndex: 'imageUrl',
        // editable: false,
        renderFormItem: () => <Upload maxCount={1} className={styles.upload} accept="image/*" />,
        width: 100,
      },
      ...arr,
      {
        title: '货号',
        dataIndex: 'supplierSkuId',
        width: 130,
      },
      {
        title: '零售供货价(元)',
        dataIndex: 'retailSupplyPrice',
        hideInTable: goodsSaleType === 1,
        width: 130,
      },
      {
        title: '批发供货价(元)',
        dataIndex: 'wholesaleSupplyPrice',
        width: 130,
        hideInTable: goodsSaleType === 2,
      },
      {
        title: '最低批发量',
        dataIndex: 'wholesaleMinNum',
        width: 130,
        hideInTable: goodsSaleType === 2,
      },
      {
        title: '库存预警值',
        dataIndex: 'stockAlarmNum',
        width: 130,
      },
      {
        title: '可用库存',
        dataIndex: 'stockNum',
        width: 130,
      },
      {
        title: '操作',
        valueType: 'option',
        render: () => {
          return null;
        },
        width: 100,
      },
    ])

  }, [tableHead, goodsSaleType])

  useEffect(() => {
    setEditableKeys(tableData.map(item => item.key));
    setDataSource(tableData);
  }, [tableData])
  

  return (
    <EditableProTable
      columns={columns}
      rowKey="key"
      value={dataSource}
      scroll={{ x: '30vw' }}
      editable={{
        // form,
        editableKeys,
        actionRender: (row, config, defaultDoms) => {
          return [defaultDoms.delete];
        },
        onValuesChange: (record, recordList) => {
          setDataSource(recordList);
          setTableData(recordList)
        }
      }}
      bordered
      recordCreatorProps={false}
      style={{ marginBottom: 20 }}
    />
  )
}
