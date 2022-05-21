import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Space, Tag, message, Modal } from 'antd';
import {
  DrawerForm,
  ProFormText,
  ProFormRadio,
  ProFormTextArea,
  ProFormDependency,
  ProFormSelect
} from '@ant-design/pro-form';
import { DeleteOutlined, EyeOutlined, ExclamationCircleOutlined, CloseOutlined } from '@ant-design/icons';
import Upload from '@/components/upload'
import { uploadImageFormatConversion, amountTransform } from '@/utils/utils'
import * as api from '@/services/product-management/product-list';
import NavigationPrompt from "react-router-navigation-prompt";
import styles from './edit.less'
import FormModal from './form';
import EditTable from './edit-table';
import GcCascader from '@/components/gc-cascader'
import BrandSelect from '@/components/brand-select'
// import FreightTemplateSelect from '@/components/freight-template-select'
import ImageSort from './image-sort';
import { detailExt } from '@/services/common';
import MultiCascader from 'rsuite/lib/MultiCascader';
import 'rsuite/lib/MultiCascader/styles';
import { arrayToTree } from '@/utils/utils'

import Look from '@/components/look';

const FromWrap = ({ value, onChange, content, right }) => (
  <div style={{ display: 'flex' }}>
    <div>{content(value, onChange)}</div>
    <div style={{ flex: 1, marginLeft: 10, minWidth: 180 }}>{right(value)}</div>
  </div>
)

