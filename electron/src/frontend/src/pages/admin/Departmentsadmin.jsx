import React, { useEffect, useState } from 'react'
import Navbartop from '../../components/Navbartop'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'
import Navbaradmin from '../../components/Navbaradmin'
import Navbartopadmin from '../../components/Navbartopadmin'

function Departmentsadmin() {
    const [departments, setDepartments] = useState(null)
    const [permissions, setPermissions] = useState(null)
    const token = localStorage.getItem('token');
    const { role_id,administration_id } = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
    const getdepartments = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_IP}/getdepartmentsbyadminstrationid`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ administration_id: Number(administration_id) })  // send username in body
            });
            const data = await response.json()
            setDepartments(data)
        } catch (error) {
            console.log(error)
        }
    }
    const getRolePermissions = async () => {
        try {

            const response = await fetch(`${process.env.REACT_APP_API_IP}/getrolepermissions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ role_id: Number(role_id) })  // send username in body
            });
            const data = await response.json()
            const have_permissions = new Set(data.map(p => p.name));
            setPermissions(have_permissions)
        } catch (error) {
            console.log(error)

        }
    }
    useEffect(() => {
        getRolePermissions()
        getdepartments()
    }, [])
    const handledelete = async (id) => {
        try {
            await fetch(`${process.env.REACT_APP_API_IP}/deletedepartment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: Number(id) })
            });
            getdepartments()

        } catch (error) {
            console.log(error)
        }

    }
    return (
        <div className='departments'>
            <Navbartopadmin />
            <div className='group'>
                <Navbaradmin />
                <div className="containerr">
                    <div className="head-group">
                        <div className="head-text">Şövbələr - Siyahı</div>
                        {permissions && permissions.has("add_department") ? (<Link to={"/admin/departments/create"} className="lnk-btn btn btn-secondary">Şövbə Yarat</Link>) : (<button disabled className="lnk-btn btn btn-secondary">Şövbə Yarat</button>)}

                    </div>
                    <div className="container-2">
                        <table>
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Şövbə Adı</th>
                                    <th>Proses</th>
                                </tr>
                            </thead>
                            <tbody>
                                {departments && departments.length>0 ? (departments.map((element, key) => {
                                    if (element.deleted_administration) {

                                    } else {
                                        if (!element.deleted_department) {
                                            return (
                                                <tr key={key}>
                                                    <td>{element.id}</td>
                                                    <td>{element.department_name}</td>
                                                    <td>
                                                        {permissions && permissions.has("delete_department") ? (<button onClick={() => { handledelete(element.id) }} className='btn btn-sm btn-danger me-3'>Sil</button>) : (<button disabled className='btn btn-sm btn-danger me-3'>Sil</button>)}
                                                        {permissions && permissions.has("edit_department") ? (<Link to={`/admin/departments/edit/${element.id}`} className='btn btn-sm btn-primary'>Dəyişdir</Link>) : (<button disabled className='btn btn-sm btn-primary'>Dəyişdir</button>)}


                                                    </td>
                                                </tr>
                                            )
                                        }
                                    }


                                })) : (null)}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Departmentsadmin