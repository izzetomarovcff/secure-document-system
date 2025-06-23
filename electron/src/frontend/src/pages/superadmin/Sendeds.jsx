import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Navbartop from '../../components/Navbartop'
import { Link } from 'react-router-dom';

function Sendeds() {
  const [permissions, setPermissions] = useState(null)
  const token = localStorage.getItem('token');
  const { role_id, id } = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
  const [sendeds, setSendeds] = useState(null)
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
  const getSendeds = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_IP}/getsendedsbyid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: Number(id) })  // send username in body
      });
      const sourcedata = await response.json()
      setSendeds(sourcedata.reverse())
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getRolePermissions()
    getSendeds()
  }, [])
  return (
    <div className='administrations'>
      <Navbartop />
      <div className='group'>
        <Navbar />
        <div className="containerr">
          <div className="head-group">
            <div className="head-text">Göndərilənlər - Siyahı</div>
            {permissions && permissions.has("can_send_document") ? (<Link to={"/superadmin/sendeds/send"} className="lnk-btn btn btn-secondary">Yeni Sənəd Göndər</Link>) : (<button disabled className="lnk-btn btn btn-secondary">Yeni Sənəd Göndər</button>)}
          </div>
          <div className="container-2">
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>Başlıq</th>
                  <th>Fayl</th>
                  <th>Qəbul Edən</th>
                  <th>Tarix</th>
                  <th>Saat</th>

                  <th>Proses</th>
                </tr>
              </thead>
              <tbody>
                {sendeds && sendeds.length > 0 ? (sendeds.map((element, key) => {
                  if (!element.deleted_sendeds) {
                    return (
                      <tr key={key}>
                        <td>{element.id}</td>
                        <td>{element.title}</td>
                        <td>{element.orginal_file_name}</td>
                        <td>{element.username}</td>
                        <td>{element.date}</td>
                        <td>{element.time}</td>
                        <td>
                          {/* {permissions && permissions.has("delete_sended")?(<button  className='btn btn-sm btn-danger me-3'>Sil</button>):(<button disabled className='btn btn-sm btn-danger me-3'>Sil</button>)} */}

                          {permissions && permissions.has("view_sendeds") ? (<Link to={`/superadmin/sendeds/view/${element.id}`} className='btn btn-sm btn-primary'>Bax</Link>) : (<button className='btn btn-sm btn-primary' disabled>Bax</button>)}

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

export default Sendeds