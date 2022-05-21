import React from 'react';
import ProForm, {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-form';

export default (props) => {
  const { visible, setVisible, getData, goodsSaleType } = props;
  return (
    <ModalForm
      title="生成规格配置表"
      modalProps={{
        width: 740,
      }}
      onFinish={async (values) => {
        getData(values)
        return true;
      }}
      onVisibleChange={setVisible}
      visible={visible}
      initialValues={{

      }}
    >
      <p>请输入要批量填写的规格参数。</p>
      <p style={{ color: 'red' }}>若已输入规格参数，重新批量填写会将已有的规格参数全部重置，请确认后操作！</p>
      <ProForm.Group>
        {goodsSaleType !== 1 && <ProFormText
          width="md"
          name="retailSupplyPrice"
          label="零售供货价(元)"
          placeholder="请输入零售供货价"
          rules={[{ required: true, message: '请输入零售供货价' }]}
        />}
        {goodsSaleType !== 2 && <ProFormText
          width="md"
          name="wholesaleSupplyPrice"
          label="批发供货价(元)"
          placeholder="请输入批发供货价"
          rules={[{ required: true, message: '请输入批发供货价' }]}
        />}
      </ProForm.Group>
      <ProForm.Group>
        {goodsSaleType !== 2 && <ProFormText
          width="md"
          name="wholesaleMinNum"
          label="最低批发量"
          placeholder="请输入最低批发量"
          rules={[{ required: true, message: '请输入最低批发量' }]}
        />}
        <ProFormText
          width="md"
          name="stockAlarmNum"
          label="库存预警值"
          placeholder="请输入库存预警值"
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="stockNum"
          label="可用库存"
          placeholder="请输入可用库存"
          rules={[{ required: true, message: '请输入可用库存' }]}
        />
      </ProForm.Group>
    </ModalForm >
  );
};