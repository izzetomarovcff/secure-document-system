import React, { useEffect, useState } from 'react'
import Navbartopsubadmin from '../../components/Navbartopsubadmin'
import Navbarsubadmin from '../../components/Navbarsubadmin'
import { Link } from 'react-router-dom';

function Recivedssubadmin() {
    const [permissions, setPermissions] = useState(null)
    const token = localStorage.getItem('token');
    const { role_id, id } = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
    const [reciveds, setReciveds] = useState(null)
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
    const getReciveds = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_IP}/getrecivedsbyid`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: Number(id) })  // send username in body
            });
            const sourcedata = await response.json()
            setReciveds(sourcedata.reverse())
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        getRolePermissions()
        getReciveds()
    },[])
    return (
        <div className='administrations'>
            <Navbartopsubadmin />
            <div className='group'>
                <Navbarsubadmin />
                <div className="containerr">
                    <div className="head-group">
                        <div className="head-text">Qəbul Edilənlər - Siyahı</div>
                    </div>
                    <div className="container-2">
                        <table>
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>Başlıq</th>
                                    <th>Fayl</th>
                                    <th>Göndərən</th>
                                    <th>Tarix</th>
                                    <th>Saat</th>

                                    <th>Proses</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reciveds && reciveds.length > 0 ? (reciveds.map((element, key) => {
                                    if (!element.deleted_recived) {
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

                                                    {permissions && permissions.has("view_reciveds") ? (<Link to={`/subadmin/reciveds/view/${element.id}`} className='btn btn-sm btn-primary'>Bax</Link>) : (<button className='btn btn-sm btn-primary' disabled>Bax</button>)}

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

export default Recivedssubadmin