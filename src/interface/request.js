import axios from "axios";

import { DELETE, GET, POST, PUT } from "../constants/constant";

const request = (method, url, headers, payload, params) => {
  let promise;

  switch (method) {
    case POST:
      promise = axios.post(url, payload, { headers });
      break;
    case PUT:
      promise = axios.put(url, payload, { headers });
      break;
    case DELETE:
      promise = axios.delete(url, { headers, data: payload });
      break;
    case GET:
    default:
      promise = axios.get(url, { headers, params });
      break;
  }

  return new Promise((resolve, reject) => {
    return promise.then((r) => resolve(r)).catch((e) => reject(e));
  });

};

export default request;
