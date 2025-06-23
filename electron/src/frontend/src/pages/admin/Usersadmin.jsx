import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom'
import Navbartopadmin from '../../components/Navbartopadmin';
import Navbaradmin from '../../components/Navbaradmin';

function Usersadmin() {
  const [users, setUsers] = useState(null)
  const [permissions, setPermissions] = useState(null)
  const token = localStorage.getItem('token');
  const { role_id, administration_id } = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
  const getusers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_IP}/getusers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // send username in body
      });
      const data = await response.json()
      setUsers(data)
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
    getusers()
  }, [])
  const handleLogin = async (username, password) => {


    try {
      const res = await axios.post(`${process.env.REACT_APP_API_IP}/login`, { username: username, password: password });
      if (res.data.message === "Login successful") {
        localStorage.setItem('token', res.data.token);
        const decoded = jwtDecode(res.data.token);
        const exp = decoded.exp * 1000; // convert to ms
        const timeout = exp - Date.now();
        const { role } = JSON.parse(atob(res.data.token.split('.')[1]));
        if (role == "superadmin") {
          window.location.pathname = "superadmin"
        } else if (role == "admin") {
          window.location.pathname = "admin"
        } else if (role == "subadmin") {
          window.location.pathname = "subadmin"
        } else if (role == "user") {
          window.location.pathname = "user"
        }
        if (timeout > 0) {
          setTimeout(() => {
            localStorage.removeItem('token');
            window.location.pathname = "/login"
          }, timeout);
        }

      } else {
        localStorage.setItem('token', null);
        window.location.pathname = "/login"
      }

    } catch (err) {
      console.log(err)
    }
  }
  const handledelete = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_API_IP}/deleteuser`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(id) })
      });
      getusers()

    } catch (error) {
      console.log(error)
    }

  }
  return (
    <div className='users'>
      <Navbartopadmin />
      <div className='group'>
        <Navbaradmin />
        <div className="containerr">
          <div className="head-group">
            <div className="head-text">İstifadəçilər - Siyahı</div>
            {permissions && permissions.has("add_user") ? (<Link to={"/admin/users/create"} className="lnk-btn btn btn-secondary">Istifadəçi Yarat</Link>) : (<button disabled className="lnk-btn btn btn-secondary">Istifadəçi Yarat</button>)}
          </div>
          <div className="container-2">
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>Ad</th>
                  <th>Soy Ad</th>
                  <th>İdaarə</th>
                  <th>Şövbə</th>
                  <th>Rol</th>
                  <th>Proses</th>
                </tr>
              </thead>
              <tbody>
                {users && users.length>0 ? (users.map((element, key) => {
                  if (!element.deleted_user) {
                    if (element.administration_id == administration_id) {
                      if (element.role_name == "subadmin" || element.role_name == "user") {
                        return (
                          <tr key={key}>
                            <td>{element.id}</td>
                            <td>{element.name}</td>
                            <td>{element.surname}</td>
                            <td>{element.administration_name}</td>
                            <td>{element.department_name}</td>
                            <td>{element.role_name}</td>
                            <td>
                              {permissions && permissions.has("delete_user") ? (<button onClick={() => { handledelete(element.id) }} className='btn btn-sm btn-danger me-3'>Sil</button>) : (<button disabled className='btn btn-sm btn-danger me-3'>Sil</button>)}
                              {permissions && permissions.has("edit_user") ? (<Link to={`/admin/users/edit/${element.id}`} className='btn btn-sm btn-primary me-3'>Dəyişdir</Link>) : (<button disabled className='btn btn-sm btn-primary me-3'>Dəyişdir</button>)}
                              {permissions && permissions.has("login_users") ? (<button onClick={() => { handleLogin(element.username, element.password) }} className='btn btn-sm btn-success'>Daxil Ol</button>) : (<button disabled className='btn btn-sm btn-success'>Daxil Ol</button>)}

                            </td>
                          </tr>
                        )
                      }

                    }

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

export default Usersadmin