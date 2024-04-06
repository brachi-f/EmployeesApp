import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, ButtonContent, Form, Icon, Segment, SegmentGroup } from 'semantic-ui-react'
import * as yup from 'yup'
import { useParams } from 'react-router-dom'
import * as empService from '../services/employees'
import { FormLabel, FormControl, MenuItem, Select, Switch, TextField, InputLabel, OutlinedInput } from '@mui/material'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Cake, CalendarToday, Contacts, Person, Today } from '@mui/icons-material'



const Edit = () => {
    const [employee, setEmployee] = useState();
    const [roles, setRoles] = useState([]);
    let { id } = useParams();
    const roleList = useSelector(s => s.roles);

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
    const { register, handleSubmit, reset, formState = { errors }, control, getValues, setValue } = useForm({
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
    const { fields: RolesFields, append: RolesAppend, remove: RolesRemove, } = useFieldArray({
        control,
        name: "roles",
    });
    useEffect(() => {
        // RolesFields.forEach(r => RolesRemove(r))
        roles.forEach(r => {
            r.dateStart = new Date(r.dateStart).toISOString().substring(0, 10)
            RolesAppend(r)
        })
    }, [roles])
    //to write on submit
    const send = (data) => {
        console.log(data)
    }
    //to move up
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
                InputProps={{
                    startAdornment: (
                        <Person />
                    ),
                }}
            />
            <TextField
                label='Family Name'
                {...register("familyName")}
                InputProps={{
                    startAdornment: (
                        <Person />
                    ),
                }}
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
                InputProps={{
                    startAdornment: (
                        <Contacts />
                    ),
                }}
            />
            <TextField
                label='Birth date'
                {...register("dateOfBirth")}
                variant='standard'
                type='date'
                margin='dense'
                fullWidth
                InputProps={{
                    startAdornment: (
                        <Cake />
                    ),
                }}
            />
            <TextField
                label='Start date'
                {...register("dateStart")}
                variant='standard'
                type='date'
                margin='dense'
                fullWidth
                InputProps={{
                    startAdornment: (
                        <Today />
                    ),
                }}
            />
            <Select
                label='Gender'
                {...register('gender')}
                defaultValue=''
                fullWidth
            >
                <MenuItem value='' disabled >
                    <Icon name='female' />|
                    <Icon name='male' />
                    Gender</MenuItem>
                <MenuItem value='0' >
                    <Icon name='female' />
                    Female</MenuItem>
                <MenuItem value='1' >
                    <Icon name='male' />
                    Male</MenuItem>
            </Select>
            <Segment>
                <h4>Roles</h4>
                {RolesFields.map((r, index) =>
                    <SegmentGroup horizontal key={r.id}>
                        <Segment>
                            <Form.Field>
                                <FormLabel>Role</FormLabel>
                                <select
                                    {...register(`roles.${index}.name`)}
                                    defaultValue={r.roleId}
                                >
                                    {roleList.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                                </select>
                            </Form.Field>
                        </Segment>
                        <Segment>
                            <FormLabel>A managerial position?</FormLabel>
                            <br />
                            <Switch {...register(`roles.${index}.management`)} defaultChecked={r.management} />
                        </Segment>
                        <Segment>
                            <TextField
                                label='date of start'
                                type='date'
                                {...register(`roles.${index}.dateStart`)}
                                variant='standard'
                                margin='dense'
                                InputProps={{
                                    startAdornment: (
                                        <CalendarToday />
                                    ),
                                }}
                            />
                        </Segment>
                        <Segment>
                            <Button icon='trash' size='medium' onClick={() => { RolesRemove(index) }} />
                        </Segment>
                    </SegmentGroup>
                )}
                <Button animated='vertical' size='big' onClick={() => RolesAppend({ id: 0, name: '', management: false })}>
                    <ButtonContent visible>Add Role</ButtonContent>
                    <ButtonContent hidden>
                        <Icon name='plus' />
                    </ButtonContent>
                </Button>
            </Segment>
            <Button animated='vertical' type='submit'>
                <ButtonContent visible>Save Changes</ButtonContent>
                <ButtonContent hidden>
                    <Icon name='save' />
                </ButtonContent>
            </Button>
        </Form >
    )

}
export default Edit;


