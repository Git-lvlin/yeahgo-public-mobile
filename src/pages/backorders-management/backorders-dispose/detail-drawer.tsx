import { useState, useEffect } from "react"
import { DrawerForm } from '@ant-design/pro-form'
import { Divider, Typography, Button, message, Spin, Space, Image } from "antd"
import ProDescriptions from "@ant-design/pro-descriptions"
import { EditableProTable } from '@ant-design/pro-table'

import type { FC } from "react"
import type { ProColumns } from '@ant-design/pro-table'
import type { ProDescriptionsItemProps } from "@ant-design/pro-descriptions"
import type { DrawerProps, StoreOrderProps, TableListItem, ArrProps } from "./data"

import "./styles.less"
import styles from "./styles.less"
import { getSupplierRefundInfo, createBySupplierRefund } from "@/services/backorders-management/backorders-dispose"

const { Title, Paragraph } = Typography

const DetailDrawer: FC<DrawerProps> = (props) => {
  const { drawerVisit, setDrawerVisit, onClose = () => { }, state, orSn } = props

  const [tableData, setTableData] = useState<StoreOrderProps[]>([])
  const [baseInfo, setBaseInfo] = useState<TableListItem>({})
  const [change, setChange] = useState<number>(0)
  const [num, setNum] = useState<number>(0)
  const [load, setLoad] = useState<boolean>(false)

  const operationId =  window.localStorage.getItem('operationId')

  useEffect(()=>{
    setLoad(true)
    getSupplierRefundInfo({
      operationId,
      orSn
    }).then(res => {
      setLoad(false)
      setBaseInfo(res.data.records.baseInfo)
      setTableData(res.data.records.operationRefundDetails)
    })
  }, [])

  useEffect(()=>{
    setNum(tableData.reduce((pre, cur) => pre + +cur.returnNum, 0))
    return () => {
      setNum(0)
    }
  }, [change])

  const fullRefund = () => {
    setTableData(tableData.map(res=> ({...res, returnNum: res.totalNum})))
  }

  const isFullReturn: ()=> boolean = () => {
    return tableData.reduce((pre, cur) => pre + +cur.totalNum, 0) === baseInfo.returnNum
  }

  const submit = () => {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < tableData.length; i++) {
        const reg = /^((0)|([1-9][0-9]*))$/
        if (!reg.test(`${tableData[i].returnNum}`) && tableData[i].returnNum > 0) {
          message.error(`店铺ID（${tableData[i].storeNo}）退货数量只能输入正整数`)
          reject()
          return
        }
      }

      const refundData = () => {
        const arr: ArrProps[] = []
        tableData.forEach(item => {
          if(item.returnNum > 0) {
            arr.push({
              orderId: item.orderId,
              returnNum: item.returnNum
            })
          }
        })
        return arr
      }
      createBySupplierRefund({
        operationId,
        orSn: baseInfo.orSn,
        refundData: refundData()
      },{ showSuccess: true }).then(res => {
        if (res.success) {
          resolve(``)
          onClose()
        } else {
          reject()
        }
      })
    })
  }

  const base: ProDescriptionsItemProps<TableListItem>[] = [
    {
      title: '申请编号',
      dataIndex: 'orSn'
    },
    {
      title: '申请时间',
      dataIndex: 'createTime'
    },
    {
      title: '关联集约采购单号',
      dataIndex: 'poNo'
    },
    {
      title: '关联集约活动编号',
      dataIndex: 'wsId'
    },
    {
      title: '供应商ID',
      dataIndex: 'supplierId'
    },
    {
      title: '供应商名称',
      dataIndex: 'supplierName'
    },
    {
      title: '采购商品',
      dataIndex: 'goodsName',
      render: (_, r) => (
        <Space size="middle">
          <Image
            width={80}
            height={80}
            src={r.imageUrl}
          />
          <span>{_}</span>
        </Space>
      )
    },
    {
      title: '库存单位',
      dataIndex: 'unit'
    },
    {
      title: '采购数量',
      dataIndex: 'totalNum'
    },
    {
      title: '缺货数量',
      dataIndex: 'returnNum'
    },
    {
      title: '处理状态',
      dataIndex: 'operationRefundStatus',
      valueType: 'select',
      valueEnum: {
        1: '待处理',
        2: '已提交',
        3: '已退款完成'
      }
    },
    {
      title: '审核状态',
      dataIndex: 'operationAuditStatus',
      valueType: 'select',
      valueEnum: {
        1: '-',
        2: '待审核',
        3: '审核通过',
        4: '审核拒绝'
      }
    }
  ]  

  const storeOrder: ProColumns<StoreOrderProps>[]  = [
    {
      title: '店铺ID',
      dataIndex: 'storeNo',
      editable: false,
      align: 'center',
      fixed: 'left'
    },
    {
      title: '社区店名称',
      dataIndex: 'storeName',
      editable: false,
      align: 'center'
    },
    {
      title: '配送点地址',
      dataIndex: 'fullAddress',
      editable: false,
      align: 'center'
    },
    {
      title: '店主订单号',
      dataIndex: 'orderId',
      editable: false,
      align: 'center'
    },
    {
      title: '采购数量',
      dataIndex: 'totalNum',
      editable: false,
      align: 'center'
      
    },
    {
      title: '退货数量',
      dataIndex: 'returnNum',
      align: 'center',
      valueType: 'digit',
      formItemProps: {
        rules: [
          {
            pattern: /^((0)|([1-9][0-9]*))$/,
            message: '退货数量只能输入正整数'
          }
        ]
      },
      fieldProps: {
        onChange: () => setChange(change + 1)
      },
      editable: ()=> !state,
    }
  ]

  return (
    <DrawerForm
      onVisibleChange={setDrawerVisit}
      visible={drawerVisit}
      drawerProps={{
        destroyOnClose: true,
        closeIcon: false,
        footerStyle: state ? {display: 'none'} : {}
      }}
      width={1000}
      onFinish={async () => {
        await submit()
        return true
      }}
    >
    <Spin spinning={load}>
      <Typography>
        <Paragraph>
          <Title level={5}>基础信息</Title>
          <Divider style={{margin: "-5px 0 15px"}}/>
          <ProDescriptions
            columns={base}
            bordered
            column={{ md: 2}}
            size="middle"
            dataSource={baseInfo}
          />
        </Paragraph>
        <Paragraph>
          <Title level={5}>
            店主订单操作
            {
              !state&&
              <span className={styles.orderOption}>（缺货数量为{baseInfo.returnNum}，请分配数量。当采购数量和缺货数量相同时，可以使用【一键全退】）</span>
            }
          </Title>
          <Divider style={{margin: "-5px 0 15px"}}/>
          <EditableProTable
            rowKey="orderId"
            headerTitle={!state && `已填报退款数量:${num}`}
            scroll={{ x: 'max-content' }}
            columns={storeOrder}
            controlled
            bordered
            value={tableData}
            recordCreatorProps={false}
            tableAlertRender={false}
            editable={{
              editableKeys: tableData.map(item => item.orderId),
              onValuesChange: (record, recordList) => {
                setTableData(recordList)
              }
            }}
            toolBarRender={!state ? () => [
              <Button 
                key="button"
                type="primary"
                onClick={() => fullRefund()}
                disabled={!isFullReturn()}
              >
                一键全退
              </Button>
            ]: false}
          />
        </Paragraph>
      </Typography>
     </Spin>
    </DrawerForm>
  )
}

export default DetailDrawer
