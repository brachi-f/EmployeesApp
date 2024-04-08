import axios from "axios"
import * as actionsNames from '../store/action'

export const baseURL = 'http://localhost:5058/api'

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
export const getAllEmployees = () => {
    return axios.get(baseURL + '/Employee')
}
export const addEmployee = (emp) => {
    return axios.post(baseURL + `/Employee`, emp)
}
export const deleteEmployee = (id) => {
    return axios.put(baseURL + `/Employee/delete/${id}`)
}
export const getEmployeeById = (id) => {
    return axios.get(baseURL + `/Employee/${id}`)
}
export const getRolesOfEmployee = (id) => {
    return axios.get(baseURL + `/Employee/${id}/role`)
}
export const updateEmployeeFields = (id, emp) => {
    return axios.put(baseURL + `/Employee/${id}`, emp)
}
export const deleteEmpRole = (id) => {
    return axios.delete(baseURL + `/Employee/role/${id}`)
}
export const updateEmpRole = (id, role) => {
    return axios.put(baseURL + `/Employee/role/${id}`, role)
}
export const addEmpRole = (role) => {
    return axios.post(baseURL + `/Employee/role`, role)
}