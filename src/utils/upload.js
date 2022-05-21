import OSS from 'ali-oss';
import request from '@/utils/request';
import { getImageSize } from '@/utils/utils';

const getConfig = (params = {}, options = {}) => {
  return request('/auth/goods/product/getOssConfig', {
    method: 'POST',
    data: params,
    ...options
  });
}

let ossConfig = null;
let codeTemp = null

const upload = async (file, code) => {
  if (code !== codeTemp) {
    ossConfig = null
  }
  codeTemp = code;
  if (!ossConfig) {
    const res = await getConfig({ code });
    ossConfig = res?.data?.records
  }
  const client = new OSS({
    region: `oss-${ossConfig.regionId}`,
    accessKeyId: ossConfig.credentials.accessKeyId,
    accessKeySecret: ossConfig.credentials.accessKeySecret,
    stsToken: ossConfig.credentials.securityToken,
    bucket: ossConfig.uploadInfo.bucket,
  })
  return new Promise((resolve) => {
    client.put(`${ossConfig.uploadInfo.dir}/${file.uid}${file.name}`, file).then(res => {
      if (file.type.indexOf('image') !== -1) {
        getImageSize(file).then(size => {
          resolve(`${res.url}?imgHeight=${size.height}&imgWidth=${size.width}`)
        })
      } else {
        resolve(res.url);
      }
    }).catch(err => {
      ossConfig = null;
      // return upload(file, dirName)
      console.log('上传失败：', err)
    })
  })
}

export default upload;
