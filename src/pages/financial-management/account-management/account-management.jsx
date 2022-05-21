import React, { useState, useEffect } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import ProCard from '@ant-design/pro-card'
import { 
  ModalForm,
  ProFormDigit, 
  ProFormText, 
  ProFormRadio, 
  ProFormSelect,
  ProFormCaptcha
} from '@ant-design/pro-form'
import {
  Button,
  message, 
  Space
} from 'antd'
import { history } from 'umi'
import md5 from 'blueimp-md5'

import styles from './styles.less'
import { 
  accountManagement, 
  apply, 
  query, 
  unbind, 
  bind, 
  unBindSendSms, 
  findAllBanks 
} from '@/services/financial-management/account-management'
import { amountTransform } from '@/utils/utils'

const { Group } = ProFormRadio

const PopUnbind = ({data})=> {
  const unBindAccount = ()=> {
    unBindSendSms().then(res=> {
      res?.success && message.success('验证码发送成功!')
    })
  }
  return(
    <>
      <ProFormText
        name="mobile"
        initialValue={data?.mobile}
        label="手机"
        width="md"
        readonly
      />
      <ProFormCaptcha
        name="verifyCode"
        label="验证码"
        rules={[
          {
            required: true,
            message: '请输入验证码',
          },
        ]}
        placeholder="请输入验证码"
        onGetCaptcha={async ()=> {
          await unBindAccount()
        }}
      />
    </>
  )
}

const PopBind = ({data, bankList})=> {
  return(
    <>
      <ProFormText
        name="cardName"
        initialValue={data?.subject}
        label="商家主体名称"
        width="md"
        readonly
      />
      <p className={styles.txt}>对公账户的绑定仅支持此商家主体名下银行账户，对私账户的绑定仅支持此商家主体法人代表名下的银行账户</p>
      <Group
        name="bankAcctType"
        label="账户性质"
        rules={[
          {
            required: true,
            message: '请选择账户性质'
          }
        ]}
         options={[
           {
             label: '公司户',
             value: 'business',
           },
           {
             label: '个人户',
             value: 'person',
           }
         ]}
      />
      <ProFormText
        width="md"
        name="realname"
        label="账户名称"
        rules={[
          {
            required: true,
            message: '请输入账户名称',
          }
        ]}
        placeholder="请输入账户名称"
      />
      <ProFormSelect
        width="md"
        label="开户银行"
        name="bankName"
        options={bankList?.map(item => (
          {label: item.bankName, value: item.bankCode}
        ))}
        rules={[
          {
            required: true,
            message: '请选择开户银行',
          }
        ]}
      />
      <ProFormText
        width="md"
        name="cardNo"
        label="账户号码"
        rules={[
          {
            required: true,
            message: '请输入账户号码',
          }
        ]}
        placeholder="请输入账户号码"
      />
    </>
  )
}

const PopModal = ({val, change, num})=> {
  const [bankList, setBankList] = useState([])
  useEffect(()=> {
    findAllBanks().then(res=> {
      if(res?.success) setBankList(res?.data)
    })
    return ()=> {
      setBankList([])
    }
  },[])
  const btnContent = ()=> {
    if(val?.id) {
      return '验证码'
    } else {
      return '帐户绑定'
    }
  }

  const btnText = ()=> {
    if(val?.id) {
      return '解绑'
    } else {
      return '用户绑定'
    }
  }

  const submitCode = (v)=> {
    if(val?.id) {
      unbind({id: val?.id, ...v}).then(res=> {
        if(res?.success) {
          change(num + 1)
          message.success('提交成功')
        }
      })
    } else {
      const bankObj = bankList.filter(item=> item.bankCode === v.bankName)[0]
      bind({
        ...v,
        bankCode: bankObj.bankCode,
        bankName: bankObj.bankName
      }).then(res=> {
        if(res?.success) {
          change(num + 1)
          message.success('提交成功')
        }
      })
    }
  }
  return (
    <ModalForm
      title={btnContent()}
      layout='horizontal'
      width={val?.id ? 500 : 650}
      trigger={
        <Button type="default">{btnText()}</Button>
      }
      modalProps={{
        destroyOnClose: true
      }}
      onFinish={async (values) => {
        await submitCode(values)
        return true
      }}
    >
      {
        val?.id ? <PopUnbind data={val}/>: 
        <PopBind data={val} bankList={bankList}/>
      }
    </ModalForm>
  )
}

