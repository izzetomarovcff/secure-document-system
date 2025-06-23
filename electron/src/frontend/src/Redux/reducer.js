const INITIAL_STATE = {
    is_login: false,
    is_super_admin: false,
    user:null
    
}

export default (state = INITIAL_STATE, action)=>{

    switch(action.type){
        case "IS_LOG_IN":
            return{...state,is_login:action.payload}
        case "IS_SUPER_ADMIN":
            return{...state,is_super_admin:action.payload}
        case "SET_USER":
            return{...state,user:action.payload}
        
        default:
            return state
    }
}