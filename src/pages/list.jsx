import { useSelector } from "react-redux"
import { Button, Table, TableBody, TableCell, TableHeader, TableHeaderCell, TableRow } from "semantic-ui-react"


const List = () => {
    const list = useSelector(s => s.employees)
    console.log(list)
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
                                <Button icon='edit'/>
                                <Button icon='trash'/>
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