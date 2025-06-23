import React, { useEffect, useState } from 'react'
import Navbartop from '../../components/Navbartop';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

function Editadministration() {
    const [formData, setFormData] = useState(null)
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
            await fetch(`${process.env.REACT_APP_API_IP}/updateadministration`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            window.location.pathname = "/superadmin/administrations"

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        const getAdministrationById = async () => {
            try {
                const idarr = window.location.pathname.split("/")
                const response = await fetch(`${process.env.REACT_APP_API_IP}/getadministrationbyid`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ administration_id: Number(idarr[4]) })  // send username in body
                });
                const data = await response.json()
                setFormData(data[0])
            } catch (error) {
                console.log(error)
            }
        }
        getAdministrationById()


    }, [])
    return (
        <div className='editadministration'>
            <Navbartop />
            <div className='group'>
                <Navbar />
                <div className="containerr">
                    <div className="head-group">
                        <div className="head-text">İdarələr - Dəyişdir</div>
                        <Link to={"/superadmin/administrations"} className="lnk-btn btn btn-danger">Ləğv Et</Link>
                    </div>

                    {formData ? (
                        <div className='container-2'>

                            <form onSubmit={handleSubmit} className='form-control form'>

                                <div className="inputgroup">
                                    <div className='mb-3 w-50 p-2'>
                                        <label htmlFor="administration_name" className='form-label'>Idarə Adı *</label>
                                        <input value={formData.administration_name} onChange={handleChange} type="text" name='administration_name' id='administration_name' className='form-control' required />
                                    </div>
                                </div>
                                <div className="inputgroup">
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

export default Editadministration