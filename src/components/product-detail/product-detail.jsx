import React, { useState, useEffect } from 'react';
import { Form, Image } from 'antd';
import { amountTransform } from '@/utils/utils'
import { EyeOutlined } from '@ant-design/icons';
import Table from './table';
import styles from './style.less';

export default (props) => {
  const { detailData } = props;
  const [tableHead, setTableHead] = useState([]);
  const [tableData, setTableData] = useState([]);
  const { goods } = detailData;
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
    layout: {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
    }
  };

  useEffect(() => {
    if (detailData) {
      const { specName, specValues, specData } = detailData;

      if (detailData.isMultiSpec) {
        const specValuesMap = {};
        Object.values(specValues).forEach(element => {
          const obj = Object.entries(element);
          obj.forEach(item => {
            // eslint-disable-next-line prefer-destructuring
            specValuesMap[item[0]] = item[1];
          })

        });
        setTableHead(Object.values(specName))
        setTableData(Object.entries(specData).map(item => {
          const specDataKeys = item[0].substring(1).split('|');
          const specValue = {};
          specDataKeys.forEach(it => {
            const index = it.slice(0, 1)
            specValue[index] = it
          })
          return {
            ...item[1],
            code: item[0],
            retailSupplyPrice: amountTransform(item[1].retailSupplyPrice, '/'),
            wholesaleSupplyPrice: amountTransform(item[1].wholesaleSupplyPrice, '/'),
            wholesaleMinNum: item[1].wholesaleMinNum,
            // suggestedRetailPrice: amountTransform(item[1].suggestedRetailPrice, '/'),
            // wholesalePrice: amountTransform(item[1].wholesalePrice, '/'),
            // salePrice: amountTransform(item[1].salePrice, '/'),
            // marketPrice: amountTransform(item[1].marketPrice, '/'),
            key: item[1].skuId,
            imageUrl: item[1].imageUrl,
            spec1: specValuesMap[specDataKeys[0]],
            spec2: specValuesMap[specDataKeys[1]],
            specValue,
          }
        }))
      }
    }

  }, [detailData]);

  return (
    <Form
      {...formItemLayout}
    >
      <Form.Item
        label="商品名称"
      >
        {goods.goodsName}
      </Form.Item>
      <Form.Item
        label="商品品类"
      >
        {`${goods.gcId1Display}/${goods.gcId2Display}`}
      </Form.Item>
      <Form.Item
        label="平均运费(元)"
      >
        {amountTransform(goods.wholesaleFreight, '/')}
      </Form.Item>
      <Form.Item
        label="商品开票税率(%)"
      >
        {amountTransform(goods.wholesaleTaxRate)}
      </Form.Item>
      {goods.goodsDesc &&
        <Form.Item
          label="商品副标题"
        >
          {goods.goodsDesc}
        </Form.Item>
      }
      <Form.Item
        label="商品编号"
      >
        {goods.supplierSpuId}
      </Form.Item>

      {goods.brandIdDisplay &&
        <Form.Item
          label="商品品牌"
        >
          {goods.brandIdDisplay}
        </Form.Item>}
      <Form.Item
        label="供货类型"
      >
        {{ 0: '批发+零售', 1: '仅批发', 2: '零售' }[goods.goodsSaleType]}
      </Form.Item>
      <Form.Item
        label="规格属性"
      >
        {{ 0: '单规格', 1: '多规格' }[detailData.isMultiSpec]}
      </Form.Item>

      {
        detailData.isMultiSpec === 1
          ?
          <>
            {!!tableData.length && <Form.Item label=" " colon={false}><Table tableHead={tableHead} tableData={tableData} /></Form.Item>}
          </>
          :
          <>
            <Form.Item
              label="货号"
            >
              {goods.supplierSkuId}
            </Form.Item>
            <Form.Item
              label="可用库存"
            >
              {goods.stockNum}
            </Form.Item>
            {
              !!goods.stockAlarmNum &&
              <Form.Item
                label="库存预警值"
              >
                {goods.stockAlarmNum}
              </Form.Item>
            }

            {goods.goodsSaleType === 0 && <Form.Item
              label="零售供货价(元)"
            >
              {amountTransform(goods.retailSupplyPrice, '/')}
            </Form.Item>}

            <Form.Item
              label="批发供货价(元)"
            >
              {amountTransform(goods.wholesaleSupplyPrice, '/')}
            </Form.Item>
            <Form.Item
              label="最低批发量"
            >
              {goods.wholesaleMinNum}
            </Form.Item>


          </>
      }
      <Form.Item
        label="单SKU起售数量"
      >
        {goods.buyMinNum}
      </Form.Item>

      {/* <Form.Item
        label="单次最多零售购买数量"
      >
        {goods.buyMaxNum}
      </Form.Item> */}

      <Form.Item
        label="是否包邮"
      >
        {{ 0: '不包邮', 1: '包邮', }[goods.isFreeFreight]}
      </Form.Item>

      {detailData.freightTemplateName &&
        <Form.Item
          label="运费模板"
        >
          {detailData.freightTemplateName}
        </Form.Item>}

      <Form.Item
        label="七天无理由退货"
      >
        {{ 0: '不支持', 1: '支持', }[goods.supportNoReasonReturn]}
      </Form.Item>

      {goods.goodsRemark
        &&
        <Form.Item
          label="特殊说明"
        >
          {goods.goodsRemark}
        </Form.Item>
      }

      <Form.Item
        label="商品主图"
        name="primaryImages"
      >
        {
          detailData.primaryImages.map(item => (
            <div
              style={{ marginRight: 10, display: 'inline-block' }}
              key={item.imageSort}
            >
              <Image width={100} height={100} src={item.imageUrl} />
            </div>
          ))
        }
      </Form.Item>
      <Form.Item
        label="商品详情"
      >
        {
          detailData.detailImages.map(item => (
            <div
              style={{ marginRight: 10, display: 'inline-block' }}
              key={item.imageSort}
            >
              <Image width={100} height={100} src={item.imageUrl} />
            </div>
          ))
        }
      </Form.Item>
      {!!detailData.advImages.length &&
        <Form.Item
          label="商品横幅"
        >
          {
            detailData.advImages.map(item => (
              <div
                style={{ marginRight: 10, display: 'inline-block' }}
                key={item.imageSort}
              >
                <Image width={100} height={100} src={item.imageUrl} />
              </div>
            ))
          }
        </Form.Item>
      }
      {detailData.videoUrl &&
        <Form.Item
          label="商品视频"
        >
          <div className={styles.video_preview}>
            <video width="100%" height="100%" src={detailData.videoUrl} />
            <div>
              <EyeOutlined onClick={() => { window.open(detailData.videoUrl, '_blank') }} style={{ color: '#fff', cursor: 'pointer' }} />
            </div>
          </div>
        </Form.Item>}

      <Form.Item
        label="创建时间"
      >
        {goods.createTimeDisplay}
      </Form.Item>

      <Form.Item
        label="审核状态"
      >
        {goods.goodsVerifyStateDisplay}
      </Form.Item>

      <Form.Item
        label="上架状态"
      >
        {goods.goodsStateDisplay}
      </Form.Item>

      {goods.goodsVerifyRemark && <Form.Item
        label="原因"
      >
        <span style={{ color: 'red' }}>{goods.goodsVerifyRemark}</span>
      </Form.Item>}
    </Form>
  );
};