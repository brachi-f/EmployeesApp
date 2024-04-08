import Swal from 'sweetalert2'
import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, ButtonContent, Form, Icon, Segment, SegmentGroup } from 'semantic-ui-react'
import * as yup from 'yup'
import { useParams, useNavigate } from 'react-router-dom'
import * as empService from '../services/employees'
import { FormLabel, FormControl, MenuItem, Select, Switch, TextField, InputLabel, OutlinedInput } from '@mui/material'
import { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Cake, CalendarToday, Contacts, FamilyRestroomTwoTone, Person, Today } from '@mui/icons-material'
import * as actions from '../store/action'




const Edit = () => {
    const [employee, setEmployee] = useState();
    const [roles, setRoles] = useState([]);
    const roleList = useSelector(s => s.roles);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    let { id } = useParams()
    useEffect(() => {
        console.log(id)
        if (id > 0) {
            empService.getEmployeeById(id).then(res => {
                setEmployee(res.data)
            }).catch(err => console.error("Error by getting employee by id: ", err))
            empService.getRolesOfEmployee(id).then(res => {
                setRoles(res.data)
            }).catch(err => console.error('Error by getting roles of employee: ', err))
        }
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
                roleId: yup.number().required(),
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
        RolesFields.forEach(r => RolesRemove(r))
        roles.forEach(r => {
            r.dateStart = new Date(r.dateStart).toISOString().substring(0, 10)
            RolesAppend(r)
        })
    }, [roles])

    const send = async (data) => {
        if (!id) {
            empService.addEmployee(data).then(res => {
                dispatch({ type: actions.ADD_EMPOLOYEE, data: res.date })
                console.log(res.data)
                data.roles.forEach(r => {
                    let roleToSend = { roleId: r.roleId, employeeId: res.data.id, dateStart: new Date(r.dateStart), management: r.management };
                    empService.addEmpRole(roleToSend).then(res => {
                        console.log("role add", res.data)
                    }).catch(err => console.error(err))
                })
            }).then(() => {
                Swal.fire({
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    title: 'Added successfully'
                })
            }).catch(err => {
                if (err.response.status == 409)
                    Swal.fire({
                        icon: 'error',
                        title: 'ID number already exists',
                        showConfirmButton: false,
                        timer: 1500
                    })
                else
                    console.error(err)
            })

        } else
            try {
                // Array to keep track of errors
                let errors = [];

                // Update employee fields
                await empService.updateEmployeeFields(data.id, data);
                console.log('Fields updated successfully!');
                dispatch({ type: actions.UPDATE_EMPLOYEE, data: data });

                // Array of Promise to store all role update promises
                let rolePromises = data.roles.map(async (r) => {
                    let roleToSend = { roleId: r.roleId, employeeId: id, dateStart: new Date(r.dateStart), management: r.management };
                    let existing = roles.find(l => l.id === r.id);

                    if (existing) {
                        let change = !(existing.management === r.management && existing.roleId === r.roleId && new Date(existing.dateStart).toDateString() === new Date(r.dateStart).toDateString());

                        if (change) {
                            await empService.updateEmpRole(r.id, roleToSend);
                            console.log('Role updated', r);
                        }
                    } else {
                        await empService.addEmpRole({ ...roleToSend, id: r.id });
                        console.log('Role added', r);
                    }
                });

                // Await all role update promises
                await Promise.all(rolePromises);

                // Delete roles not present in the updated data
                let deletePromises = roles.filter(r => !data.roles.some(l => l.id === r.id))
                    .map(async (r) => {
                        await empService.deleteEmpRole(r.id);
                        console.log('Role deleted', r);
                    });

                // Await all role delete promises
                await Promise.all(deletePromises);
                Swal.fire({
                    icon: 'success',
                    title: 'update successfully',
                    showConfirmButton: false,
                    timer: 2000
                })
                navigate('/employees')

            } catch (err) {
                console.error('Error occurred during updates:', err);
            }
    };
    //to move up
    useEffect(() => {
        reset(employee);
    }, [employee]);

    return (
      <div className='container'>

        <Segment style={{ width: '60vw',backgroundColor: '#ffffffad' }}  color='purple' >
            <Form onSubmit={handleSubmit(send)} >
                <TextField
                    autoFocus
                    color='secondary'
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
                    color='secondary'
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
                    color='secondary'
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
                    color='secondary'
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
                    color='secondary'
                    variant='standard'
                    type='date'
                    margin='dense'
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <Today/>
                        ),
                    }}
                />
                <Select
                    label='Gender'
                    color='secondary'
                    {...register('gender')}
                    defaultValue=''
                    fullWidth
                >
                    <MenuItem value='' disabled >
                        <Icon name='female' />|
                        <Icon name='male' />
                        Gender</MenuItem>
                    <MenuItem value='0'>
                        <Icon name='female' />
                        Female</MenuItem>
                    <MenuItem value='1' >
                        <Icon name='male' />
                        Male</MenuItem>
                </Select>
                <Segment color='purple' style={{backgroundColor: 'transparent'}}>
                    <h4>Roles</h4>
                    {RolesFields.map((r, index) =>
                        <SegmentGroup horizontal key={r.id} style={{backgroundColor: 'transparent'}}>
                            <Segment color='purple'>
                                <Form.Field  color='secondary'>
                                    <FormLabel>Role</FormLabel>
                                    <select
                                        {...register(`roles.${index}.roleId`)}
                                        defaultValue={r.roleId}
                                    >
                                        {roleList.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                                    </select>
                                </Form.Field>
                            </Segment>
                            <Segment color='purple' style={{backgroundColor: 'transparent'}}>
                                <FormLabel>A managerial position?</FormLabel>
                                <br />
                                <Switch  color='secondary' {...register(`roles.${index}.management`)} defaultChecked={r.management} />
                            </Segment>
                            <Segment color='purple' style={{backgroundColor: 'transparent'}}>
                                <TextField
                                 color='secondary'
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
                            <Segment color='purple' style={{backgroundColor: 'transparent'}}>
                                <Button color='purple' icon='trash' size='medium' onClick={() => { RolesRemove(index) }} />
                            </Segment>
                        </SegmentGroup>
                    )}
                    <Button color='purple' animated='vertical' size='big' onClick={() => RolesAppend({ id: 0, roleId: '', management: false })}>
                        <ButtonContent visible>Add Role</ButtonContent>
                        <ButtonContent hidden>
                            <Icon name='plus' />
                        </ButtonContent>
                    </Button>
                </Segment>
                <Button color='purple' animated='vertical' type='submit'>
                    <ButtonContent visible>Save Changes</ButtonContent>
                    <ButtonContent hidden>
                        <Icon name='save' />
                    </ButtonContent>
                </Button>
            </Form >
        </Segment>
        </div>
    )

}
export default Edit;


