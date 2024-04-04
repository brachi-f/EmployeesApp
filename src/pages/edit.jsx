import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Form, FormField, FormGroup, FormRadio, Icon, Label, Popup, Radio, Segment } from 'semantic-ui-react'
import * as yup from 'yup'
import { useParams } from 'react-router-dom'
import * as empService from '../services/employees'


const Edit = () => {
    const [employee, setEmployee] = useState();
    const [gender, setGender] = useState(true);
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
        dateOfBirth: yup.date().required(),
        dateStart: yup.date().required(),
        gender: yup.number().min(0).max(1).required(),
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
    return (
        <Form onSubmit={handleSubmit(send)}>
            <Popup content="First Name" trigger={
                <div className="ui left icon input">
                    <input {...register("firstName")} defaultValue={employee ? employee.firstName : ""} />
                    <i aria-hidden="true" className="user icon"></i>
                </div>} />
            <Popup content="Family Name" trigger={
                <div className="ui left icon input">
                    <input {...register("familyName")} defaultValue={employee ? employee.familyName : ""} />
                    <i aria-hidden="true" className="user icon"></i>
                </div>} />
            <Popup content="ID Number" trigger={
                <div className="ui left icon input">
                    <input {...register("identity")} defaultValue={employee ? employee.identity : ""} />
                    <i aria-hidden="true" className="id card icon"></i>
                </div>} />
            <Popup content="Date of birth" trigger={
                <div className="ui left icon input">
                    <input type='date' {...register("dateOfBirth")} defaultValue={employee ? new Date(employee.dateOfBirth).toISOString().substring(0, 10) : null} />
                    <i aria-hidden="true" className="birthday cake icon"></i>
                </div>} />
            <Popup content="Start Date" trigger={
                <div className="ui left icon input">
                    <input type='date' {...register("dateStart")} defaultValue={employee ? new Date(employee.dateStart).toISOString().substring(0, 10) : ""} />
                    <i aria-hidden="true" className="calendar icon"></i>
                </div>} />
            
            <Button type='submit' onClick={() => console.log(formState.errors)}>submit</Button>
        </Form>
    )

}
export default Edit;

