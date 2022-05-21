import React, { useState, useEffect, useRef } from 'react';
import { Typography, Form, Space, Image, Input, DatePicker, Button, Checkbox } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { detailExt } from '@/services/common';
import ProForm, {
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormSelect,
  ProFormDigit,
  ProFormDependency
} from '@ant-design/pro-form';
import moment from 'moment';
import Big from 'big.js';
import Address from './address';
import Upload from '@/components/upload';
import { getBanks, editSupplier } from '@/services/setting/account-info';


const SocialCreditInfo = ({ value, onChange }) => {
  const [code, setCode] = useState(value?.code);
  const [date, setDate] = useState(value?.date);

  const codeChange = (e) => {
    setCode(e.target.value);
    onChange({
      code: e.target.value,
      date,
    })
  }

  const dateChange = (e) => {
    setDate(e);
    onChange({
      code,
      date: e,
    })
  }

  const modeChange = (e) => {
    if (e.target.checked) {
      dateChange(moment('2099-12-31'))
    } else {
      dateChange(moment())
    }
  }

  useEffect(() => {
    setCode(value?.code)
    setDate(value?.date)
  }, [value])

  return (
    <Space>
      <Input placeholder="请输入统一社会信用码" value={code} style={{ width: 230 }} onChange={codeChange} />
      <DatePicker placeholder="请选择统一社会信用证有效期" value={date} style={{ width: 230 }} onChange={dateChange} />
      <Checkbox checked={date?.isSame?.('2099-12-31')} onChange={modeChange}>长期</Checkbox>
    </Space>
  )
}

const LegalInfo = ({ value, onChange }) => {
  const [code, setCode] = useState(value?.code);
  const [date, setDate] = useState(value?.date);
  const [userName, setUserName] = useState(value?.userName);

  const codeChange = (e) => {
    setCode(e.target.value);
    onChange({
      code: e.target.value,
      date,
      userName,
    })
  }

  const userNameChange = (e) => {
    setUserName(e.target.value);
    onChange({
      code,
      date,
      userName: e.target.value,
    })
  }

  const dateChange = (e) => {
    setDate(e)
    onChange({
      code,
      userName,
      date: e,
    })
  }

  useEffect(() => {
    setCode(value?.code)
    setDate(value?.date)
    setUserName(value?.userName)
  }, [value])
  return (
    <Space>
      <Input value={userName} placeholder="请输入姓名" style={{ width: 100 }} onChange={userNameChange} />
      <Input value={code} placeholder="请输入身份证号码" style={{ width: 150 }} onChange={codeChange} />
      <DatePicker value={date} placeholder="请输入身份证号码有效期" style={{ width: 200 }} onChange={dateChange} />
    </Space>
  )
}

