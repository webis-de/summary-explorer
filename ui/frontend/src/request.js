import axios from "axios";

import { baseURL } from "./config";

const timeoutSeconds = 5;

const instance = axios.create({
  baseURL,
  timeout: timeoutSeconds * 1000,
});

async function request(method, url, data) {
  try {
    const response = await instance.request({
      method,
      url,
      data,
    });
    return response.data;
  } catch ({ response, request: req }) {
    if (response) {
      throw new Error(`${response.status} ${response.statusText}`);
    } else if (req) {
      throw new Error("the request was made but no response was received");
    } else {
      throw new Error("setting up the request triggered an error");
    }
  }
}

function post(path, json) {
  return request("post", path, json);
}
function get(path) {
  return request("get", path);
}

export { post, get };
