import React, { useEffect, useState } from 'react';
import { Form,Select } from 'antd';
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
} from '@ant-design/pro-form';

import { getExpressList } from '@/services/common'
const { Option } = Select;

export default (props) => {
  const { visible, setVisible, callback = () => {}, data } = props;
  const [expressList, setExpressList] = useState([]);
  const [form] = Form.useForm()

  useEffect(() => {
    if (data?.expressId && data?.expressNo) {
      form.setFieldsValue({
        ...data,
      })
    }
  }, [data])

  useEffect(() => {
    getExpressList()
      .then(res => {
        if (res.code === 0) {
          setExpressList(res.data.records.companyList)
        }
      });
  }, [])

  //标题验证规则
  const checkConfirm=(rule, value, callback)=>{
    return new Promise(async (resolve, reject) => {
      if (value&&!/^[A-Za-z0-9]+$/.test(value)) {
          await reject('只能输入字母和数字')
      }
      await resolve()
    })
  }

  return (
    <ModalForm
      title="物流信息"
      modalProps={{
        width: 500,
      }}
      form={form}
      onFinish={async (values) => {
        var logistics=expressList.find(item => item.id === values.expressId)
        callback({
          ...values,
          expressName: logistics?.expressName,
          expressType:logistics?.expressType
        })
        return true;
      }}
      onVisibleChange={setVisible}
      visible={visible}
      initialValues={{
        method: 1,
      }}
    >
      {/* <ProFormRadio.Group
        name="method"
        label="物流方式"
        options={[
          {
            label: '快递',
            value: 1,
          },
        ]}
      /> */}
      <Form.Item 
        name="expressId"
        label="快递公司"
        rules={[{ required: true, message: '请选择快递公司' }]}
        >
        <Select
          showSearch
          placeholder="输入快递名称"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.label.indexOf(input) >= 0
          }
          options={
            expressList.map(item => ({ label: item.expressName, value: item.id }))
          }
        />
      </Form.Item>
      <ProFormText
        name="expressNo"
        label="快递单号"
        placeholder="请输入快递单号"
        rules={[
          { required: true, message: '请输入快递单号' },
          { validator: checkConfirm}
        ]}
        fieldProps={{
          maxLength: 50,
        }}
      />
    </ModalForm >
  );
};