const ImageInfo = ({ value, onChange, bankAccountType, bindBankSwitch }) => {
  const [businessLicense, setBusinessLicense] = useState(value?.businessLicense);
  const [idCardFrontImg, setIdCardFrontImg] = useState(value?.idCardFrontImg);
  const [idCardBackImg, setIdCardBackImg] = useState(value?.idCardBackImg);
  const [bankLicenseImg, setBankLicenseImg] = useState(value?.bankLicenseImg);
  const [bankCardFrontImg, setBankCardFrontImg] = useState(value?.bankCardFrontImg);
  const [bankCardBackImg, setBankCardBackImg] = useState(value?.bankCardBackImg);
  const update = (obj) => {
    onChange({
      idCardFrontImg,
      businessLicense,
      idCardBackImg,
      bankLicenseImg,
      bankCardFrontImg,
      bankCardBackImg,
      ...obj,
    })
  }
  const businessLicenseChange = (e) => {
    setBusinessLicense(e)
    update({
      businessLicense: e,
    })
  }
  const idCardFrontImgChange = (e) => {
    setIdCardFrontImg(e)
    update({
      idCardFrontImg: e,
    })
  }
  const idCardBackImgChange = (e) => {
    setIdCardBackImg(e)
    update({
      idCardBackImg: e,
    })
  }
  const bankLicenseImgChange = (e) => {
    setBankLicenseImg(e)
    update({
      bankLicenseImg: e,
    })
  }
  const bankCardFrontImgChange = (e) => {
    setBankCardFrontImg(e)
    update({
      bankCardFrontImg: e,
    })
  }
  const bankCardBackImgChange = (e) => {
    setBankCardBackImg(e)
    update({
      bankCardBackImg: e,
    })
  }
  useEffect(() => {
    setBusinessLicense(value?.businessLicense)
    setIdCardFrontImg(value?.idCardFrontImg)
    setIdCardBackImg(value?.idCardBackImg)
    setBankLicenseImg(value?.bankLicenseImg)
    setBankCardFrontImg(value?.bankCardFrontImg)
    setBankCardBackImg(value?.bankCardBackImg)
  }, [value])
  return (
    <div>
      <Space>
        <Upload code={301} value={businessLicense} text="上传三合一证件照" maxCount={1} size={2 * 1024} accept="image/*" onChange={businessLicenseChange} />
        <Upload code={302} value={idCardFrontImg} text="上传法人身份证正面照" maxCount={1} size={2 * 1024} accept="image/*" onChange={idCardFrontImgChange} />
        <Upload code={302} value={idCardBackImg} text="上传法人身份证背面照" maxCount={1} size={2 * 1024} accept="image/*" onChange={idCardBackImgChange} />
        {bindBankSwitch === 1 && <>
          {
            bankAccountType === 1
              ?
              <Upload key="1" code={303} value={bankLicenseImg} text="上传开户银行许可证照" maxCount={1} size={2 * 1024} accept="image/*" onChange={bankLicenseImgChange} />
              :
              <Upload key="2" code={303} value={bankCardFrontImg} text="上传结算银行卡正面照" maxCount={1} size={2 * 1024} accept="image/*" onChange={bankCardFrontImgChange} />
          }
        </>}

      </Space>
      {
        bindBankSwitch === 1 && <>
          {bankAccountType === 2 && <Space>
            <Upload code={303} value={bankCardBackImg} text="上传结算银行卡背面照" maxCount={1} size={2 * 1024} accept="image/*" onChange={bankCardBackImgChange} />
          </Space>}
        </>
      }

    </div>

  )
}


