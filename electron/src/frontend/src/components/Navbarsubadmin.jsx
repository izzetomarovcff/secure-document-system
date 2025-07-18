import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Navbarsubadmin() {
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
        <Link className={window.location.pathname == "/subadmin" ? ("link active") : ("link")} to={"/subadmin"}>Ana Səhifə</Link>
        {permissions && permissions.has("view_users")?(<Link className={window.location.pathname.includes("users") ? ("link active") : ("link")} to={"/subadmin/users"}>İstifadəçilər</Link>):(null)}
        {permissions && permissions.has("view_sendeds")?(<Link className={window.location.pathname.includes("sendeds") ? ("link active") : ("link")} to={"/subadmin/sendeds"}>Göndərilənlər</Link>):(null)}
        {permissions && permissions.has("view_reciveds")?(<Link className={window.location.pathname.includes("reciveds") ? ("link active") : ("link")} to={"/subadmin/reciveds"}>Qəbul Edilənlər</Link>):(null)}
        <div onClick={handlelogout} className='link cursor-pointer'>Çıxış Et</div>
    </div>
  )
}

export default Navbarsubadmin