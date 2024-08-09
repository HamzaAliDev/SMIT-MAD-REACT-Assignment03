import React, { createContext, useEffect, useReducer } from 'react'

const initialState = {isAuthenticated: false}
const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOGGED_IN':
            return {isAuthenticated: true}
        case 'SET_LOGGED_OUT':
            return initialState        
        default:
            return state
    }
}
export const AuthContext = createContext()
export default function AuthContextProvider(props) {

    // const [isAuthenticated, setIsAuthenticated] = useState();
    const [state, dispatch] = useReducer(reducer,initialState);

    useEffect(()=>{
        const isAuth= localStorage.getItem('IsAuth')
        if(isAuth === 'true'){ dispatch({type: 'SET_LOGGED_IN'})}
    },[])
    
// console.log(state)
  return (
    <AuthContext.Provider value={{...state, dispatch}}>
        {props.children}
    </AuthContext.Provider>

  )
}
