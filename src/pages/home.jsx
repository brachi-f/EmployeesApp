import { useDispatch, useSelector } from "react-redux";
import { getEmployeesDispatch } from "../services/employees";
import { useEffect } from "react";



const Home = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getEmployeesDispatch(true))

    }, [])
    const employees = useSelector(s => s.employees);
    console.log(employees);
    return (<>
        <h1>Home</h1>
    </>)
}
export default Home;