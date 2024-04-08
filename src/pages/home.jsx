import { useDispatch, useSelector } from "react-redux";
import { getEmployeesDispatch } from "../services/employees";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import List from "./list";



const Home = () => {
    const navigate = useNavigate()
    return (
        <>
            {/* <Link to={'/employees'}>List</Link> */}
        </>
    )

}
export default Home;