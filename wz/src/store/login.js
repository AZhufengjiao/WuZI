const login={
    // 使用具有命名空间的vuex模块
    namespaced:true,
    // 返回该模式下存储的应用状态
    state() {
        return {
                //  登录用户名
                username:'',
                flag:false,
                token:''
            }
    },
    mutations:{
        setUser(state,user){
            state.username=user
        },
        setFlag(state,flag){
            state.flag=  flag
        },
        setToken(state,token){
        state.token=token
        }
    }
}

export  default  login;
