import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Navbaruser() {
  const [permissions,setPermissions] = useState(null)
  const token = localStorage.getItem('token');
  const { role_id } = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
  useEffect(()=>{
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
    getRolePermissions()
  },[])
  const handlelogout = ()=>{
    localStorage.removeItem('token');
    window.location.pathname = '/login'
  }
  return (
    <div className='navbarr'>
        <Link className={window.location.pathname == "/user" ? ("link active") : ("link")} to={"/user"}>Ana Səhifə</Link>
        
        <div onClick={handlelogout} className='link cursor-pointer'>Çıxış Et</div>
    </div>
  )
}

export default Navbaruser