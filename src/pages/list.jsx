import { useSelector } from "react-redux"
import { Button, Input, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react"
import * as employees from '../services/employees'
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"

const List = () => {
    const navigate = useNavigate()
    const editEmp = (id) => {
        navigate(`edit/${id}`)
    }
    const [text, setText] = useState("");

    const list = useSelector(s => s.employees);
    const [updateList, setList] = useState([]);
    const toDate = (value) => {
        let date = new Date(value);
        return date.toISOString().substring(0, 10);
    }
    useEffect(() => {
        setList(list)
    }, [])

    return (
        <>
            <Input className="search"
                fluid icon='search' placeholder='Search...'
                onChange={(e) => {
                    setText(e.target.value) 
                    setList(list.filter(e => !text || e.firstName.includes(text) || e.familyName.includes(text)))
                }}
                color='purple' size='huge' inverted style={{ width: '100vw', backgroundColor: '#2b2b2b' }} />
            <Table celled inverted textAlign="center" style={{ width: '100vw' }}>
                <TableHeader>
                    <TableRow>
                        <TableHeaderCell>ID number</TableHeaderCell>
                        <TableHeaderCell>Last Name</TableHeaderCell>
                        <TableHeaderCell>First Name</TableHeaderCell>
                        <TableHeaderCell>Start Date</TableHeaderCell>
                        <TableHeaderCell></TableHeaderCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {updateList.map((emp) =>
                        <TableRow key={emp.id}>
                            <TableCell>{emp.identity}</TableCell>
                            <TableCell>{emp.familyName}</TableCell>
                            <TableCell>{emp.firstName}</TableCell>
                            <TableCell>{toDate(emp.dateStart)}</TableCell>
                            <TableCell>
                                <Button icon='trash' onClick={() => deleteEmp(emp.id)} />
                                <Button icon='edit' onClick={() => editEmp(emp.id)} />
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}

export default List;
const deleteEmp = (id) => {
    Swal.fire({
        showConfirmButton: true,
        showCloseButton: true,
        icon: 'question',
        text: 'Are you sure?'
    }).then(res => {
        if (res.isConfirmed)
            employees.deleteEmployee(id).then(res => {
                Swal.fire({
                    icon: "success",
                    showConfirmButton: false,
                    title: 'Deleted successfully',
                    timer: 1500
                })
            }).catch(err => {
                Swal.fire({
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1500,
                    text: err.message
                })
            })
    })
}
