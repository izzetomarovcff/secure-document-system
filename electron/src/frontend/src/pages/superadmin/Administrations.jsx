import React, { useEffect, useState } from 'react'
import Navbartop from '../../components/Navbartop'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'

function Administrations() {
  const [permissions, setPermissions] = useState(null)
  const token = localStorage.getItem('token');
  const { role_id } = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
  const [administrations, setAdministrations] = useState(null)
  const getAdministrations = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_IP}/getadministrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      const sourcedata = await response.json()
      setAdministrations(sourcedata)
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
    getAdministrations()
  }, [])
  const handledelete = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_API_IP}/deleteadministration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(id) })
      });
      getAdministrations()

    } catch (error) {
      console.log(error)
    }

  }
  return (
    <div className='administrations'>
      <Navbartop />
      <div className='group'>
        <Navbar />
        <div className="containerr">
          <div className="head-group">
            <div className="head-text">İdarələr - Siyahı</div>
            {permissions && permissions.has("add_administration") ? (<Link to={"/superadmin/administrations/create"} className="lnk-btn btn btn-secondary">İdarə Yarat</Link>) : (<button disabled className="lnk-btn btn btn-secondary">İdarə Yarat</button>)}

          </div>
          <div className="container-2">
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>İdarə Adı</th>
                  <th>Proses</th>
                </tr>
              </thead>
              <tbody>
                {administrations && administrations.length>0 ? (administrations.map((element, key) => {
                  if (!element.deleted_administration) {
                    return (
                      <tr key={key}>
                        <td>{element.id}</td>
                        <td>{element.administration_name}</td>
                        <td>
                          {permissions && permissions.has("delete_administration")?(<button onClick={() => { handledelete(element.id) }} className='btn btn-sm btn-danger me-3'>Sil</button>):(<button disabled className='btn btn-sm btn-danger me-3'>Sil</button>)}
                          
                          {permissions && permissions.has("edit_administration")?(<Link to={`/superadmin/administrations/edit/${element.id}`} className='btn btn-sm btn-primary'>Dəyişdir</Link>):(<button className='btn btn-sm btn-primary' disabled>Dəyişdir</button>)}
                          
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

export default Administrations