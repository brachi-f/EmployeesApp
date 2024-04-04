import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Form, Label, Popup } from 'semantic-ui-react'
import * as yup from 'yup'
import { useParams } from 'react-router-dom'
import * as empService from '../services/employees'


const Edit = () => {
    const [employee, setEmployee] = useState();
    let { id } = useParams();
    useEffect(() => {
        empService.getEmployeeById(id).then(res => {
            setEmployee(res.data)
        }).catch(err => console.error("Error by getting employee by id: ", err))
    }, [])
    console.log("employee:", employee)
    const empSchema = yup.object({
        firstName: yup.string().required(),
        familyName: yup.string().required(),
        identity: yup.string().min(9).max(9).required(),
        dateOfBirth: yup.date().required,
        dateStart: yup.date().required(),
        // gender: yup.number().min(0).max(1).required(),
        // status: yup.bool().default(true),
        // roles: yup.array().of(
        //     yup.object().shape({
        //         name: yup.number().required(),
        //         management: yup.bool().required(),
        //         dateStart: yup.date().required()
        //     })
        // )
    })
    const { register, handleSubmit, formState = { errors }, control } = useForm({
        resolver: yupResolver(empSchema)
    })
    const send = (data) => {
        console.log(data)
    }
    // const MyInput = ({ type, placeholder, reg, icon, def }) => {
    //     console.log(def)
    //     return <>
    //         <Popup content={placeholder} trigger={
    //             <div className="ui left icon input">
    //                 <input type={type} {...register(reg)} /*placeholder={placeholder}*/ defaultValue={def} />

    //                 <i aria-hidden="true" className={`${icon} icon`}></i>
    //             </div>}
    //         />
    //     </>
    // }
    return (
        <Form onSubmit={handleSubmit(send)}>
            <Popup content="First Name" trigger={
            <div className="ui left icon input">
                <input {...register("firstName")} defaultValue={employee?employee.firstName:""}/>
                <i aria-hidden="true" className="user icon"></i>
            </div>}/>
            {/* <MyInput type="text" placeholder='First Name' reg="firstName" icon="user" def={employee?employee.firstName:""} />
            <MyInput type="text" placeholder='Family Name' reg="familyName" icon="user" def={employee?.familyName} />
            <MyInput type="text" placeholder='ID Number' reg="identity" icon="id card" def={employee?.identity} />
            <MyInput type="date" placeholder='Date of birth' reg="dateOfBirth" icon="birthday cake" def={new Date(employee?.dateOfBirth)} />
            <MyInput type="date" placeholder='Start Date' reg="dateStart" icon="calendar" def={new Date(employee?.dateStart)} /> */}
            <Button type='submit'>submit</Button>
        </Form>
    )

}
export default Edit;

