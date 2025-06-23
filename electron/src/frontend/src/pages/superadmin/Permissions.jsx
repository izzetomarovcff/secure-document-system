import React, { useEffect, useState } from 'react'
import Navbartop from '../../components/Navbartop'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'
import { Button } from 'bootstrap'

function Permissions() {
  const [permissions, setPermissions] = useState(null)
  useEffect(() => {
    const getPermissions = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_IP}/getpermissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
        })
        const data = await response.json()
        setPermissions(data)
      } catch (error) {
        console.log(error)
      }
    }
    getPermissions()
  }, [])
  return (
    <div className='permissions'>
      <Navbartop />
      <div className='group'>
        <Navbar />
        <div className="containerr">
          <div className="head-group">
            <div className="head-text">Icazələr - Siyahı</div>
            <button to={"/superadmin/permissions/create"} className="lnk-btn btn btn-secondary" disabled>İcazə Yarat</button>
          </div>
          <div className="container-2">
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>İcazə Adı</th>
                  <th>İcazə Etiketi</th>
                  <th>Proses</th>
                </tr>
              </thead>
              <tbody>
                {permissions && permissions.length>0 ? (permissions.map((element, key) => {

                  return (
                    <tr key={key}>
                      <td>{element.id}</td>
                      <td>{element.permission_name_az}</td>
                      <td># {element.name}</td>
                      <td>
                        <button disabled className='btn btn-sm btn-danger me-3'>Sil</button>
                        <button  className='btn btn-sm btn-primary' disabled>Dəyişdir</button>
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

export default Permissions