import React, { useEffect, useState } from 'react'
import Navbartop from '../../components/Navbartop'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'

function Roles() {
  const [roles, setRoles] = useState(null)
  const [permissions, setPermissions] = useState(null)
  const token = localStorage.getItem('token');
  const { role_id } = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
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
  const getRoles = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_IP}/getroles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      const data = await response.json()
      setRoles(data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {

    getRoles()
    getRolePermissions()
  }, [])
  return (
    <div className='roles'>
      <Navbartop />
      <div className='group'>
        <Navbar />
        <div className="containerr">
          <div className="head-group">
            <div className="head-text">Rollar - Siyahı</div>
            <button to={"/superadmin/permissions/create"} className="lnk-btn btn btn-secondary" disabled>Rol Yarat</button>
          </div>
          <div className="container-2">
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>Rol Adı</th>
                  <th>Proses</th>
                </tr>
              </thead>
              <tbody>
                {roles && roles.length>0 ? (roles.map((element, key) => {
                  
                  return (
                    <tr key={key}>
                      <td>{element.id}</td>
                      <td>{element.role_name}</td>
                      <td>
                        <button disabled className='btn btn-sm btn-danger me-3'>Sil</button>
                        {permissions && permissions.has("edit_role")?(<Link to={`/superadmin/roles/edit/${element.id}`} className='btn btn-sm btn-primary'>Dəyişdir</Link>):(<button disabled className='btn btn-sm btn-primary'>Dəyişdir</button>)}
                        

                      </td>
                    </tr>
                  )


                })) : (null)}

              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Roles