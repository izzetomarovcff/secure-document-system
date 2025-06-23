export const  IsLogIn = islogin =>{
    return{
        type: "IS_LOG_IN",
        payload: islogin
    }
}
export const  IsSuperAdmin = issuperadmin =>{
    return{
        type: "IS_SUPER_ADMIN",
        payload: issuperadmin
    }
}
export const  SetUser = user =>{
    return{
        type: "SET_USER",
        payload: user
    }
}