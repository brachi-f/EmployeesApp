import { useSelector } from "react-redux"
import { Button, SidebarPusher, SidebarPushable, Sidebar, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react"
import * as employees from '../services/employees'
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { Segment } from "@mui/icons-material"
import Edit from "./edit"

const List = () => {
    //const navigate = useNavigate()
    const [visible, setVisible] = useState(true)
    const [currentId, setId] = useState();
    const editEmp = (id) => {
        //navigate(`${id}`)
        setId(id)
        setVisible(true)
    }
    const list = useSelector(s => s.employees)
    const toDate = (value) => {
        let date = new Date(value)
        return date.toISOString().substring(0, 10)
    }
    return (
        <>
        <Button onClick={()=>setVisible(!visible)} content='show' icon='user'/>
            <SidebarPushable as={Segment}>
                <Sidebar
                    animation="overlay"
                    inverted
                    onHide={() => setVisible(false)}
                    vertical
                    visible={visible}
                    //width="wide"
                    as={Segment}
                >
                    {currentId ? <Edit id={currentId} /> : <></>}
                </Sidebar>
            </SidebarPushable>
            <Table celled textAlign="center" style={{ width: '50vw' }}>
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
                            {console.log(emp)}
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
            {/* </SidebarPusher> */}

        </>
    )
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
