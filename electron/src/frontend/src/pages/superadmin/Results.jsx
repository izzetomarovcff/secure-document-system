import React, { useEffect, useState } from 'react'
import Navbartop from '../../components/Navbartop'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'

function Results() {
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
  useEffect(()=>{
    getRolePermissions()
  },[])
  return (
    <div className='users'>
      <Navbartop />
      <div className='group'>
        <Navbar />
        <div className="containerr">
          <div className="head-group">
            <div className="head-text">Nəticələr - Siyahı</div>
            {permissions && permissions.has("add_result")?(<Link to={"/superadmin/results/create"} className="lnk-btn btn btn-secondary">Nəticə Yarat</Link>):(<button disabled className="lnk-btn btn btn-secondary">Nəticə Yarat</button>)}
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Results