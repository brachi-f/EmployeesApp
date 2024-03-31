import axios from "axios"
import * as actionsNames from '../store/action'

const baseURL = 'https://localhost:7009/api'

export const getEmployeesDispatch = (status) => {
    return dispatch => {
        let url = status ? `/Employee?status=${status}` : `/Employee`
        axios.get(baseURL + url).then(res => {
            dispatch({ type: actionsNames.GET_EMPLOYEES, data: res.data })
        }).catch(err => {
            console.error(err)
        })
    }
}
export const deleteEmployee = (id)=>{
    return axios.put(baseURL+`/Employee/delete/${id}`)
}