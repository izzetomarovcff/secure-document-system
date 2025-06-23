import React, { useEffect, useState } from 'react'
import Navbartop from '../../components/Navbartop'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'

function Criterions() {
  const [permissions, setPermissions] = useState(null)
  const token = localStorage.getItem('token');
  const { role_id } = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
  const [criterions, setCriterions] = useState(null)
  const getCriterions = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_IP}/getcriterions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      const sourcedata = await response.json()
      setCriterions(sourcedata)
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
    getCriterions()
  }, [])
  const handledelete = async (id) => {
    try {
      await fetch(`${process.env.REACT_APP_API_IP}/deletecriterion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: Number(id) })
      });
      getCriterions()

    } catch (error) {
      console.log(error)
    }

  }
  return (
    <div className='users'>
      <Navbartop />
      <div className='group'>
        <Navbar />
        <div className="containerr">
          <div className="head-group">
            <div className="head-text">Kriteriyalar - Siyahı</div>
            {permissions && permissions.has("add_criterion") ? (<Link to={"/superadmin/criterions/create"} className="lnk-btn btn btn-secondary">Kriteriya Yarat</Link>) : (<button disabled className="lnk-btn btn btn-secondary">Kriteriya Yarat</button>)}
          </div>
          <div className="container-2">
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>Kriteriya</th>
                  <th>Kriteriya Açıqlaması</th>
                  <th>Vahid</th>
                  <th>Əksinə İşləyir</th>
                  <th>Yaş Təsiri</th>
                  <th>Proses</th>
                </tr>
              </thead>
              <tbody>
                {criterions && criterions.length>0 ? (criterions.map((element, key) => {
                  if (!element.deleted_criterion) {
                    return (
                      <tr key={key}>
                        <td>{element.id}</td>
                        <td>{element.criterion_name}</td>
                        <td>{element.criterion_description}</td>
                        <td>{element.unit_name}</td>
                        <td>{element.reversed?("Hə"):("Yox")}</td>
                        <td>{element.age_effect?("Hə"):("Yox")}</td>
                        <td>
                          {permissions && permissions.has("delete_criterion") ? (<button onClick={()=>{handledelete(element.id)}} className='btn btn-sm btn-danger me-3'>Sil</button>) : (<button disabled className='btn btn-sm btn-danger me-3'>Sil</button>)}
                          {permissions && permissions.has("edit_criterion") ? (<Link to={`/superadmin/criterions/edit/${element.id}`} className='btn btn-sm btn-primary'>Dəyişdir</Link>) : (<button className='btn btn-sm btn-primary' disabled>Dəyişdir</button>)}

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

export default Criterions