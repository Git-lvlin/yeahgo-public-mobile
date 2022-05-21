import React, { useState, useEffect } from 'react'
import {
  Typography,
  Divider,
  Image,
  Row,
  Col,
  Button
} from 'antd'
import ProTable from '@ant-design/pro-table'
import ProCard from '@ant-design/pro-card'
import moment from 'moment'
import { useParams, useLocation, history } from 'umi'

import { wholesaleDetail } from '@/services/Intensive-management/intensive-activitie-list'
import { amountTransform } from '@/utils/utils'
import Export from '@/components/export-excel/export'
import ExportHistory from '@/components/export-excel/export-history'

const { Title, Paragraph } = Typography

const DrawerDetail = () => {
  const [data, setData] = useState(null)
  const [visit, setVisit] = useState(false)
  const [popup, setPopup] = useState(false)

  const { id } = useParams()
  const { query } = useLocation()

  const operationId = localStorage.getItem('operationId')

  useEffect(() => {
    wholesaleDetail({
      operationId,
      wsId: id
    }).then(res => {
      setData(res.data.records)
    })
    return () => {
      setData(null)
    }
  }, [])

  const columns = [
    {
      title: '商品图片',
      dataIndex: 'imageUrl',
      render: (_) => <Image src={_} width={80} height={80} />,
      align: 'center'
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      align: 'center',
      width: '15%'
    },
    {
      title: '商品规格',
      dataIndex: 'skuName',
      align: 'center'
    },
    {
      title: '市场价',
      dataIndex: 'marketPrice',
      render: (_) => amountTransform(_, '/'),
      align: 'center'
    },
    {
      title: '集约价',
      dataIndex: 'price',
      render: (_) => amountTransform(_, '/'),
      align: 'center'
    },
    {
      title: '单次最小起订量',
      dataIndex: 'minNum',
      align: 'center'
    },
    {
      title: '单次最大限订量',
      dataIndex: 'maxNum',
      align: 'center'
    },
    {
      title: '剩余库存',
      dataIndex: 'totalStockNum',
      align: 'center'
    }
  ]

  const haveIntensive = [
    {
      dataIndex: 'storeNo',
      hideInTable: true
    },
    {
      title: '社区店名称',
      dataIndex: 'storeName',
      align: 'center',
    },
    {
      title: '联系人',
      dataIndex: 'realname',
      align: 'center',
    },
    {
      title: '联系电话',
      dataIndex: 'memberPhone',
      align: 'center',
    },
    {
      title: '已集约数量',
      dataIndex: 'totalNum',
      align: 'center',
    },
    {
      title: '已集约金额',
      dataIndex: 'totalFee',
      hideInSearch: true,
      align: 'center',
      render: (_)=> amountTransform(_, '/')
    },
  ]

  const notIntensive = [
    {
      dataIndex: 'storeNo',
      hideInTable: true
    },
    {
      title: '社区店名称',
      dataIndex: 'storeName',
      align: 'center',
    },
    {
      title: '联系人',
      dataIndex: 'realname',
      align: 'center',
    },
    {
      title: '联系电话',
      dataIndex: 'memberPhone',
      align: 'center',
    }
  ]

  return (
    <Typography style={{background: '#fff', padding: 20}}>
      <Title level={5}>活动商品</Title>
      <Divider style={{ marginTop: 5 }} />
      <Paragraph>
        <ProTable
          rowKey='goodsName'
          columns={columns}
          bordered
          dataSource={data?.sku}
          pagination={false}
          search={false}
          toolBarRender={false}
        />
      </Paragraph>
      <Title level={5}>活动参数</Title>
      <Divider style={{ marginTop: 5 }} />
      <Paragraph>
        <Row gutter={[32, 16]}>
          <Col span={6}>
            集约活动名称：{data?.wholesale?.name}
          </Col>
          <Col span={6}>
            集约id：{data?.wholesale?.id}
          </Col>
          <Col span={6}>
            可购买的社区店等级：{data?.wholesale?.storeLevelDesc}
          </Col>
          <Col span={6}>
            活动时间：{moment(Number(data?.wholesale?.wholesaleStartTime) * 1000).format("YYYY-MM-DD HH:mm:ss")}
          </Col>
          <Col span={6}>
            下单截止时间：{moment(Number(data?.wholesale?.endTimeAdvancePayment) * 1000).format("YYYY-MM-DD HH:mm:ss")}
          </Col>
          <Col span={6}>
            预计收益：{`${amountTransform(query.anticipatedIncome, '/')}/${data?.sku?.[0].unit}`}
          </Col>
          <Col span={6}>
            可购买的会员用户：{data?.wholesale?.memberLevelDesc}
          </Col>
          <Col span={6}>
            可集约店铺区域：{data?.allowArea?.map?.(item => (item.areaName)).join('，')}
          </Col>
        </Row>
      </Paragraph>
      <Title level={5}>社区店集约列表</Title>
      <Divider style={{ marginTop: 5 }} />
      <Paragraph>
        <ProCard
          tabs={{ type: 'card' }}
        >
          <ProCard.TabPane key="haveIntensive" tab="已集约店铺">
            <ProTable
              rowKey='storeNo'
              columns={haveIntensive}
              dataSource={data?.joinedStores}
              search={false}
              pagination={false}
              toolbar={{
                settings: false
              }}
              toolBarRender={() => [
                <Export
                  change={(e) => { setVisit(e) }}
                  key="export"
                  type="operation-wholesale-joined-export"
                  conditions={() => ({ wsId: id, operationId })}
                />,
                <ExportHistory
                  key="exportHistory"
                  show={visit}
                  setShow={setVisit}
                  type="operation-wholesale-joined-export"
                />
              ]}
            />
          </ProCard.TabPane>
          <ProCard.TabPane key="notIntensive" tab="未集约店铺">
            <ProTable
              rowKey='storeNo'
              columns={notIntensive}
              dataSource={data?.unJoinedStores}
              search={false}
              pagination={false}
              toolbar={{
                settings: false
              }}
              toolBarRender={() => [
                <Export
                  change={(e) => { setPopup(e) }}
                  key="export"
                  type="operation-wholesale-unjoined-export"
                  conditions={() => ({ wsId: id, operationId })}
                />,
                <ExportHistory
                  key="exportHistory"
                  show={popup}
                  setShow={setPopup}
                  type="operation-wholesale-unjoined-export"
                />
              ]}
            />
          </ProCard.TabPane>
        </ProCard>
      </Paragraph>
      <Button type='primary' onClick={()=> history.goBack()}>返回</Button>
    </Typography>
  )
}

export default DrawerDetail
