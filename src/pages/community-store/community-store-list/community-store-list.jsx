import React, { useState, useRef } from 'react';
import { Button, Tabs, Card } from 'antd';
import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import { meberShopPage } from '@/services/community-store/community-store-list';
import Export from '@/components/export-excel/export'
import ExportHistory from '@/components/export-excel/export-history'

import UnbindingDrawer from './unbinding-drawer'

export default (props) => {
  const ref = useRef()
  const [visit, setVisit] = useState(false)
  const [show, setShow] = useState(false)
  const [storeData, setStoreData] = useState({})
  const operationId = localStorage.getItem("operationId")

  const columns = [
    {
      title: '社区店名称',
      dataIndex: 'storeName',
      valueType: 'text'
    },
    {
      title: '社区店地址',
      dataIndex: 'address',
      hideInSearch: true,
      render: (_, records) => {
        return (
          <pre style={{ margin: 0, fontFamily: 'none' }}>
            {records?.areaInfo?.[records?.provinceId]} {records?.areaInfo?.[records?.cityId]} {records?.areaInfo?.[records?.regionId]} {_} {records?.communityName} {records?.houseNumber}
          </pre>
        )
      }
    },
    {
      title: '店主类型',
      dataIndex: 'memberShopType',
      valueType: 'text',
      hideInSearch: true,
      render:(_,data)=>{
        return <p>{_.desc}</p>
      }
    },
    {
      title: '社区店等级',
      dataIndex: 'level',
      render: (_, data) => {
        return <p>{_.levelName}</p>
      },
      hideInSearch: true,
    },
    {
      title: '社区店等级',
      dataIndex: 'level',
      valueType: 'select',
      valueEnum: {
        0: '全部',
        1: '一星店主',
        2: '二星店主',
        3: '三星店主',
        4: '四星店主',
        5: '五星店主'
      },
      hideInTable: true
    },
    {
      title: '店主名称',
      dataIndex: 'realname',
    },
    {
      title: '手机号',
      dataIndex: 'memberPhone',
      valueType: 'text',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, records) => {
        return (
          <Button
            disabled={records?.bindingOperationLastStatus === 3}
            onClick={() => {showDetail(records)}}>
              申请解绑
          </Button>
        )
      }
    }
  ];

  const showDetail = (e) => {
    setShow(true)
    setStoreData(e)
  }

  const getFieldValue = (searchConfig) => {
    return {
      ...searchConfig.form.getFieldsValue(),
      operationId: JSON.parse(operationId)
    }
  }

  return (
    <PageContainer>
      <ProTable
        actionRef={ref}
        rowKey="id"
        options={false}
        params={{}}
        request={meberShopPage}
        search={{
          defaultCollapsed: false,
          labelWidth: 100,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            <Export
              key="export"
              change={(e) => { setVisit(e) }}
              type={'community-store-list-export'}
              conditions={getFieldValue(searchConfig)}
            />,
            <ExportHistory key="histroy" show={visit} setShow={setVisit} type={'community-store-list-export'} />
          ],
        }}
        columns={columns}
      />
      {
        show&&
        <UnbindingDrawer
          visit={show}
          setVisit={setShow}
          dataSource={storeData}
          actionRef={ref}
          id={operationId}
        />
      }

    </PageContainer>
  );
};
