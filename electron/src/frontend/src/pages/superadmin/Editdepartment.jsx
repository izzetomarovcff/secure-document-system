import React, { useEffect, useState } from 'react'
import Navbartop from '../../components/Navbartop'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'

function Editdepartment() {
    const [formData, setFormData] = useState(null)
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
            await fetch(`${process.env.REACT_APP_API_IP}/updateadepartment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            window.location.pathname = "/superadmin/departments"

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        const getDepartmentById = async () => {
            try {
                const idarr = window.location.pathname.split("/")
                const response = await fetch(`${process.env.REACT_APP_API_IP}/getdepartmentbyid`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ department_id: Number(idarr[4]) })  // send username in body
                });
                const data = await response.json()
                setFormData(data[0])
            } catch (error) {
                console.log(error)
            }
        }
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
        getDepartmentById()
        getAdministrations()


    }, [])
    return (
        <div className='editdepartment'>
            <Navbartop />
            <div className='group'>
                <Navbar />
                <div className="containerr">
                    <div className="head-group">
                        <div className="head-text">Şövbələr - Dəyişdir</div>
                        <Link to={"/superadmin/departments"} className="lnk-btn btn btn-danger">Ləğv Et</Link>
                    </div>
                    {formData ? (<div className='container-2'>
                        <form onSubmit={handleSubmit} className='form-control form'>
                            <div className="inputgroup">
                                <div className='mb-3 w-50 p-2'>
                                    <label htmlFor="department_name" className='form-label'>Şövbə adı *</label>
                                    <input value={formData.department_name} onChange={handleChange} type="text" name='department_name' id='department_name' className='form-control' required />
                                </div>
                                <div className='mb-3 w-50 p-2'>
                                    <label htmlFor="administration_id" className='form-label'>İdarə Seç *</label>
                                    <select value={formData.administration_id} onChange={handleChange} name='administration_id' id='administration_id' className='form-control' required >
                                        <option value={"0"} >Seçim Et</option>
                                        {administrations ? (administrations.map((element, key) => {
                                            if (!element.deleted_administration) {
                                                return (
                                                    <option value={element.id} key={key}>{element.administration_name}</option>
                                                )
                                            }

                                        })) : (null)}
                                    </select>
                                </div>
                            </div>
                            <div className="inputgroup">
                                <button type='submit' className='btn m-2'>Yadda Saxla</button>
                            </div>

                        </form>
                    </div>) : (null)}


                </div>
            </div>
        </div>
    )
}

export default Editdepartment