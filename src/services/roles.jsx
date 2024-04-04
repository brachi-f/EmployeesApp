import axios from 'axios'
import * as actionsNames from '../store/action'
import { baseURL } from './employees'




export const getRolesDispatch = () => {
    return dispatch => {
        axios.get(baseURL+'/Role').then(res => {
            dispatch({ type: actionsNames.GET_ROLES, data: res.data })
        }).catch(err => {
            console.error(err)
        })
    }
}