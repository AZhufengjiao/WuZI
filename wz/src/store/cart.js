const cart={
    // 使用具有命名空间的vuex模块
    namespaced:true,
    // 返回该模式下存储的应用状态
    state() {
        return {
            // 存储购物车列表
            list: [],
        };
    },
}

export  default  cart;
