import React, { useEffect, useState } from 'react'
import Navbartop from '../../components/Navbartop'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom';

function Evaluations() {
  const [evaluations, setEvaluations] = useState(null)
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
  const getEvaluations = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_IP}/getevaluations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      const sourcedata = await response.json()
      setEvaluations(sourcedata)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getRolePermissions()
    getEvaluations()
  }, [])
  return (
    <div className='users'>
      <Navbartop />
      <div className='group'>
        <Navbar />
        <div className="containerr">
          <div className="head-group">
            <div className="head-text">Qiymətləndirmələr - Siyahı</div>
            {permissions && permissions.has("add_evaluation") ? (<Link to={"/superadmin/evaluations/create"} className="lnk-btn btn btn-secondary">Qiymətləndirmə Yarat</Link>) : (<button disabled className="lnk-btn btn btn-secondary">Qiymətləndirmə Yarat</button>)}
          </div>
          <div className="container-2">
            <table>
              <thead>
                <tr>
                  <th>id</th>
                  <th>Yaş Aralığı</th>
                  <th>Kriteriya Yaşı</th>
                  <th>Proses</th>
                </tr>
              </thead>
              <tbody>
                {evaluations && evaluations.length > 0 ? (evaluations.map((element, key) => {
                  if (!element.deleted_age_evaluation) {
                    return (
                      <tr key={key}>
                        <td>{element.id}</td>
                        <td>{element.min_age} - {element.max_age} Yaş</td>
                        <td>{element.criterion_name}</td>
                        <td>
                          {permissions && permissions.has("delete_evaluation") ? (<button className='btn btn-sm btn-danger me-3'>Sil</button>) : (<button disabled className='btn btn-sm btn-danger me-3'>Sil</button>)}

                          {permissions && permissions.has("edit_evaluation") ? (<Link to={`/superadmin/evaluations/edit/${element.id}`} className='btn btn-sm btn-primary'>Dəyişdir</Link>) : (<button className='btn btn-sm btn-primary' disabled>Dəyişdir</button>)}

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

export default Evaluations