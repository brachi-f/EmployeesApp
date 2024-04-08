import { useSelector } from "react-redux"
import { Button, Icon, Input, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react"
import * as employees from '../services/employees'
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { debounce } from 'lodash'
import { utils, write } from 'xlsx'

const List = () => {
    const navigate = useNavigate()
    const editEmp = (id) => {
        navigate(`edit/${id}`)
    }

    const list = useSelector(s => s.employees);
    const [updateList, setList] = useState([]);
    const toDate = (value) => {
        let date = new Date(value);
        return date.toISOString().substring(0, 10);
    }
    useEffect(() => {
        setList(list)
    }, [list])
    const searchTextDelayed = debounce((inputText) => {
        inputText = inputText.toLowerCase()
        setList(list.filter(e => !inputText || e.firstName.toLowerCase().includes(inputText) || e.familyName.toLowerCase().includes(inputText)));
    }, 600);

    const handleSearchChange = (e) => {
        searchTextDelayed(e.target.value);
    }
    const exportToExcel = (value) => {
        const ws = utils.json_to_sheet(value.map(emp => ({
            'id': emp.id,
            'TZ': emp.identity,
            'Last Name': emp.familyName,
            'First Name': emp.firstName,
            'Date of birth': toDate(emp.dateOfBirth),
            'Start Date': toDate(emp.dateStart),
            'Gender': emp.gender == 0 ? 'female' : 'male',
            'Status': emp.status
        })));

        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, 'Employees');

        const wbout = write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'employees.xlsx';
        a.click();
        URL.revokeObjectURL(url);
    }
    return (
        <>
            <Input className="search"
                fluid placeholder='Search...'
                onChange={handleSearchChange} icon={'search'}
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
            <Button icon size="large" color="purple" onClick={() => exportToExcel(updateList)}>
                Download this list
                <Icon name='download' />
            </Button >
            <Button icon size="large" color="purple" onClick={() => {
                employees.getAllEmployees().then(res => {
                    exportToExcel(res.data)
                }).catch(err => console.log("err accured while getting all employees", err.error.message))
            }}>
                Download whole list
                <Icon name='download' />
            </Button >
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
