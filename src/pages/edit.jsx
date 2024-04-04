import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form } from 'semantic-ui-react'
import * as yup from 'yup'
import { useParams } from 'react-router-dom'
import * as empService from '../services/employees'
import { TextField } from '@mui/material'
import { useMemo } from 'react'


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
    const { register, handleSubmit, reset, formState = { errors }, control } = useForm({
        resolver: yupResolver(empSchema),
        defaultValues: useMemo(() =>
            employee
            , [employee])
    })
    const send = (data) => {
        console.log(data)
    }
    useEffect(() => {
        reset(employee);
    }, [employee]);
    return (
        <Form onSubmit={handleSubmit(send)}>
            <TextField
                autoFocus
                label='First Name'
                {...register("firstName")}
                variant='standard'
                type='text'
                margin='dense'
                fullWidth
            />
            <TextField

                label='Family Name'
                {...register("familyName")}
                variant='standard'
                type='text'
                margin='dense'
                fullWidth
            />
        </Form>
    )

}
export default Edit;

