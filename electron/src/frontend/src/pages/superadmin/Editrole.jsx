import React, { useEffect, useState } from 'react'
import Navbartop from '../../components/Navbartop'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'

function Editrole() {
  const [permissions, setPermissions] = useState(null)
  const [rolePermissions, setRolePermissions] = useState(null)
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
    const getRolePermissions = async () => {
      try {
        const idarr = window.location.pathname.split("/")
        const response = await fetch(`${process.env.REACT_APP_API_IP}/getrolepermissions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ role_id: Number(idarr[4]) })  // send username in body
        });
        const data = await response.json()
        const selectedIds = new Set(data.map(p => p.id));
        setRolePermissions(selectedIds)
      } catch (error) {
        console.log(error)
      }
    }
    getRolePermissions()
    getPermissions()
  }, [])
  const togglePermission = (permissionId) => {
    setRolePermissions(prev => {
      const newSet = new Set(prev); // Clone the current set
      if (newSet.has(permissionId)) {
        newSet.delete(permissionId); // Remove if already selected
      } else {
        newSet.add(permissionId); // Add if not selected
      }
      return newSet; // Return the new Set
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const idarr = window.location.pathname.split("/");
    const role_id = Number(idarr[4]);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_IP}/updaterolepermissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          role_id,
          permissions: Array.from(rolePermissions)
        })
      });

      const result = await response.json();
      alert(result.message || "Əməliyyat tamamlandı");
    } catch (error) {
      console.error("Update error:", error);
      alert("Xəta baş verdi!");
    }
  };

  return (
    <div className='editrole'>
      <Navbartop />
      <div className='group'>
        <Navbar />
        <div className="containerr">
          <div className="head-group">
            <div className="head-text">Rollar - Dəyişdir</div>
            <Link to={"/superadmin/roles"} className="lnk-btn btn btn-danger">Ləğv Et</Link>
          </div>
          {permissions ? (
            <div className='container-2'>

              <form onSubmit={handleSubmit} className='form-control form d-flex flex-row flex-wrap pt-3'>
                {permissions ? (
                  permissions.map((element, key) => {
                    if (element.name != "active_user") {
                      return (
                        <div className="inputgroup w-25" key={key}>
                          <div className='mb-3  p-2'>
                            <input onChange={() => togglePermission(element.id)} className='me-2' type="checkbox" checked={rolePermissions.has(element.id)} name={element.name} id={element.name} />
                            <label htmlFor={element.name} className='form-label'>{element.permission_name_az}</label>
                          </div>
                        </div>
                      )
                    }

                  })
                ) : (null)}

                <div className="inputgroup w-100">
                  <button type='submit' className='btn m-2'>Yadda Saxla</button>
                </div>

              </form>
            </div>
          ) : (null)}

        </div>
      </div>
    </div>
  )
}

export default Editrole