// sql语句
const { register, findUserByUserName, userLogin } = require("../model/login");

// 后端校验
const Joi = require("joi");
// 生成token
var jwt = require("jsonwebtoken");
// 登录 生成token字符串
const { jwtSecret, passwordSectet } = require("../config/index");

// 使用封装的方法MD5进行密码加密
const { cryptoPassword } = require("../utils/index");

// 注册用户
module.exports.userRegister = async (ctx) => {
  // 获取前端login传入的数据，post请求用body接收
  const { username, password, mobile, email, role, state } = ctx.request.body;

  // 查询当前用户是否已经注册
  const user = await findUserByUserName(username);
  if (user[0]) {
    return (ctx.body = {
      status: 0,
      message: "用户名已被注册",
    });
  }

  // 后端校验
  /*定义验证规则*/
  const schema = Joi.object({
    username: Joi.string()
      .min(2)
      .max(20)
      .required()
      .error(new Error("用户名格式不正确")),
    password: Joi.string()
      .min(6)
      .max(20)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .error(new Error("密码格式不正确")),
    email: Joi.string().email(),
    mobile: Joi.string()
      .pattern(
        new RegExp(
          /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
        )
      )
      .error(new Error("手机号格式不正确")),
    role: Joi.number().integer().valid(0, 1),
    state: Joi.number().integer().valid(0, 1),
  });

  // async function run() {
  try {
    /*验证*/
    const value = await schema.validateAsync(ctx.request.body);
    console.log(value);
    console.log("验证成功");
  } catch (e) {
    console.log(e.message);
    console.log("验证失败");
    return (ctx.body = {
      status: 0,
      message: e.message,
    });
  }
  // }
  // run()

  // 调用mysql 注册用户
  let res = await register(
    username,
    cryptoPassword(password + passwordSectet),
    mobile,
    email,
    role,
    state
  );
  console.log(res);

  ctx.body = {
    status: 200,
    userInfo: ctx.request.body,
    msg: "注册成功",
  };
};

// 登录
module.exports.login = async (ctx) => {
  console.log(222);
  const { username, password } = ctx.request.body;
  // 在数据库中查询用户信息是否有
  const result = await userLogin(
    username,
    cryptoPassword(password + passwordSectet)
  );
  let state = result[0];
  // 用户是否存在
  if (result[0] && state) {
    // 生成token
    const token = jwt.sign(
      {
        data: {
          username,
          password,
        },
      },
      jwtSecret,
      {
        expiresIn: "2h",
      }
    );

    ctx.body = {
      status: 200,
      token: token,
      userInfo: ctx.request.body,
      msg: "登录成功",
    };
  } else {
    ctx.body = {
      status: 0,
      msg: "登录失败",
    };
  }
};
