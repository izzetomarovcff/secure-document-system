import React, { useEffect, useState } from 'react'
import Navbartop from '../../components/Navbartop'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'

function Units() {
    const [permissions, setPermissions] = useState(null)
    const token = localStorage.getItem('token');
    const { role_id } = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
    const [units, setUnits] = useState(null)
    const getUnits = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_IP}/getunits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const sourcedata = await response.json()
            setUnits(sourcedata)
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
        getUnits()
    }, [])
    
    return (
        <div className='users'>
            <Navbartop />
            <div className='group'>
                <Navbar />
                <div className="containerr">
                    <div className="head-group">
                        <div className="head-text">Vahidlər - Siyahı</div>
                        {permissions && permissions.has("add_unit") ? (<Link to={"/superadmin/units/create"} className="lnk-btn btn btn-secondary">Vahid Yarat</Link>) : (<button disabled className="lnk-btn btn btn-secondary">Vahid Yarat</button>)}
                    </div>
                    <div className="container-2">
                        <table>
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Vahid</th>
                                    <th>Vahid Açıqlaması</th>
                                    <th>Proses</th>
                                </tr>
                            </thead>
                            <tbody>
                                {units && units.length > 0? (units.map((element, key) => {
                                    if (!element.deleted_unit) {
                                        return (
                                            <tr key={key}>
                                                <td>{element.id}</td>
                                                <td>{element.unit_name}</td>
                                                <td>{element.unit_description}</td>
                                                <td>
                                                    {permissions && permissions.has("delete_unit") ? (<button className='btn btn-sm btn-danger me-3'>Sil</button>) : (<button disabled className='btn btn-sm btn-danger me-3'>Sil</button>)}

                                                    {permissions && permissions.has("edit_unit") ? (<Link to={`/superadmin/units/edit/${element.id}`} className='btn btn-sm btn-primary'>Dəyişdir</Link>) : (<button className='btn btn-sm btn-primary' disabled>Dəyişdir</button>)}

                                                </td>
                                            </tr>
                                        )
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

export default Units