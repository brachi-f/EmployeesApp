import { useSelector } from "react-redux"
import { Button, Segment, SidebarPusher, SidebarPushable, Sidebar, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react"
import * as employees from '../services/employees'
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import Edit from "./edit"
import { Height } from "@mui/icons-material"

const List = () => {
    const navigate = useNavigate()
    const editEmp = (id) => {
        navigate(`edit/${id}`)
    }

    const list = useSelector(s => s.employees);

    const toDate = (value) => {
        let date = new Date(value);
        return date.toISOString().substring(0, 10);
    }

    return (
        <>
        {/* <div className="back"> */}
                <Table celled inverted textAlign="center" style={{width:'80vw'}}>
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
                        {list.map((emp) =>
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
                {/* </div> */}
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
