import React, { useState } from 'react'
import Navbartop from '../../components/Navbartop'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'

function Createadministration() {
    const [formData, setFormData] = useState({
        administration_name: ""
    })
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
            await fetch(`${process.env.REACT_APP_API_IP}/addadministration`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            setFormData(prevState => ({
                ...prevState,
                administration_name: ""
            }))


        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='createadministration'>
            <Navbartop />
            <div className='group'>
                <Navbar />
                <div className="containerr">
                    <div className="head-group">
                        <div className="head-text">İdarələr - Yarat</div>
                        <Link to={"/superadmin/administrations"} className="lnk-btn btn btn-danger">Ləğv Et</Link>
                    </div>
                    <div className='container-2'>
                        <form onSubmit={handleSubmit} className='form-control form'>
                            <div className="inputgroup">
                                <div className='mb-3 w-50 p-2'>
                                    <label htmlFor="administration_name" className='form-label'>Idarə Adı *</label>
                                    <input value={formData.administration_name} onChange={handleChange} type="text" name='administration_name' id='administration_name' className='form-control' required />
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

export default Createadministration