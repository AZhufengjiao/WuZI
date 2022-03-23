import axios from "axios";
// import store from "@/store";
// import router from "@/router";
import store from "../store/index";
import router from "../router/index";

// 线上环境: https://apipc-xiaotuxian-front.itheima.net/
// 开发环境: http://pcapi-xiaotuxian-front-devtest.itheima.net/
// 模拟接口地址：https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate
// http://localhost:3000/#/login
// 2.创建 baseURL 变量用于存储基准的请求地址
// http://124.221.170.20:3000
const baseURL = "http://124.221.170.20:3000";
// http://localhost:8080

//1.创建一个新的axios 实例对象 专门用来配置和小兔仙应用相关的请求、
// axios.create; // 创建一个新的axios实例
const instanceWithToken = axios.create({
  baseURL
});
const instanceWithoutToken = axios.create({
  baseURL
});

// 3.配置请求拦截器 携带 token    interceptors 拦截器 request 请求
instanceWithToken.interceptors.request.use((config) => {
  // 获取token
  const token = store.state.login.token;
  //判断token 存在
  if (token) {
    // 将token存储在请求头中
    config.headers.Authorization = `Bearer ${token}`;
  }
  // 不反悔相当没修改 返回配置
  return config;
});

// 4.响应拦截器 实现减少数据层级，处理token过期的情况  捕获错误传递错误
instanceWithToken.interceptors.response.use(
  (response) => {
    // 如果服务器端返回的是表示成功的状态码，走这个函数
    //  服务器端做出响应之后，先走当前回调函数 在当前回调函数中可以对响应结果进行处理
    return response.data; // {headers:{},data:{}}
  },
  (error) => {
    // 如果服务器端返回的是表示失败的状态码，走这个函数
    // 检查token是否过期 // 失败时的响应状态
    if (error.response.status == 401) {
      //  清空本地存储的用户信息
      store.commit("user/setUser", {});
      //  跳转到登录页面
      router
        .push("/login")
        .then(() => {
          console.log("跳转成功");
        })
        .catch(() => {
          console.log("跳转失败");
        });
    }
    return Promise.reject(error);
  }
);
//不携带token响应拦截
instanceWithoutToken.interceptors.response.use((response) => {
  return response.data;
});

// 用于生成请求配置的函数
function generateRequestConfig(url, method, data) {
  return {
    url,
    method,
    [method === "get" ? "params" : "data"]: data,
  };
}

//4.用于发送请求的函数 带token
export function requestWithToken(url, method, data) {
  return instanceWithToken(generateRequestConfig(url, method, data));
}
//用于发送普通请求 不带token
export function requestWithoutToken(url, method, data) {
  return instanceWithoutToken(generateRequestConfig(url, method, data));
}