const AccountManagement = () => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)
  const [change, setChange] = useState(1)
  const [accountData, setAccountData] = useState('')
  const [flag, setFlag] = useState(false)

  const skipToSetting = (flag) => {
    if(flag) message.error('请先设置交易密码')
    history.push(`/setting/trade-password`)
  }

  const WithdrawalModal = ({ val, change, update }) => {

    const withdrawal = (v) => {
      const money = amountTransform(v.amount, '*')
      const { payPassword } = v
      apply({
        amount: money,
        payPassword: md5(payPassword)
      }).then(res=> {
        if(res?.success){
          update(change + 1)
          message.success('提现成功')
        }
      })
    }
    return (
      <ModalForm
        title="提现"
        layout='horizontal'
        width={500}
        trigger={
          <Button type='primary'>提现</Button>
        }
        modalProps={{
          destroyOnClose: true
        }}
        onFinish={async (values) => {
          await withdrawal(values)
          return true
        }}
      >
        <Space align="baseline">
          <ProFormDigit
            label="提现金额"
            name="amount"
            rules={[{required: true }]}
            width="md"
          />
          <span>元</span>
        </Space>
        <ProFormText.Password
          name="payPassword"
          label="交易密码"
          rules={[{required: true }]}
          width="md"
          fieldProps={{
            autoComplete: 'new-password'
          }}
        />
        <div className={styles.setPassword}>
          <a onClick={()=>{skipToSetting(false)}}>忘记密码？</a>
        </div>
        <ProFormText
          name="realName"
          label="提现账户名"
          initialValue={val?.realname}
          readonly
        />
        <ProFormText
          name="cardNo"
          initialValue={val?.cardNo}
          label="提现账号"
          readonly
        />
        <ProFormText
          name="bankName"
          label="所属银行"
          initialValue={val?.bankName}
          readonly
        />
        <ProFormText
          name="balanceAvailable"
          label="可提现金额"
          initialValue={`￥${amountTransform(Number(val?.balanceAvailable), '/')}`}
          readonly
        />
      </ModalForm>
    )
  }

  useEffect(() => {
    setLoading(true)
    accountManagement().then(res => {
      if (res.success) {
        setData(res?.data)
      }
    }).finally(() => {
      setLoading(false)
    })
    return () => {
      setData({})
    }
  }, [change])

  useEffect(()=>{
    setFlag(true)
    query().then(res=> {
      if(res?.success) setAccountData(res?.data)
    }).finally(()=> {
      setFlag(false)
    })
    return ()=> {
      setAccountData('')
    }
  }, [change])

  const skipToDetail = ({amountType}) => {
    const type = !amountType ? '' : `amountType=${amountType}`
    history.push(`/financial-management/transaction-details?${type}`)
  }

  return (
    <PageContainer title={false}>
      <ProCard gutter={[24, 24]}>
        <ProCard
          colSpan={{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }}
          bordered
          title='运营中心虚拟子账户'
          loading={loading}
        >
          <div className={styles.withdrawal}>
            {
              data?.cardNo &&
              (data?.isSetPassword ?
              <WithdrawalModal
                val={data}
                update={setChange}
                change={change}
              />:
              <Button type='primary' onClick={()=>{skipToSetting(true)}}>提现</Button>)
            }
          </div>
          <div className={styles.platform}>
            <div>账户号码： </div>
            <div><span className={styles.sn}>{data?.sn}</span></div>
            <div className={styles.balance}>
              <div>
                总余额： <span>{amountTransform(Number(data?.balance), '/')}</span>
              </div>
              <Button
                onClick={() => skipToDetail({})}
              >
                交易明细
              </Button>
            </div>
            <div className={styles.balance}>
              <Space size="middle">
                <span>可提现余额：{amountTransform(Number(data?.balanceAvailable), '/')}</span>
                <Button
                  onClick={() => skipToDetail({amountType: 'available'})}
                >
                  交易明细
                </Button>
              </Space>
              <Space size="middle">
                <span>冻结余额：{amountTransform(Number(data?.balanceFreeze), '/')}</span>
                <Button onClick={() => skipToDetail({amountType: 'freeze'})}>
                  交易明细
                </Button>
              </Space>
            </div>
          </div>
        </ProCard>
        <ProCard
          colSpan={{ xs: 24, sm: 12, md: 12, lg: 12, xl: 12 }}
          bordered
          title='银行账户'
          loading={flag}
          extra={
            <PopModal val={accountData} change={setChange} num={change}/>
          }
        >
          <div className={styles.bindCard}>
            <div>账户名称： <span>{accountData?.cardName}</span></div>
            <div>账户号码： <span>{accountData?.cardNo}</span></div>
            <div>开户银行： <span>{accountData?.bankName}</span></div>
          </div>
        </ProCard>
      </ProCard>
    </PageContainer>
  )
}

export default AccountManagement
