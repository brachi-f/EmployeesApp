import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Form, Label, Popup } from 'semantic-ui-react'
import * as yup from 'yup'


const Edit = () => {

    const empSchema = yup.object({
        firstName: yup.string().required(),
        familyName: yup.string().required(),
        identity: yup.string().min(9).max(9).required(),
        dateOfBirth: yup.date().required,
        dateStart: yup.date().required(),
        gender: yup.number().min(0).max(1).required(),
        status: yup.bool().default(true),
        roles: yup.array().of(
            yup.object().shape({
                name: yup.number().required(),
                management: yup.bool().required(),
                dateStart: yup.date().required()
            })
        )
    })
    const { register, handleSubmit, formState = { errors }, control } = useForm({
        resolver: yupResolver(empSchema)
    })
    const send = () => {

    }
    const MyInput = ({ type, placeholder, reg, icon }) =>
        <>
            <Popup content={placeholder} trigger={
                <div className="ui left icon input">
                    <input type={type} {...register(`${reg}`)} placeholder={placeholder} />

                    <i aria-hidden="true" className={`${icon} icon`}></i>
                </div>}
            />
        </>
    return (
        <Form onSubmit={handleSubmit(send)}>
            <MyInput type="text" placeholder='First Name' reg="firstName" icon="user" />

            <MyInput type="text" placeholder='Family Name' reg="familyName" icon="user" />
            <MyInput type="text" placeholder='ID Number' reg="identity" icon="id card" />
            <MyInput type="date" placeholder='Date of birth' reg="dateOfBirth" icon="birthday cake" />
            <MyInput type="date" placeholder='Start Date' reg="dateStart" icon="calendar" />
        </Form>
    )

}
export default Edit;

