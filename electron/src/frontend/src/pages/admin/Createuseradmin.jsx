import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbartopadmin from '../../components/Navbartopadmin'
import Navbaradmin from '../../components/Navbaradmin'

function Createuseradmin() {
    const [administrations, setAdministrations] = useState(null)
    const [departments, setDepartments] = useState(null)
    const [roles, setRoles] = useState(null)
    const token = localStorage.getItem('token');
    const { role_id, administration_id } = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role_id: "0",
        name: "",
        surname: "",
        fathername: "",
        phone_number: "",
        administration_id: Number(administration_id),
        department_id: "0",
        birth_day: null
    })
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }



    useEffect(() => {

        const getdepartments = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_IP}/getdepartmentsbyadminstrationid`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ administration_id: Number(administration_id) })  // send username in body
                });
                const data = await response.json()
                setDepartments(data)
            } catch (error) {
                console.log(error)
            }
        }
        const getRoles = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_IP}/getroles`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                })
                const data = await response.json()
                setRoles(data)
            } catch (error) {
                console.log(error)
            }
        }
        getRoles()
        getdepartments()

    }, [])
    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            await fetch(`${process.env.REACT_APP_API_IP}/adduser`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, role_id: Number(formData.role_id), administration_id: Number(formData.administration_id), department_id: Number(formData.department_id) })
            });
            setFormData(prevState => ({
                ...prevState,
                username: "",
                password: "",
                role_id: "0",
                name: "",
                surname: "",
                fathername: "",
                phone_number: "",
                department_id: "0",
                birth_day: null
            }))


        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='createuser'>
            <Navbartopadmin />
            <div className='group'>
                <Navbaradmin />
                <div className="containerr">
                    <div className="head-group">
                        <div className="head-text">İstifadəçilər - Yarat</div>
                        <Link to={"/admin/users"} className="lnk-btn btn btn-danger">Ləğv Et</Link>
                    </div>
                    <div className='container-2'>
                        <form onSubmit={handleSubmit} className='form-control form mb-3'>
                            <div className="inputgroup">
                                <div className='mb-3 w-50 p-2'>
                                    <label htmlFor="name" className='form-label'>Ad *</label>
                                    <input value={formData.name} onChange={handleChange} type="text" name='name' id='name' className='form-control' required placeholder='Nümunə: Ruslan' />
                                </div>
                                <div className='mb-3 w-50 p-2'>
                                    <label htmlFor="surname" className='form-label'>Soyad *</label>
                                    <input value={formData.surname} onChange={handleChange} type="text" name='surname' id='surname' className='form-control' required placeholder='Nümunə: İmanov' />
                                </div>
                            </div>
                            <div className="inputgroup">
                                <div className='mb-3 w-50 p-2'>
                                    <label htmlFor="fathername" className='form-label'>Ata Adı *</label>
                                    <input value={formData.fathername} onChange={handleChange} type="text" name='fathername' id='fathername' className='form-control' required placeholder='Nümunə: Rasim' />
                                </div>
                                <div className='mb-3 w-50 p-2'>
                                    <label htmlFor="phone_number" className='form-label'>Telefon Nömrəsi *</label>
                                    <input value={formData.phone_number} onChange={handleChange} type="text" name='phone_number' id='phone_number' className='form-control' required placeholder='Nümunə: 994701234567' />
                                </div>
                            </div>
                            <div className="inputgroup">
                                <div className='mb-3 w-50 p-2'>
                                    <label htmlFor="username" className='form-label'>E-mail *</label>
                                    <input value={formData.username} onChange={handleChange} type="email" name='username' id='username' className='form-control' required placeholder='Nümunə: rasimimanov@gmail.com' />
                                </div>
                                <div className='mb-3 w-50 p-2'>
                                    <label htmlFor="password" className='form-label'>Şifrə *</label>
                                    <input value={formData.password} onChange={handleChange} type="password" name='password' id='password' className='form-control' required />
                                </div>
                            </div>
                            <div className="inputgroup">

                                <div className='mb-3 w-50 p-2'>
                                    <label htmlFor="department_id" className='form-label'>Şövbə *</label>
                                    <select value={formData.department_id} onChange={handleChange} name='department_id' id='department_id' className='form-control' required>
                                        <option value="0">Şövbə Seç</option>
                                        {departments && !departments.error ? (departments.map((element, key) => {
                                            if (!element.deleted_department) {
                                                return (
                                                    <option value={element.id} key={key}>{element.department_name}</option>
                                                )
                                            }

                                        })) : (null)}
                                    </select>
                                </div>
                                <div className='mb-3 w-50 p-2'>
                                    <label htmlFor="role_id" className='form-label'>Rol *</label>
                                    <select value={formData.role_id} onChange={handleChange} name='role_id' id='role_id' className='form-control' required>
                                        <option value="0">Rol Seç</option>
                                        {roles ? (roles.map((element, key) => {
                                            if (element.role_name == "subadmin" || element.role_name == "user") {
                                                return (
                                                    <option value={element.id} key={key}>{element.role_name}</option>
                                                )
                                            }

                                        })) : (null)}
                                    </select>
                                </div>
                            </div>
                            <div className="inputgroup">
                                <div className='mb-3 w-50 p-2'>
                                    <label htmlFor="birth_day" className='form-label'>Doğum tarixi *</label>
                                    <input value={formData.birth_day} onChange={handleChange} type="date" className='form-control' id='birth_day' name='birth_day' required />
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

export default Createuseradmin