import { useForm } from 'react-hook-form'
import * as yup from 'yup'

const Edit = () => {

    const empSchema = yup.object({
        firstName: yup.string().required(),
        familyName: yup.string().required(),
        identity: yup.string().min(9).max(9).required(),
        dateOfBirth: yup.date().max(Date.now()).required,
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
    
    return (
        <h1>edit</h1>
    )
}
export default Edit;