export default (props) => {
  const { visible, setVisible, detailData, callback, onClose, supplierId } = props;
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [tableHead, setTableHead] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [areaData, setAreaData] = useState([]);
  const [selectAreaKey, setSelectAreaKey] = useState([]);
  const [lookVisible, setLookVisible] = useState(false);
  const [lookData, setLookData] = useState(false);
  const [form] = Form.useForm()
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
    layout: {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 16,
      },
    }
  };

  const urlsTransform = (urls) => {
    return urls.map((item, index) => {
      return {
        imageUrl: item,
        imageSort: index,
      }
    })
  }

  const getSubmitAreaData = (v) => {
    const arr = [];
    v.forEach(item => {
      let deep = 0;
      let node = window.yeahgo_area.find(it => it.id === item);
      const nodeIds = [node.id];
      const nodeNames = [node.name]
      while (node.pid) {
        deep += 1;
        node = window.yeahgo_area.find(it => it.id === node.pid);
        nodeIds.push(node.id);
        nodeNames.push(node.name);
      }
      arr.push({
        provinceId: nodeIds[deep],
        cityId: deep > 0 ? nodeIds[deep - 1] : 0,
        areaId: deep > 1 ? nodeIds[deep - 2] : 0,
        areaName: nodeNames.reverse().join('')
      })
    })

    return arr;
  }

  const getSubmitData = () => {
    const {
      videoUrl,
      gcId,
      primaryImages,
      detailImages,
      // advImages,
      isMultiSpec,
      // wholesalePrice,
      retailSupplyPrice,
      wholesaleSupplyPrice,
      // suggestedRetailPrice,
      salePrice,
      isFreeFreight,
      freightTemplateId,
      wholesaleFreight,
      wholesaleTaxRate,
      goodsSaleType,
      wholesaleMinNum,
      // marketPrice,
      ...rest } = form.getFieldsValue();
    const { specValues1, specValues2 } = form.getFieldsValue(['specValues1', 'specValues2']);
    const specName = {};
    const specValues = {};
    const specData = {};
    tableHead.forEach((item, index) => {
      if (item) {
        specName[index + 1] = item;
        if (!specValues[index + 1]) {
          specValues[index + 1] = {};
        }
        [specValues1, specValues2][index].forEach((item2, index2) => {
          specValues[index + 1][`${index + 1}0${index2 + 1}`] = item2.name
        })
      }
    })

    tableData.forEach(item => {
      const { code, key, spec1, spec2, specValue, retailSupplyPrice: retailSupplyPrices, wholesaleSupplyPrice: wholesaleSupplyPrices, ...rests } = item;
      const obj = {};

      if (goodsSaleType !== 1) {
        obj.retailSupplyPrice = amountTransform(retailSupplyPrices)
      }

      if (goodsSaleType !== 2) {
        obj.wholesaleSupplyPrice = amountTransform(wholesaleSupplyPrices)
      }

      specData[code] = {
        ...rests,
        specValue,
        imageUrl: item?.imageUrl,
        ...obj,
      }
    })


    const obj = {
      draftId: detailData?.draftId,
      isMultiSpec,
      goods: {
        ...rest,
        gcId1: gcId?.[0],
        gcId2: gcId?.[1],
        wholesaleTaxRate: amountTransform(wholesaleTaxRate, '/'),
        goodsSaleType,
      },
      primaryImages: primaryImages && urlsTransform(primaryImages),
      detailImages: detailImages && urlsTransform(detailImages),
      // advImages: advImages?.length ? urlsTransform(advImages) : null,
      videoUrl,
      supplierId: supplierId || ''
    };

    if (selectAreaKey.length) {
      obj.refuseArea = getSubmitAreaData(selectAreaKey)
    }


    if (freightTemplateId) {
      obj.goods.freightTemplateId = freightTemplateId.value;
      obj.goods.freightTemplateName = freightTemplateId.label;
    }

    if (goodsSaleType !== 2) {
      obj.goods.wholesaleFreight = amountTransform(wholesaleFreight)
      obj.goods.wholesaleMinNum = wholesaleMinNum
    }

    if (goodsSaleType !== 1) {
      obj.goods.isFreeFreight = isFreeFreight;
    }


    if (isMultiSpec) {
      obj.specName = specName;
      obj.specValues = specValues;
      // specData.specData = specValues
      // const specDataNew = specData
      // console.log('specDataNew', specDataNew)
      obj.specData = specData;

      // let errorMsg;
      // // eslint-disable-next-line no-restricted-syntax
      // for (const key in specData) {
      //   if (!specData[key].retailSupplyPrice && !errorMsg) {
      //     errorMsg = '请填写供货价'
      //   }
      // }

      // if (errorMsg) {
      //   message.error(errorMsg)
      //   return Promise.reject();
      // }
    } else {
      if (goodsSaleType !== 1) {
        obj.goods.retailSupplyPrice = amountTransform(retailSupplyPrice);
      }
      obj.goods.wholesaleSupplyPrice = amountTransform(wholesaleSupplyPrice);
    }
    // obj.goods.wholesalePrice = amountTransform(wholesalePrice);
    // obj.goods.retailSupplyPrice = amountTransform(retailSupplyPrice);
    // obj.goods.suggestedRetailPrice = amountTransform(suggestedRetailPrice);
    // obj.goods.marketPrice = amountTransform(marketPrice);

    if (detailData) {
      obj.supplierId = detailData.supplierId
      obj.storeNo = detailData.storeNo
      obj.goodsFromType = detailData.goodsFromType
      obj.spuId = detailData.spuId
      obj.goods.skuId = detailData.goods.skuId

      // const beforeData = {
      //   detailImages: detailData.detailImages,
      //   freightTemplateId: detailData.freightTemplateId,
      //   freightTemplateName: detailData.freightTemplateName,
      //   goodsFromType: detailData.goodsFromType,
      //   isMultiSpec: detailData.isMultiSpec,
      //   primaryImages: detailData.primaryImages,
      //   settleType: detailData.settleType,
      //   videoUrl: detailData.videoUrl,
      //   buyMinNum: detailData.goods.buyMinNum,
      //   gcId1: detailData.goods.gcId1,
      //   gcId2: detailData.goods.gcId2,
      //   goodsName: detailData.goods.goodsName,
      //   isFreeFreight: detailData.goods.isFreeFreight,
      //   wholesaleFreight: detailData.goods.wholesaleFreight,
      //   wholesaleTaxRate: detailData.goods.wholesaleTaxRate,
      //   specData: detailData.specData,
      // }
    }

    return obj;
  }



  const draftSave = (cb) => {
    api.draftSave({
      ...getSubmitData(),
      draftId: detailData?.draftId || 0,
    }, { showSuccess: true })
      .then(res => {
        if (res.code === 0) {
          callback();
          setVisible(false);
          if (cb) {
            cb();
          }
        }
      })
  }

  const leaveTips = (onConfirm) => {
    if (detailData?.spuId) {
      onConfirm();
      return;
    }
    Modal.destroyAll();
    Modal.confirm({
      title: '确认离开当前页面',
      icon: <ExclamationCircleOutlined />,
      content: '保存到草稿箱下次可从草稿箱继续编辑，直接离开不保存下次需全部重新录入！',
      okText: '离开并保存到草稿箱',
      cancelText: '直接离开',
      onCancel: onConfirm,
      centered: true,
      onOk: () => {
        draftSave(() => { onConfirm() })
      }
    });
  }

  const submit = () => {
    return new Promise((resolve, reject) => {
      const apiMethod = detailData?.spuId ? api.editGoods : api.addGoods
      apiMethod(getSubmitData(), { showSuccess: true, showError: true }).then(res => {
        if (res.code === 0) {
          resolve();
          callback();
        } else {
          reject();
        }
      })
    });
  }

  const createEditTableData = (data) => {
    const { specName1, specName2, specValues1, specValues2 } = form.getFieldsValue(['specName1', 'specName2', 'specValues1', 'specValues2']);
    const specArr = [];
    specValues1.forEach((item, index) => {
      if (specValues2[0].name) {
        specValues2.forEach((item2, index2) => {
          specArr.push({
            ...data,
            skuId: 0,
            spec1: item.name,
            spec2: item2.name,
            key: `${index}-${index2}`,
            specValue: {
              1: `10${index + 1}`,
              2: `20${index2 + 1}`,
            },
            code: `i10${index + 1}|20${index2 + 1}`
          })
        })
      } else {
        specArr.push({
          ...data,
          skuId: 0,
          spec1: item.name,
          key: index,
          specValue: {
            1: `10${index + 1}`,
          },
          code: `i10${index + 1}`
        })
      }

    })
    setTableHead([specName1, specName2])
    setTableData([])
    setTimeout(() => {
      setTableData(specArr)
    })
  }

  useEffect(() => {
    if (detailData) {
      const { goods, specName, specValues, specData, freightTemplateId, freightTemplateName, videoUrl } = detailData;
      form.setFieldsValue({
        goodsName: goods.goodsName,
        wholesaleFreight: amountTransform(goods.wholesaleFreight, '/'),
        wholesaleTaxRate: amountTransform(goods.wholesaleTaxRate),
        // goodsDesc: goods.goodsDesc,
        supplierSpuId: goods.supplierSpuId,
        // goodsKeywords: goods.goodsKeywords,
        goodsSaleType: goods.goodsSaleType,
        isFreeFreight: goods.isFreeFreight,
        isMultiSpec: detailData.isMultiSpec,
        stockNum: goods.stockNum,
        stockAlarmNum: goods.stockAlarmNum,
        supplierSkuId: goods.supplierSkuId,
        // wholesaleMinNum: goods.wholesaleMinNum,
        supportNoReasonReturn: goods.supportNoReasonReturn,
        buyMinNum: goods.buyMinNum,
        // buyMaxNum: goods.buyMaxNum,
        goodsRemark: goods.goodsRemark,
        primaryImages: detailData.primaryImages && uploadImageFormatConversion(detailData.primaryImages, 'imageUrl'),
        detailImages: detailData.detailImages && uploadImageFormatConversion(detailData.detailImages, 'imageUrl'),
        // advImages: uploadImageFormatConversion(detailData.advImages, 'imageUrl'),
        videoUrl,
        brandId: goods.brandId === 0 ? null : goods.brandId,
        gcId: goods.gcId1 && [goods.gcId1, goods.gcId2],
      })

      if (freightTemplateId && freightTemplateName) {
        form.setFieldsValue({
          freightTemplateId: { label: freightTemplateName, value: freightTemplateId }
        })
      }

      if (detailData?.refuseArea?.length) {
        const areaArr = [];
        for (let index = 0; index < detailData.refuseArea.length; index++) {
          const refuseArea = detailData.refuseArea[index];
          if (refuseArea.areaId) {
            areaArr.push(refuseArea.areaId)
            continue;
          }
          if (refuseArea.cityId) {
            areaArr.push(refuseArea.cityId)
            continue;
          }

          areaArr.push(refuseArea.provinceId)

        }
        setSelectAreaKey([...new Set(areaArr)])
      }

      if (detailData.isMultiSpec) {
        if (specName['1']) {
          form.setFieldsValue({
            specName1: specName['1'],
            specValues1: Object.values(specValues['1']).map(item => ({ name: item })),
          })
        }


        if (specName['2']) {
          form.setFieldsValue({
            specName2: specName['2'],
            specValues2: Object.values(specValues['2']).map(item => ({ name: item })),
          })
        }
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
      } else {
        form.setFieldsValue({
          // wholesalePrice: amountTransform(goods.wholesalePrice, '/'),
          // retailSupplyPrice: amountTransform(goods.retailSupplyPrice, '/'),
          // suggestedRetailPrice: amountTransform(goods.suggestedRetailPrice, '/'),
          retailSupplyPrice: amountTransform(goods.retailSupplyPrice, '/'),
          wholesaleSupplyPrice: amountTransform(goods.wholesaleSupplyPrice, '/'),
          wholesaleMinNum: goods.wholesaleMinNum,
          // marketPrice: amountTransform(goods.marketPrice, '/'),
        })
      }

      detailExt({
        supplierId: detailData.supplierId
      }).then(res => {
        if (res.code === 0) {
          form.setFieldsValue({
            wholesaleTaxRate: amountTransform(detailData?.goods?.wholesaleTaxRate || res?.data?.records?.defaultWholesaleTaxRate)
          })
        }
      })
    } else {
      detailExt({
        supplierId
      }).then(res => {
        if (res.code === 0) {
          form.setFieldsValue({
            wholesaleTaxRate: amountTransform(detailData?.goods?.wholesaleTaxRate || res?.data?.records?.defaultWholesaleTaxRate)
          })
        }
      })
    }



  }, [form, detailData]);

  const renderMultiCascaderTag = (selectedItems) => {
    const titleArr = [];
    selectedItems.forEach(item => {
      const arr = [];
      let node = item.parent;
      arr.push(item.label)
      while (node) {
        arr.push(node.label)
        node = node.parent;
      }
      titleArr.push({
        label: arr.reverse().join('-'),
        value: item.value
      })
    })

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {
          titleArr.map(item => (
            <Tag
              key={item.value}
              closable
              style={{ marginBottom: 10 }}
              onClose={() => {
                setSelectAreaKey(selectAreaKey.filter(it => it !== item.value))
              }}
            >
              {item.label}
            </Tag>
          ))
        }
      </div>
    );
  }

  useEffect(() => {
    const arr = arrayToTree(window.yeahgo_area || [])
    let str = JSON.stringify(arr)
    str = str.replace(/name/g, 'label').replace(/id/g, 'value')
    setAreaData(JSON.parse(str))
  }, [])

  return (
    <DrawerForm
      title={`${detailData ? '编辑' : '新建'}商品`}
      onVisibleChange={setVisible}
      drawerProps={{
        forceRender: true,
        destroyOnClose: true,
        width: 1200,
        className: styles.drawer_form,
        onClose: () => {
          onClose();
        },
        keyboard: false,
        closable: false,
        maskClosable: false,
      }}
      form={form}
      onFinish={async (values) => {
        try {
          await submit(values);
          return true;
        } catch (error) {
          console.log('error', error);
        }
      }}
      submitter={{
        render: (props) => {
          return (
            <Space>
              <Button type="primary" onClick={() => { props.submit(); }}>
                提交审核
              </Button>
              {!detailData?.spuId && <Button onClick={() => { draftSave() }}>
                保存草稿箱
              </Button>}
              <Button
                key="look"
                onClick={(_) => {
                  const d = form.getFieldsValue();
                  if (d.primaryImages && d.detailImages) {
                    setLookData(d)
                    setLookVisible(true)
                  } else if (detailData.primaryImages && detailData.detailImages) {
                    setLookVisible(true)
                  } else {
                    message.error('请上传图片后预览')
                  }
                }}
              >
                预览
              </Button>
              <Button onClick={() => leaveTips(() => { setVisible(false); onClose(); })}>
                返回
              </Button>
            </Space>
          );
        },
      }}
      visible={visible}
      initialValues={{
        isMultiSpec: 0,
        goodsSaleType: 0,
        isFreeFreight: 1,
        buyMinNum: 1,
        wholesaleTaxRate: 0,
        // buyMaxNum: 99,
        supportNoReasonReturn: 1,
        specValues1: [{}],
        specValues2: [{}],
        area: [],
      }}
      {...formItemLayout}
    >
      <ProFormDependency name={['goodsSaleType']}>
        {({ goodsSaleType }) => {
          return formModalVisible &&
            <FormModal
              visible={formModalVisible}
              setVisible={setFormModalVisible}
              getData={createEditTableData}
              goodsSaleType={goodsSaleType}
            />
        }}
      </ProFormDependency>
      <ProFormText
        name="goodsName"
        label="商品名称"
        placeholder="请输入商品名称"
        validateFirst
        rules={[
          { required: true, message: '请输入商品名称' },
          () => ({
            validator(_, value) {
              if (!value.replace(/\s/g, '')) {
                return Promise.reject(new Error('请输入商品名称'));
              }
              return Promise.resolve();
            },
          })
        ]}
        fieldProps={{
          maxLength: 50,
        }}
      />
      <Form.Item
        label="商品品类"
        name="gcId"
        validateFirst
        rules={[
          { required: true, message: '请选择商品品类' },
        ]}
      >
        <GcCascader supplierId={supplierId || detailData?.supplierId} />
      </Form.Item>


      <ProFormSelect
        name="wholesaleTaxRate"
        label="商品开票税率(%)"
        fieldProps={{
          allowClear: false,
        }}
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
      {/* <ProFormText
        name="goodsDesc"
        label="商品副标题"
        placeholder="请输入商品副标题"
        rules={[{ required: true, message: '请输入商品副标题' }]}
        fieldProps={{
          maxLength: 20,
        }}
      /> */}
      <ProFormText
        name="supplierSpuId"
        label="商品编号"
        placeholder="请输入商品编号"
        fieldProps={{
          maxLength: 32,
        }}
      />
      {/* <ProFormText
        name="goodsKeywords"
        label="搜索关键字"
        placeholder="请输入搜索关键字"
      /> */}

      <Form.Item
        name="brandId"
        label="品牌"
      >
        <BrandSelect />
      </Form.Item>



      <ProFormRadio.Group
        name="goodsSaleType"
        label="供货类型"
        rules={[{ required: true }]}
        options={[
          {
            label: '批发+零售',
            value: 0,
          },
          {
            label: '仅批发',
            value: 1,
          },
          {
            label: '仅零售',
            value: 2,
          },
        ]}
        fieldProps={{
          onChange: (e) => {
            if (e.target.value === 1) {
              form.setFieldsValue({ supportNoReasonReturn: 0 })
            }
          }
        }}
      />

      <ProFormRadio.Group
        name="isMultiSpec"
        label="规格属性"
        rules={[{ required: true }]}
        options={[
          {
            label: '单规格',
            value: 0,
          },
          {
            label: '多规格',
            value: 1,
          },
        ]}
      />

      <ProFormDependency name={['goodsSaleType']}>
        {({ goodsSaleType }) => {
          return (goodsSaleType !== 2) && <ProFormText
            name="wholesaleFreight"
            label="平均运费(元)"
            placeholder="请输入平均运费"
            rules={[
              { required: true, message: '请输入平均运费' },
              () => ({
                validator(_, value) {
                  if (!/^\d+\.?\d*$/g.test(value) || value <= 0) {
                    return Promise.reject(new Error('请输入大于零的数字'));
                  }
                  return Promise.resolve();
                },
              })
            ]}
          />
        }}
      </ProFormDependency>


      <ProFormDependency name={['isMultiSpec']}>
        {({ isMultiSpec }) => {
          return isMultiSpec === 1 ?
            <>
              <ProFormText
                name="specName1"
                label="规格一"
                placeholder="请输入规格名称"
                rules={[{ required: true, message: '请输入规格名称' }]}
                fieldProps={{
                  maxLength: 18,
                }}
                extra='示例：包装、重量、尺寸等'
              />
              <Form.List name="specValues1">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name }) => {
                      return (
                        <Form.Item
                          key={key}
                          label=" "
                          name={[name, 'name']}
                          colon={false}
                          extra='示例：盒装/袋装、200g/300g、22码/24码等'
                        >
                          <Input placeholder="请输入规格属性" maxLength={18} addonAfter={
                            key === 0 ?
                              <Button type="primary" onClick={() => { add() }}>添加</Button>
                              :
                              <Button type="primary" danger onClick={() => { remove(name) }}>删除</Button>
                          } />
                        </Form.Item>
                      )
                    })}
                  </>
                )}
              </Form.List>
              <ProFormText
                name="specName2"
                label="规格二"
                placeholder="请输入规格名称"
                extra='示例：包装、重量、尺寸等'
              />
              <Form.List name="specValues2">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name }) => {
                      return (
                        <Form.Item
                          key={key}
                          label=" "
                          name={[name, 'name']}
                          colon={false}
                          extra='示例：盒装/袋装、200g/300g、22码/24码等'
                        >
                          <Input maxLength={18} placeholder="请输入规格属性" addonAfter={
                            key === 0 ?
                              <Button type="primary" onClick={() => { add() }}>添加</Button>
                              :
                              <Button type="primary" danger onClick={() => { remove(name) }}>删除</Button>
                          } />
                        </Form.Item>
                      )
                    })}
                  </>
                )}
              </Form.List>
              <ProFormDependency name={['specName1', 'specValues1']}>
                {({ specName1, specValues1 }) => (
                  <Form.Item
                    label=" "
                    colon={false}
                  >
                    <Button
                      type="primary"
                      onClick={() => {
                        if (!specName1 || !specValues1[0].name) {
                          message.error('请填写规格属性');
                          return;
                        }
                        setFormModalVisible(true)
                      }}>生成规格配置表</Button>
                  </Form.Item>
                )}
              </ProFormDependency>
              <Form.Item
                label="规格配置表"
              >
                重新编辑规格名和规格值后请重新点击生成规格配置表，重新批量填写规格参数也请重新点击生成规格配置表
                <Button
                  type="primary"
                  onClick={() => {
                    if (!tableHead.length) {
                      message.error('请先点击生成规格配置表！');
                      return;
                    }
                    setFormModalVisible(true)
                  }}>批量填写</Button>
              </Form.Item>
              <ProFormDependency name={['goodsSaleType']}>
                {
                  ({ goodsSaleType }) => (
                    <div
                      onClick={() => {
                        if (!tableHead.length) {
                          message.error('请先点击生成规格配置表！');
                        }
                      }}
                    >
                      <EditTable
                        goodsSaleType={goodsSaleType}
                        tableHead={tableHead}
                        tableData={tableData}
                        setTableData={setTableData}
                      />
                    </div>
                  )
                }
              </ProFormDependency>
            </>
            :
            <>
              <ProFormText
                name="supplierSkuId"
                label="货号"
                placeholder="请输入货号"
              // rules={[{ required: true, message: '请输入货号' }]}
              />
              <ProFormText
                name="stockNum"
                label="可用库存"
                placeholder="请输入可用库存"
                validateFirst
                rules={[
                  { required: true, message: '请输入可用库存数量' },
                  // () => ({
                  //   validator(_, value) {
                  //     if (!/^\d+$/g.test(value) || `${value}`.indexOf('.') !== -1 || value <= 0) {
                  //       return Promise.reject(new Error('请输入大于零的正整数'));
                  //     }
                  //     return Promise.resolve();
                  //   },
                  // })
                ]}
              />
              <ProFormText
                name="stockAlarmNum"
                label="库存预警值"
                placeholder="请输入数字 可用库存小于等于此值时提醒"
                validateFirst
                rules={[
                  () => ({
                    validator(_, value) {
                      if ((!/^\d+$/g.test(value) || `${value}`.indexOf('.') !== -1 || value <= 0) && value !== '' && value !== undefined) {
                        return Promise.reject(new Error('请输入大于零的正整数'));
                      }
                      return Promise.resolve();
                    },
                  })
                ]}
              />
              <ProFormDependency name={['goodsSaleType']}>
                {({ goodsSaleType }) => {
                  return (goodsSaleType !== 1) && <ProFormText
                    name="retailSupplyPrice"
                    label="零售供货价(元)"
                    placeholder="请输入零售供货价"
                    validateFirst
                    rules={[
                      { required: true, message: '请输入零售供货价' },
                      () => ({
                        validator(_, value) {
                          if (!/^\d+\.?\d*$/g.test(value) || value <= 0) {
                            return Promise.reject(new Error('请输入大于零的数字'));
                          }
                          return Promise.resolve();
                        },
                      })
                    ]}
                  />
                }}
              </ProFormDependency>
              <ProFormDependency name={['goodsSaleType']}>
                {({ goodsSaleType }) => {
                  return goodsSaleType !== 2 &&
                    <>
                      <ProFormText
                        name="wholesaleSupplyPrice"
                        label="批发供货价(元)"
                        placeholder="请输入批发供货价"
                        validateFirst
                        rules={[
                          { required: true, message: '请输入批发供货价' },
                          () => ({
                            validator(_, value) {
                              if (!/^\d+\.?\d*$/g.test(value) || value <= 0) {
                                return Promise.reject(new Error('请输入大于零的数字'));
                              }
                              return Promise.resolve();
                            },
                          })
                        ]}
                      />
                      <ProFormText
                        name="wholesaleMinNum"
                        label="最低批发量"
                        placeholder="请输入最低批发量"
                        rules={[
                          { required: true, message: '请输入最低批发量' },
                          () => ({
                            validator(_, value) {
                              if (!/^\d+$/g.test(value) || `${value}`.indexOf('.') !== -1 || value <= 0) {
                                return Promise.reject(new Error('请输入大于零的正整数'));
                              }
                              return Promise.resolve();
                            },
                          })
                        ]}
                      />
                    </>
                }}
              </ProFormDependency>
            </>
        }}
      </ProFormDependency>
      <ProFormText
        name="buyMinNum"
        label="单SKU起售数量"
        placeholder="请输入单SKU起售数量"
        rules={[
          { required: true, message: '请输入单SKU起售数量' },
          () => ({
            validator(_, value) {
              if (!/^\d+$/g.test(value) || `${value}`.indexOf('.') !== -1 || value <= 0) {
                return Promise.reject(new Error('请输入大于零的正整数'));
              }
              return Promise.resolve();
            },
          })
        ]}
      />
      {/* <ProFormText
        name="buyMaxNum"
        label="单次最多零售购买数量"
        placeholder="请输入单次最多零售购买数量"
      /> */}
      <ProFormDependency name={['goodsSaleType']}>
        {({ goodsSaleType }) => {
          return <>
            {
              goodsSaleType !== 1 && <ProFormRadio.Group
                name="isFreeFreight"
                label="是否包邮"
                rules={[{ required: true }]}
                options={[
                  {
                    label: '包邮',
                    value: 1,
                  },
                  // {
                  //   label: '不包邮',
                  //   value: 0,
                  // },
                ]}
              />
            }
            <ProFormRadio.Group
              name="supportNoReasonReturn"
              label="七天无理由退货"
              rules={[{ required: true }]}
              disabled={goodsSaleType === 1}
              options={[
                {
                  label: '支持',
                  value: 1,
                },
                {
                  label: '不支持',
                  value: 0,
                },
              ]}
            />
          </>
        }}
      </ProFormDependency>

      {/* <ProFormDependency name={['isFreeFreight']}>
        {({ isFreeFreight }) => (
          <Form.Item
            name="freightTemplateId"
            label="选择运费模板"
            rules={[{ required: !isFreeFreight, message: '请选择运费模板' }]}
          >
            <FreightTemplateSelect labelInValue />
          </Form.Item>
        )}
      </ProFormDependency> */}

      <ProFormTextArea
        name="goodsRemark"
        label="特殊说明"
      />
      <Form.Item
        label="不发货地区"
      >
        <MultiCascader
          value={selectAreaKey}
          data={areaData}
          style={{ width: '100%' }}
          placeholder="请选择不发货地区"
          renderValue={(a, b) => renderMultiCascaderTag(b)} locale={{ searchPlaceholder: '输入省市区名称' }}
          onChange={setSelectAreaKey}
        />
      </Form.Item>
      <Form.Item
        label="商品主图"
        name="primaryImages"
        required
        rules={[() => ({
          validator(_, value) {
            if (value && value.length >= 3) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('至少上传3张商品主图'));
          },
        })]}
      >
        <FromWrap
          content={(value, onChange) => <Upload value={value} onChange={onChange} multiple maxCount={50} accept="image/*" dimension="1:1" size={1024} />}
          right={(value) => {
            return (
              <dl>
                <dt>图片要求</dt>
                <dd>1.图片大小1MB以内</dd>
                <dd>2.图片比例1:1</dd>
                <dd>3.图片格式png/jpg/gif</dd>
                <dd>4.至少上传3张</dd>
                {value?.length > 1 && <dd><ImageSort data={value} callback={(v) => { form.setFieldsValue({ primaryImages: v }) }} /></dd>}
              </dl>
            )
          }}
        />
      </Form.Item>
      <Form.Item
        label="商品详情"
        name="detailImages"
        rules={[{ required: true, message: '请上传商品详情图片' }]}
      >
        <FromWrap
          content={(value, onChange) => <Upload value={value} onChange={onChange} multiple maxCount={50} accept="image/*" size={1024 * 10} />}
          right={(value) => (
            <dl>
              <dt>图片要求</dt>
              <dd>1.图片大小10MB以内</dd>
              <dd>2.图片格式png/jpg/gif</dd>
              {value?.length > 1 && <dd><ImageSort data={value} callback={(v) => { form.setFieldsValue({ detailImages: v }) }} /></dd>}
            </dl>
          )}
        />

      </Form.Item>
      {/* <Form.Item
        label="商品横幅"
        name="advImages"
        tooltip={
          <dl>
            <dt>图片要求</dt>
            <dd>1.图片大小500kb以内</dd>
            <dd>2.图片尺寸702*320px</dd>
            <dd>3.图片格式png/jpg/gif</dd>
            <dd>注：商品横幅用于VIP商品推广，非必填</dd>
          </dl>
        }
      >
        <Upload multiple maxCount={10} accept="image/*" dimension={{ width: 702, height: 320 }} size={500} />
      </Form.Item> */}
      <Form.Item
        label="商品视频"
        name="videoUrl"
      >
        <FromWrap
          content={(value, onChange) => {
            return (
              <Upload
                value={value}
                onChange={onChange}
                maxCount={1}
                accept="video/mp4"
                size={1024 * 20}
                itemRender={(originNode, file, fileList, actions) => {
                  return (
                    <div className={styles.video_preview}>
                      <video width="100%" height="100%" src={file?.url} />
                      <div>
                        <EyeOutlined onClick={() => { window.open(file?.url, '_blank') }} style={{ color: '#fff', marginRight: 10, cursor: 'pointer' }} />
                        <DeleteOutlined
                          onClick={() => {
                            actions.remove();
                          }}
                          style={{ color: '#fff', cursor: 'pointer' }} />
                      </div>
                    </div>
                  )
                }} />
            )
          }}
          right={() => (
            <dl>
              <dt>视频要求</dt>
              <dd>1.视频大小20MB以内</dd>
              <dd>2.视频格式mp4</dd>
            </dl>
          )}
        />
      </Form.Item>
      {
        detailData?.goods?.createTimeDisplay &&
        <Form.Item
          label="创建时间"
        >
          {detailData.goods.createTimeDisplay}
        </Form.Item>
      }

      {
        detailData?.goods?.goodsVerifyStateDisplay &&
        <Form.Item
          label="审核状态"
        >
          {detailData.goods.goodsVerifyStateDisplay}
        </Form.Item>
      }

      {
        detailData?.goods?.goodsStateDisplay &&
        <Form.Item
          label="上架状态"
        >
          {detailData?.goods?.goodsStateDisplay}
        </Form.Item>
      }

      {detailData?.goods?.goodsVerifyRemark && <Form.Item
        label="原因"
      >
        <span style={{ color: 'red' }}>{detailData.goods.goodsVerifyRemark}</span>
      </Form.Item>}
      {lookVisible && <Look
        visible={lookVisible}
        setVisible={setLookVisible}
        dataList={lookData || detailData}
        callback={(text) => { console.log('callback', text) }}
      />}
      <NavigationPrompt when={!detailData?.spuId}>
        {({ onConfirm }) => {
          leaveTips(() => { onConfirm(); onClose(); })
        }}
      </NavigationPrompt>
    </DrawerForm>
  );
};