const { Title } = Typography;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
  layout: {
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 14,
    },
  }
};
const TableList = () => {
  const [detailData, setDetailData] = useState({});
  const [form] = Form.useForm();

  const getDetail = () => {
    detailExt().then(res => {
      if (res.code === 0) {
        const data = res.data.records
        setDetailData({
          ...data,
        })

        form.setFieldsValue({
          ...data
        })

        // const { warrantyRatioDisplay, defaultWholesaleTaxRateDisplay, bankAccountInfo } = data

        // form.setFieldsValue({
        //   warrantyRatio: warrantyRatioDisplay,
        //   defaultWholesaleTaxRate: defaultWholesaleTaxRateDisplay,
        //   bindBankSwitch: bankAccountInfo.bindBankSwitch
        // })

        // if (bankAccountInfo) {
        //   const {
        //     provinceCode,
        //     areaCode,
        //     companyAddress,
        //     socialCreditCode,
        //     socialCreditCodeExpire,
        //     businessScope,
        //     legalName,
        //     legalIdCardNo,
        //     legalIdCardExpire,
        //     legalPhone,
        //     businessLicense,
        //     bankLicenseImg,
        //     idCardBackImg,
        //     idCardFrontImg,
        //     bankCardFrontImg,
        //     bankCardBackImg,
        //     bankCode,
        //     bankName,
        //     bankAccountType,
        //     bankCardNo,
        //     bankAccountName,
        //   } = bankAccountInfo
        //   form.setFieldsValue({
        //     addressInfo: {
        //       area: provinceCode ? [provinceCode, areaCode] : [],
        //       info: companyAddress,
        //     },
        //     socialCreditInfo: {
        //       code: socialCreditCode,
        //       date: socialCreditCodeExpire ? moment(socialCreditCodeExpire) : '',
        //     },
        //     businessScope,
        //     legalInfo: {
        //       code: legalIdCardNo,
        //       userName: legalName,
        //       date: legalIdCardExpire ? moment(legalIdCardExpire) : ''
        //     },
        //     legalPhone,
        //     imageInfo: {
        //       businessLicense: businessLicense?.[0],
        //       bankLicenseImg: bankLicenseImg?.[0],
        //       idCardFrontImg: idCardFrontImg?.[0],
        //       idCardBackImg: idCardBackImg?.[0],
        //       bankCardBackImg: bankCardBackImg?.[0],
        //       bankCardFrontImg: bankCardFrontImg?.[0],
        //     },
        //     bankCode: { label: bankName, value: bankCode },
        //     bankAccountType,
        //     bankCardNo,
        //     bankAccountName: bankAccountType === 1 ? data.companyName : bankAccountName,
        //   })
        // }

      }
    })
  }

  const companyNameChange = (e) => {
    form.setFieldsValue({
      bankAccountName: e.target.value
    })
  }


  const bankAccountTypeChange = (e) => {
    if (e.target.value === 1) {
      form.setFieldsValue({
        bankAccountName: form.getFieldValue('companyName')
      })
    }
  }

  const submit = () => {
    let obj = {};
    const {
      addressInfo,
      socialCreditInfo,
      businessScope,
      legalInfo,
      legalPhone,
      bindBankSwitch,
      bankAccountType,
      imageInfo,
      bankCode,
      bankCardNo,
      bankAccountName,
      ...rest
    } = form.getFieldsValue();
    obj = {
      ...rest,
    }

    if (detailData.accountSwitch === 1) {
      obj = {
        ...rest,
        businessScope,
        legalPhone,
        bindBankSwitch,
        bankAccountType,
        bankCardNo,
        bankAccountName,
        bankCode: bankCode?.value,
        bankName: bankCode?.label,
        businessLicense: [imageInfo?.businessLicense],
        idCardFrontImg: [imageInfo?.idCardFrontImg],
        idCardBackImg: [imageInfo?.idCardBackImg],
        bankLicenseImg: [imageInfo?.bankLicenseImg],
        bankCardFrontImg: [imageInfo?.bankCardFrontImg],
        bankCardBackImg: [imageInfo?.bankCardBackImg],
        legalName: legalInfo?.userName,
        legalIdCardNo: legalInfo?.code,
        legalIdCardExpire: moment(legalInfo?.date)?.format?.('YYYYMMDD'),
        socialCreditCode: socialCreditInfo?.code,
        socialCreditCodeExpire: moment(socialCreditInfo?.date)?.format?.('YYYYMMDD'),
        provinceCode: addressInfo?.area?.[0],
        areaCode: addressInfo?.area?.[1],
        companyAddress: addressInfo?.info,
      }
    }

    editSupplier(obj, { showSuccess: true })
      .then(res => {
        if (res.code === 0) {
          getDetail()
        }
      });
  }
  
  const disable = () => {
    return true;
    // if (detailData.accountSwitch !== 1) {
    //   return true;
    // }
    // return detailData?.bankAccountInfo?.auditStatus === 1 || detailData?.bankAccountInfo?.auditStatus === 0;
  }

  useEffect(() => {
    getDetail()
  }, [])

  return (
    <PageContainer>
      <div style={{ backgroundColor: '#fff', padding: 10 }}>
        <ProForm
          {...formItemLayout}
          form={form}
          onFinish={() => {
            submit();
          }}
          submitter={{
            render: (props) => {
              return null;
              // if (detailData.accountSwitch !== 1) {
              //   return null;
              // }
              // return (detailData?.bankAccountInfo?.auditStatus !== 1 && detailData?.bankAccountInfo?.auditStatus !== 4) ? <div style={{ textAlign: 'center', margin: '30px 0' }}>
              //   <Button type="primary" onClick={() => { props.submit() }}>确定</Button>
              // </div> : null
            }
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Title level={4}>基本信息</Title>
            {/* {
              detailData.accountSwitch === 1 &&
              <div>企业开户信息 &gt; {{
                0: '待提交',
                1: '开户成功',
                2: '待审核',
                3: '开户失败',
                4: '待开户',
                5: '审核拒绝'
              }[detailData?.bankAccountInfo?.auditStatus]}</div>
            } */}
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <ProFormText
                name="companyName"
                label="运营商名称"
                placeholder="请输入运营商名称"
                rules={[{ required: true, message: '请输入运营商名称' }]}
                fieldProps={{
                  maxLength: 30,
                  onChange: companyNameChange,
                }}
                disabled={disable()}
              />
              <ProFormText
                name="accountName"
                label="运营商登录账号"
                placeholder="请输入运营商登录账号"
                rules={[{ required: true, message: '请输入运营商登录账号' }]}
                fieldProps={{
                  maxLength: 18,
                }}
                disabled
              />
              <ProFormText
                name="companyUserName"
                label="运营商联系人"
                placeholder="请输入运营商联系人"
                rules={[{ required: true, message: '请输入运营商联系人' }]}
                fieldProps={{
                  maxLength: 10,
                }}
                disabled={disable()}
              />
              <ProFormText
                name="companyUserPhone"
                label="联系人手机号"
                placeholder="请输入联系人手机号"
                rules={[{ required: true, message: '请输入联系人手机号' }]}
                fieldProps={{
                  maxLength: 11,
                }}
                // extra="此手机号会用做平台联系和对绑定的银行卡解绑确认"
                disabled={disable()}
              />
              <Form.Item
                label="经销商所管辖区域"
              >
                {detailData?.provinceName}{detailData?.cityName}{detailData?.areaName}
              </Form.Item>
              <Form.Item
                label="运营商编号"
              >
                {detailData?.opNo}
              </Form.Item>
            </div>
            <div style={{ flex: 1 }}>
              {/* <ProFormSelect
                name="defaultWholesaleTaxRate"
                label="商品开票税率(%)"
                fieldProps={{
                  allowClear: false,
                }}
                disabled={disable()}
                required
                options={[
                  {
                    label: '0%',
                    value: 0
                  },
                  {
                    label: '1%',
                    value: 1
                  },
                  {
                    label: '3%',
                    value: 3
                  },
                  {
                    label: '6%',
                    value: 6
                  },
                  {
                    label: '9%',
                    value: 9
                  },
                  {
                    label: '13%',
                    value: 13
                  }
                ]}
              />
              <ProFormDigit
                placeholder="请输入商品质保金比例"
                label={
                  <div style={{ position: 'relative', top: 10 }}>
                    <div>商品质保金比例</div>
                    <div style={{ fontSize: 12, color: '#888' }}>此部分金额需商品</div>
                    <div style={{ fontSize: 12, color: '#888' }}>过售后期才可提现</div>
                  </div>
                }
                name="warrantyRatio"
                min={0}
                max={50}
                fieldProps={{
                  // formatter: value => value ? +new Big(value).toFixed(2) : value
                }}
                disabled
                extra={<><span style={{ position: 'absolute', right: 30, top: 5 }}>%</span></>}
                step
                validateFirst
                rules={[
                  { required: true, message: '请输入商品质保金比例' },
                  () => ({
                    validator(_, value) {
                      if (!/^\d+\.?\d*$/g.test(value) || value < 0) {
                        return Promise.reject(new Error('请输入大于零或等于零的数字'));
                      }
                      return Promise.resolve();
                    },
                  })
                ]}
              />
              <div style={{ marginTop: '-20px' }}>
                <ProFormText
                  name="stockWarn"
                  label="商品预警量"
                  placeholder="请输入需要预警的商品数量"
                  validateFirst
                  disabled={disable()}
                  rules={[
                    () => ({
                      validator(_, value) {
                        if (!/^\d+\.?\d*$/g.test(value) || value < 0) {
                          return Promise.reject(new Error('请输入大于零或等于零的数字'));
                        }
                        return Promise.resolve();
                      },
                    })
                  ]}
                />
              </div> */}
            </div>
          </div>
          {/* {
            detailData.accountSwitch === 1 &&
            <>
              <div>
                <Title level={4}>资金账户信息</Title>
              </div>
              {
                (detailData?.bankAccountInfo?.auditStatus !== 1 && detailData?.bankAccountInfo?.auditStatus !== 4)
                  ?
                  <div style={{ display: 'flex' }}>
                    <div style={{ flex: 1 }}>
                      <Form.Item
                        label="企业地址"
                        name="addressInfo"
                        validateFirst
                        rules={[
                          () => ({
                            required: true,
                            validator(_, value = {}) {
                              const { area, info } = value;
                              if (area?.length === 0 || !area) {
                                return Promise.reject(new Error('请选择企业所在地'));
                              }

                              if (!info?.replace(/\s/g, '')) {
                                return Promise.reject(new Error('请输入企业详细地址'));
                              }

                              return Promise.resolve();
                            },
                          })]}
                      >
                        <Address />
                      </Form.Item>
                      <Form.Item
                        label="统一社会信用码"
                        name="socialCreditInfo"
                        validateFirst
                        rules={[{ required: true },
                        () => ({
                          validator(_, value = {}) {
                            const { code, date } = value;
                            if (!code?.replace(/\s/g, '')) {
                              return Promise.reject(new Error('请输入统一社会信用码'));
                            }
                            if (!date) {
                              return Promise.reject(new Error('请选择统一社会信用证有效期'));
                            }
                            return Promise.resolve();
                          },
                        })]}
                      >
                        <SocialCreditInfo />
                      </Form.Item>
                      <ProFormText
                        name="businessScope"
                        label="经营范围"
                        placeholder="请输入经营范围"
                        rules={[{ required: true, message: '请输入经营范围' }]}
                      />
                      <Form.Item
                        label="法人姓名"
                        name="legalInfo"
                        validateFirst
                        rules={[
                          () => ({
                            required: true,
                            validator(_, value = {}) {
                              const { code, date, userName } = value;
                              if (!userName?.replace(/\s/g, '')) {
                                return Promise.reject(new Error('请输入姓名'));
                              }

                              if (!code?.replace(/\s/g, '')) {
                                return Promise.reject(new Error('请输入身份证号码'));
                              }

                              if (!date) {
                                return Promise.reject(new Error('请选择身份证号码有效期'));
                              }
                              return Promise.resolve();
                            },
                          })
                        ]}
                      >
                        <LegalInfo />
                      </Form.Item>
                      <ProFormText
                        name="legalPhone"
                        label="法人手机号"
                        placeholder="请输入法人手机号"
                        rules={[{ required: true, message: '请输入法人手机号' }]}
                        fieldProps={{
                          maxLength: 11,
                        }}
                      />
                      <ProFormSelect
                        label="绑卡状态"
                        required
                        name="bindBankSwitch"
                        options={[
                          {
                            label: '暂不绑卡',
                            value: 0,
                          },
                          {
                            label: '现在绑卡',
                            value: 1,
                          }
                        ]}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <ProFormDependency name={['bindBankSwitch']}>
                        {
                          ({ bindBankSwitch }) => bindBankSwitch === 1 && <ProFormRadio.Group
                            name="bankAccountType"
                            label="结算银行账户类型"
                            rules={[{ required: true }]}
                            options={[
                              {
                                label: '对公账户',
                                value: 1,
                              },
                              {
                                label: '对私账户',
                                value: 2,
                              },
                            ]}
                            fieldProps={{
                              onChange: bankAccountTypeChange
                            }}
                          />
                        }
                      </ProFormDependency>

                      <ProFormDependency name={['bankAccountType', 'bindBankSwitch']}>
                        {
                          ({ bankAccountType, bindBankSwitch }) => (
                            <Form.Item
                              label={
                                <div style={{ position: 'relative', top: 20 }}>
                                  <div>开户资质文件</div>
                                  <div>jpg/png格式</div>
                                  <div>大小不超过2MB</div>
                                </div>
                              }
                              name="imageInfo"
                              validateFirst
                              rules={[
                                () => ({
                                  required: true,
                                  validator(_, value = {}) {
                                    const { businessLicense, idCardFrontImg, idCardBackImg, bankLicenseImg, bankCardFrontImg, bankCardBackImg } = value;
                                    if (!businessLicense) {
                                      return Promise.reject(new Error('请上传三合一证件照'));
                                    }
                                    if (!idCardFrontImg) {
                                      return Promise.reject(new Error('请上传法人身份证正面照'));
                                    }
                                    if (!idCardBackImg) {
                                      return Promise.reject(new Error('请上传法人身份证背面照'));
                                    }
                                    if (bindBankSwitch === 1) {
                                      if (!bankLicenseImg && bankAccountType === 1) {
                                        return Promise.reject(new Error('请上传开户银行许可证照'));
                                      }
                                      if (!bankCardFrontImg && bankAccountType === 2) {
                                        return Promise.reject(new Error('请上传结算银行卡正面照'));
                                      }
                                      if (!bankCardBackImg && bankAccountType === 2) {
                                        return Promise.reject(new Error('请上传结算银行卡背面照'));
                                      }
                                    }

                                    return Promise.resolve();
                                  },
                                })
                              ]}
                            >
                              <ImageInfo bankAccountType={bankAccountType} bindBankSwitch={bindBankSwitch} />
                            </Form.Item>
                          )
                        }
                      </ProFormDependency>


                      <ProFormDependency name={['bindBankSwitch']}>
                        {
                          ({ bindBankSwitch }) => bindBankSwitch === 1 && <>
                            <ProFormSelect
                              name="bankCode"
                              label="账户结算银行"
                              placeholder="请选择结算收款银行"
                              request={getBanks}
                              rules={[{ required: true, message: '请选择账户结算银行' }]}
                              fieldProps={{
                                labelInValue: true,
                              }}
                            />
                            <ProFormText
                              name="bankCardNo"
                              label="结算银行卡号"
                              placeholder="请输入结算银行卡号"
                              rules={[{ required: true, message: '请输入结算银行卡号' }]}
                            />
                            <ProFormDependency name={['bankAccountType']}>
                              {
                                ({ bankAccountType }) => (
                                  <ProFormText
                                    name="bankAccountName"
                                    label="结算银行卡开户名"
                                    placeholder="请输入结算银行卡开户名"
                                    rules={[{ required: true, message: '请输入结算银行卡开户名' }]}
                                    extra="银行账户类型为对公账户时，开户名为运营商企业名称"
                                    disabled={bankAccountType === 1}
                                  />
                                )
                              }
                            </ProFormDependency>
                          </>
                        }
                      </ProFormDependency>
                    </div>
                  </div>
                  :
                  <>
                    <div style={{ display: 'flex' }}>
                      <div style={{ flex: 1 }}>
                        <Form.Item
                          label="运营商名称"
                        >
                          {detailData.companyName}
                        </Form.Item>
                        <Form.Item
                          label="企业地址"
                        >
                          {detailData?.bankAccountInfo?.companyAddress}
                        </Form.Item>
                        <Form.Item
                          label="统一社会信用代码"
                        >
                          <span style={{ marginRight: 20 }}>{detailData?.bankAccountInfo?.socialCreditCode}</span>
                          有效期至：{moment(detailData?.bankAccountInfo?.socialCreditCodeExpire).format('YYYY-MM-DD')}
                        </Form.Item>
                        <Form.Item
                          label="经营范围"
                        >
                          {detailData?.bankAccountInfo?.businessScope}
                        </Form.Item>
                        <Form.Item
                          label="结算银行卡开户名"
                        >
                          {detailData?.bankAccountInfo?.bankAccountName}
                        </Form.Item>
                      </div>
                      <div style={{ flex: 1 }}>
                        <Form.Item
                          label="法人身份信息"
                        >
                          <span style={{ marginRight: 20 }}>{detailData?.bankAccountInfo?.legalName}</span>
                          <span style={{ marginRight: 20 }}>{detailData?.bankAccountInfo?.legalIdCardNo}</span>
                          有效期至：{moment(detailData?.bankAccountInfo?.legalIdCardExpire).format('YYYY-MM-DD')}
                        </Form.Item>
                        <Form.Item
                          label="法人手机号"
                        >
                          {detailData?.bankAccountInfo?.legalPhone}
                        </Form.Item>
                        <Form.Item
                          label="账户结算银行"
                        >
                          {detailData?.bankAccountInfo?.bankName}
                        </Form.Item>
                        <Form.Item
                          label="结算银行账户类型"
                        >
                          {{ 1: '对公账户', 2: '对私账户' }[detailData?.bankAccountInfo?.bankAccountType]}
                        </Form.Item>
                        <Form.Item
                          label="结算银行卡号"
                        >
                          {detailData?.bankAccountInfo?.bankCardNo}
                        </Form.Item>
                      </div>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <div style={{ flex: 1 }}>
                        <Form.Item
                          label="开户资质文件"
                        >
                          <Space style={{ display: 'flex' }}>
                            <Image src={detailData?.bankAccountInfo?.businessLicense?.[0]} width={150} height={150} />
                            <Image src={detailData?.bankAccountInfo?.idCardFrontImg?.[0]} width={150} height={150} />
                            <Image src={detailData?.bankAccountInfo?.idCardBackImg?.[0]} width={150} height={150} />
                          </Space>
                          <Space style={{ display: 'flex' }}>
                            {detailData?.bankAccountInfo?.bankLicenseImg?.[0] && <Image src={detailData?.bankAccountInfo?.bankLicenseImg?.[0]} width={150} height={150} />}
                            {detailData?.bankAccountInfo?.bankCardFrontImg?.[0] && <Image src={detailData?.bankAccountInfo?.bankCardFrontImg?.[0]} width={150} height={150} />}
                            {detailData?.bankAccountInfo?.bankCardBackImg?.[0] && <Image src={detailData?.bankAccountInfo?.bankCardBackImg?.[0]} width={150} height={150} />}
                          </Space>
                        </Form.Item>
                      </div>
                      <div style={{ flex: 1 }}></div>
                    </div>
                  </>
              }
            </>
          } */}
        </ProForm>
      </div>
    </PageContainer>
  );
};

export default TableList;
