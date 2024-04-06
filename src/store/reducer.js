import * as actionsNames from './action'

const initialState = {
    employees: [],
    roles: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionsNames.GET_EMPLOYEES: {
            return { ...state, employees: action.data }
        }
        case actionsNames.GET_ROLES: {
            return { ...state, roles: action.data }
        }
        case actionsNames.UPDATE_EMPLOYEE: {
            let list = state.employees
            let index = list.findIndex(l => l.id == action.data.id)
            list[index] = action.data
            return { ...state, employees: list }
        }
        default: {
            return { ...state }
        }
    }
}
export default reducer;