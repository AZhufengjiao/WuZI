const user={
    // 使用具有命名空间的vuex模块
    namespaced:true,
    // 返回该模式下存储的应用状态
    state() {
        return {
            // 存储购物车列表
            list: [],
            // 侧边栏index
            index:'1'
        };
    },
    mutations:{
        setIndex(state,payload){

            console.log(payload)
            state.index=payload
        }
    }
}

export  default  user;
