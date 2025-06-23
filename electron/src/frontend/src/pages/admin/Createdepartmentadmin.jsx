import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbartopadmin from '../../components/Navbartopadmin'
import Navbaradmin from '../../components/Navbaradmin'

function Createdepartmentadmin() {
    const token = localStorage.getItem('token');
    const { role_id,administration_id } = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
    const [formData, setFormData] = useState({
        department_name: "",
        administration_id: Number(administration_id)
    })
    const [administrations, setAdministrations] = useState(null)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }
    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            await fetch(`${process.env.REACT_APP_API_IP}/adddepartment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, administration_id: Number(formData.administration_id) })
            });
            setFormData(prevState => ({
                ...prevState,
                department_name: "",
            }))


        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        const getAdministrations = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_IP}/getadministrations`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                const sourcedata = await response.json()
                setAdministrations(sourcedata)
            } catch (error) {
                console.log(error)
            }
        }
        getAdministrations()
    }, [])
    return (
        <div className='createdepartment'>
            <Navbartopadmin />
            <div className='group'>
                <Navbaradmin />
                <div className="containerr">
                    <div className="head-group">
                        <div className="head-text">Şövbələr - Yarat</div>
                        <Link to={"/admin/departments"} className="lnk-btn btn btn-danger">Ləğv Et</Link>
                    </div>
                    <div className='container-2'>
                        <form onSubmit={handleSubmit} className='form-control form'>
                            <div className="inputgroup">
                                <div className='mb-3 w-50 p-2'>
                                    <label htmlFor="department_name" className='form-label'>Şövbə adı *</label>
                                    <input value={formData.department_name} onChange={handleChange} type="text" name='department_name' id='department_name' className='form-control' required />
                                </div>
                                
                            </div>
                            <div className="inputgroup">
                                <button type='submit' className='btn m-2'>Əlavə Et</button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Createdepartmentadmin