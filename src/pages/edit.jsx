import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, ButtonContent, Checkbox, Form, Icon, Segment, SegmentGroup } from 'semantic-ui-react'
import * as yup from 'yup'
import { useParams } from 'react-router-dom'
import * as empService from '../services/employees'
import { FormControl, FormLabel, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'


const Edit = () => {
    const [employee, setEmployee] = useState(null);
    const [roles, setRoles] = useState([]);
    const [choosenRoles, setChoosenRoles] = useState([])
    let { id } = useParams();
    const roleList = useSelector(s => s.roles)
    const getRole = (id) => {
        return roleList.find(r => r.id == id)
    }
    const [options, setOptions] = useState([])
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
        setOptions(roleList.map((rl) =>
        ({ key: rl.id, value: rl.id, text: rl.name, disabled: choosenRoles.includes(rl.id) }
        )))
        console.log(options)
    }, [choosenRoles])
    useEffect(() => {
        setChoosenRoles([])
        let temp = []
        roles?.map((r) => {
            r.dateStart = new Date(r.dateStart).toISOString().substring(0, 10)
            RolesAppend(r)
            temp.push(r.roleId)
        })
        setChoosenRoles(temp)
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
                {...register('gender')}
                value={employee?.gender || '2'}
                fullWidth
            >
                <MenuItem value='2' disabled >
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
                                <select {...register(`roles.${index}.name`)} defaultValue={r.roleId} onChange={(e) => {
                                    let temp = choosenRoles
                                    temp[index] = e.target.value
                                    setChoosenRoles(temp)
                                }}>
                                    {options.map((opt) =>
                                        <option key={opt.key} value={opt.value} disabled={opt.disabled || opt.key==r.roleId} onClick={()=>opt.disabled = !opt.disabled}>{opt.text}</option>
                                    )}
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
/*
// Update the selected roles in choosenRoles state and trigger re-render of options
const handleSelectChange = (index, selectedRoleId) => {
    setChoosenRoles(prevChoosenRoles => {
        const updatedChoosenRoles = [...prevChoosenRoles]; // Create a copy of choosenRoles array
        updatedChoosenRoles[index] = selectedRoleId; // Update the selected role at the corresponding index
        return updatedChoosenRoles;
    });
};
*/
/*
I'm only able to provide assistance related to programming and code topics.


If you are encountering an error message in MUI saying that it cannot switch from a controlled to an uncontrolled field, you might want to ensure that you are setting the default value properly for the controlled components.


You can resolve this issue by checking the way you are setting default values for the controlled components like the Select component in Material-UI. Make sure you are updating the value correctly based on the existing data while using hookform.


One approach is to set the default value for the gender field using setValue after employee is set. This way, you can avoid the error related to switching from controlled to uncontrolled fields.

מה זה רכיב מבוקר ומה זה רכיב לא מבוקר?

A controlled component is a React component where the value of the component is controlled by React state. This means that the component's value is managed by React state and updated through state changes. Controlled components provide a single source of truth for the value, allowing React to have full control over the component's behavior.


On the other hand, an uncontrolled component is a component where the value is handled by the DOM itself. In uncontrolled components, the state is not managed by React but rather by the DOM. The value of an uncontrolled component is usually set using a default or initial value in the HTML markup, and then the value is read directly from the DOM when needed.


In the context of forms in React, controlled components are generally preferred because they provide a more predictable and manageable way to handle form input values and changes. Controlled components help maintain the component state within the React component hierarchy.

ואיך אפשר להגדיר שדה כמבוקר או לא

You can define a field as controlled or uncontrolled in React based on whether its value is controlled by React state (controlled) or by the DOM itself (uncontrolled).


To explicitly determine if a field is controlled or uncontrolled, you need to consider how the value of the field is managed and updated. If the value of the field is directly set by React state and updated through state changes, then it is a controlled component. On the other hand, if the value of the field is set in the HTML markup and read directly from the DOM, it is considered an uncontrolled component.


In React, you can explicitly set a field as controlled by managing its value through React state using methods like useState or useReducer, ensuring that changes to the value are handled through state updates. For uncontrolled components, the value is typically managed by the DOM, and React does not have direct control over its value changes.
*/
