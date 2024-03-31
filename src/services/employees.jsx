import axios from "axios"
import * as actionsNames from '../store/action'
export const getEmployeesDispatch=(status)=>{
    return dispatch=>{
        axios.get(`https://localhost:7009/api/Employee?status=${status}`).then(res=>{
            dispatch({type:actionsNames.GET_EMPLOYEES, data:res.data})
        }).catch(err=>{
            console.error(err)
        })
    }
}