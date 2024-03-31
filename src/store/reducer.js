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
        default: {
            return { ...state }
        }
    }
}
export default reducer;