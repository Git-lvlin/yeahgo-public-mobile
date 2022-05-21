import React, { useState, useEffect } from 'react'
import ProCard from '@ant-design/pro-card'
import { PageContainer } from '@ant-design/pro-layout'
import { history } from 'umi'
import { Empty, Typography, Divider } from 'antd'
import { 
  UserDeleteOutlined,
  MailOutlined,
  BarChartOutlined,
  FileDoneOutlined,
  ContactsOutlined
} from '@ant-design/icons'

import { messageList } from '@/services/mail/mail-list'
import styles from './style.less'

const { Paragraph, Text } = Typography

const WorkPlace = () => {
  const [data, setData] = useState([])

  useEffect(()=> {
    messageList({size: 10}).then(res=> {
      setData(res.data)
    })
  }, [])
  return (
    <PageContainer title={false}>
      <ProCard gutter={[24, 24]}>
        <ProCard
          title="快捷菜单"
          type="inner" 
          bordered
          gutter={[16, 8]}
          wrap
        >
          <ProCard colSpan={6}>
            <div onClick={() => { history.push('/community-store/community-store-list') }}>
              <UserDeleteOutlined className={styles.img} />
              <div className={styles.title}>社区店管理</div>
            </div>
          </ProCard>
          <ProCard colSpan={6}>
            <div onClick={() => { history.push('/earning-report/community-store-purchase-performance-sheet') }}>
              <BarChartOutlined className={styles.img} />
              <div className={styles.title}>业绩报表</div>
            </div>
          </ProCard>
          <ProCard colSpan={6}>
            <div onClick={() => { history.push('/delivery-order-management/delivery-order-management') }}>
              <FileDoneOutlined className={styles.img} />
              <div className={styles.title}>配送单管理</div>
            </div>
          </ProCard>
          <ProCard colSpan={6}>
            <div onClick={() => { history.push('/setting/account-info') }}>
              <ContactsOutlined className={styles.img} />
              <div className={styles.title}>账户设置</div>
            </div>
          </ProCard>
        </ProCard>
        <ProCard
          title="站内信"
          type="inner"
          bordered
          extra={
            <a onClick={()=>{history.push('/mail/mail-list')}}>查看更多</a>
          }
          colSpan={{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }}
        >
          {
            data.length !== 0?
            <Typography>
              {
                data?.map((item, idx) => (
                  <Paragraph
                    key={idx}
                    className={styles.mailContent}
                  >
                    <Text
                      style={{ width:'80%'}}
                      ellipsis={true}
                    >
                      {item.copywritingContent}
                    </Text>
                    <span>{item?.sendTime}</span>
                  </Paragraph>
                ))
              }
            </Typography>:
            <div className={styles.mail}>
              <Empty/>
            </div>
          }
        </ProCard>
      </ProCard>
    </PageContainer>

  )
}

export default WorkPlace
