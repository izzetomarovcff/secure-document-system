import React, { useEffect, useState } from 'react'
import Navbartop from '../../components/Navbartop'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'

function Createdepartment() {
    const [formData, setFormData] = useState({
        department_name: "",
        administration_id: "0"
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
                administration_id: "0"
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
            <Navbartop />
            <div className='group'>
                <Navbar />
                <div className="containerr">
                    <div className="head-group">
                        <div className="head-text">Şövbələr - Yarat</div>
                        <Link to={"/superadmin/departments"} className="lnk-btn btn btn-danger">Ləğv Et</Link>
                    </div>
                    <div className='container-2'>
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
                                <button type='submit' className='btn m-2'>Əlavə Et</button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Createdepartment