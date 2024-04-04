import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Form, Icon } from 'semantic-ui-react'
import * as yup from 'yup'
import { useParams } from 'react-router-dom'
import * as empService from '../services/employees'
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useMemo } from 'react'


const Edit = () => {
    const [employee, setEmployee] = useState(null);
    const [roles, setRoles] = useState([]);
    let { id } = useParams();
    useEffect(() => {
        empService.getEmployeeById(id).then(res => {
            setEmployee(res.data)
        }).catch(err => console.error("Error by getting employee by id: ", err))
        empService.getRolesOfEmployee(id).then(res => {
            setRoles(res.data)
        }).catch(err => console.error('Error by getting roles of employee: ', err))
    }, [])

    const empSchema = yup.object({
        firstName: yup.string().required(),
        familyName: yup.string().required(),
        identity: yup.string().min(9).max(9).required(),
        dateOfBirth: yup.date().required(),
        dateStart: yup.date().required(),
        gender: yup.number().required(),
        status: yup.bool().default(true),
        roles: yup.array().of(
            yup.object().shape({
                id: yup.number(),
                name: yup.number().required(),
                management: yup.bool().required(),
                dateStart: yup.date().required()
            })
        )
    })

    const { register, handleSubmit, reset, formState = { errors }, control, getValues } = useForm({
        resolver: yupResolver(empSchema),
        defaultValues: useMemo(() => {
            if (employee) {
                let item = employee
                employee.dateOfBirth = new Date(employee.dateOfBirth).toISOString().substring(0, 10)
                employee.dateStart = new Date(employee.dateStart).toISOString().substring(0, 10)
                return item
            }
            return employee
        }
            , [employee])
    })
    const { fields: RolesFields, append: RolesAppend, remove: RolesRemove } = useFieldArray({
        control,
        name: "roles",
    });
    const send = (data) => {
        console.log(data)
    }
    useEffect(() => {
        reset(employee);
    }, [employee]);
    useEffect(() => {
        roles?.map((r) => RolesAppend(r))
    }, [roles])
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
            <TextField
                label='ID number'
                {...register("identity")}
                variant='standard'
                type='text'
                margin='dense'
                fullWidth
            />
            <TextField
                label='Birth date'
                {...register("dateOfBirth")}
                variant='standard'
                type='date'
                margin='dense'
                fullWidth
            />
            <TextField
                label='Start date'
                {...register("dateStart")}
                variant='standard'
                type='date'
                margin='dense'
                fullWidth
            />
            <Select
                label='Gender'
                //select
                {...register('gender')}
                value={employee?.gender || '2'}
                fullWidth
            //defaultValue={employee ? employee.gender : '2'}
            >
                <MenuItem value='2' disabled /* selected={!employee}*/>
                    <Icon name='female' />|
                    <Icon name='male' />
                    Gender</MenuItem>
                <MenuItem value='0' /*selected={employee && employee.gender == 0}*/>
                    <Icon name='female' />
                    Female</MenuItem>
                <MenuItem value='1' >
                    <Icon name='male' /*selected={employee && employee.gender == 1}*/ />
                    Male</MenuItem>
            </Select>
            <h4>Roles</h4>
            {RolesFields.map((r) =>
                <p key={r.id}>{r.roleId}</p>
            )}
            <Button onClick={() => {
                console.log("values", getValues())
                console.log("roles", RolesFields)
            }}>do</Button>
        </Form>
    )

}
export default Edit;

