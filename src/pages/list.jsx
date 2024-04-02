import { useSelector } from "react-redux"
import { Button, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react"
import * as employees from '../services/employees'
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"

const List = () => {
    const list = useSelector(s => s.employees)
    return (
        <>
            <Table celled>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell></TableHeaderCell>
                        <TableHeaderCell>תאריך התחלה</TableHeaderCell>
                        <TableHeaderCell>שם פרטי</TableHeaderCell>
                        <TableHeaderCell>שם משפחה</TableHeaderCell>
                        <TableHeaderCell>תעודת זהות</TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {list.map((emp) => 
                        <TableRow>
                            <TableCell>
                                <Button icon='edit' onClick={()=>deleteEmp(emp.id)} />
                                <Button icon='trash' onClick={()=>editEmp(emp.id)}/>
                            </TableCell>
                            <TableCell>{emp.dateStart}</TableCell>
                            <TableCell>{emp.firstName}</TableCell>
                            <TableCell>{emp.familyName}</TableCell>
                            <TableCell>{emp.identity}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}
export default List;

const deleteEmp = (id)=>{
    employees.deleteEmployee(id).then(res=>{
        Swal.fire({
            icon: "success",
            showConfirmButton: false,
            title: 'נמחק בהצלחה',
            timer:1500
        })
    }).catch(err=>{
        Swal.fire({
            icon: 'error',
            showConfirmButton:false,
            timer: 1500,
            text: err.message
        })
    })
}

const editEmp = (id)=>{
    const navigate = useNavigate()
    navigate(`/${id}`)
}