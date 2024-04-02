import { useDispatch, useSelector } from "react-redux";
import { getEmployeesDispatch } from "../services/employees";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import List from "./list";



const Home = () => {

    return (<>
        <h1>Home</h1>
        {/* <Link to={<List/>} title="list"/> */}
    </>)
}
export default Home;