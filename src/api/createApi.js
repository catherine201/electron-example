import { fetchApi } from './axios';

export default function createApi(config) {
  if (Object.prototype.toString.call(config) !== '[object Object]') return;
  const apiResult = {};
  Object.keys(config).forEach(key => {
    apiResult[key] = async data => {
      // console.log(data.url);
      const url = config[key].url;
      const options = config[key].options || {};
      return fetchApi(url, options, data);
    };
  });
  return apiResult;
}
