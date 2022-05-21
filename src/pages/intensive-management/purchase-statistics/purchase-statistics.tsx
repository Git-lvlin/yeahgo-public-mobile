import type { FC } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import type { ProColumns } from '@ant-design/pro-table'
import ProTable from '@ant-design/pro-table'
import { Image } from 'antd'

import type { TableListItem } from './data.d'
import { storeOrderSpuStatistic } from '@/services/intensive-management/purchase-statistics'
import { getTimeDistance } from '@/utils/utils'

const PurchaseStatistics: FC = () => {

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '日期',
      dataIndex: 'time',
      hideInTable: true,
      valueType: 'dateTimeRange',
      initialValue: getTimeDistance('yesterday'),
    },
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      align: 'center',
      width: '20%',
      hideInSearch: true
    },
    {
      title: '商品图片',
      dataIndex: 'imageUrl',
      align: 'center',
      hideInSearch: true,
      render: (_, r) => <Image src={r.imageUrl} width={80} height={80}/>
    },
    {
      title: 'skuID',
      dataIndex: 'skuId',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '商品类型',
      dataIndex: 'businessType',
      align: 'center',
      valueType: 'select',
      valueEnum: {
        0: '全部',
        1: '普适品',
        2: '精装生鲜',
        3: '毛菜'
      }
    },
    {
      title: '采购订单数',
      dataIndex: 'orderNum',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '规格/箱规',
      dataIndex: 'skuName',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '单位',
      dataIndex: 'unit',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '份数',
      dataIndex: 'num',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '总数量',
      dataIndex: 'totalNum',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '采购店主数',
      dataIndex: 'storeNum',
      align: 'center',
      hideInSearch: true
    },
    {
      title: '统计类型',
      dataIndex: 'statType',
      hideInTable: true,
      valueType: 'select',
      valueEnum: {
        0: '统计全部订单',
        1: '统计集约待发货订单',
        2: '统计集约进行中订单'
      }
    }
  ]

  return ( 
    <PageContainer>
      <ProTable<TableListItem>
        rowKey="skuId"
        columns={columns}
        request={storeOrderSpuStatistic}
        params={{}}
        pagination={{
          showQuickJumper: true,
          pageSize: 10
        }}
        options={false}
        search={{
          defaultCollapsed: false,
          optionRender:(searchConfig, formProps, dom)=>[
            ...dom.reverse()
          ]
        }}
      />
    </PageContainer>
  )
}

export default PurchaseStatistics
