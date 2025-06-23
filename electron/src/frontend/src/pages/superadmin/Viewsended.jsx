import React, { useEffect, useState } from 'react'
import Navbartop from '../../components/Navbartop'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'

function Viewsended() {
    const [formData, setFormData] = useState(null)
    
    useEffect(() => {
            const getSendedById = async () => {
                try {
                    const idarr = window.location.pathname.split("/")
                    const response = await fetch(`${process.env.REACT_APP_API_IP}/getsendedbyid`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: Number(idarr[4]) })  // send username in body
                    });
                    const data = await response.json()
                    setFormData(data[0])
                } catch (error) {
                    console.log(error)
                }
            }
            getSendedById()
    
    
        }, [])
    return (
        <div className='editadministration'>
            <Navbartop />
            <div className='group'>
                <Navbar />
                <div className="containerr">
                    <div className="head-group">
                        <div className="head-text">Göndərilən - Bax</div>
                        <Link to={"/superadmin/sendeds"} className="lnk-btn btn btn-danger">Geri</Link>
                    </div>
                    {formData ? (
                        <div className='container-2'>
                            <form className='form-control form mb-3'>
                                <div className="inputgroup">
                                    <div className='mb-3 w-50 p-2'>
                                        <label htmlFor="date" className='form-label'>Tarix</label>
                                        <input value={formData.date} type="text" name='date' id='date' className='form-control' disabled required />
                                    </div>
                                    <div className='mb-3 w-50 p-2'>
                                        <label htmlFor="time" className='form-label'>Saat</label>
                                        <input value={formData.time} type="text" name='time' id='time' className='form-control' disabled required />
                                    </div>
                                </div>
                                <div className="inputgroup">
                                    <div className='mb-3 w-50 p-2'>
                                        <label htmlFor="title" className='form-label'>Başlıq</label>
                                        <input value={formData.title} type="text"  name='title' id='title' className='form-control' placeholder='Günün Hesabatı' disabled required />
                                    </div>
                                    <div className='mb-3 w-50 p-2'>
                                        <label htmlFor="to_id" className='form-label'>Qəbul Edən</label>
                                        
                                            <input type="to_id" value={formData.username} name='to_id' id='to_id' className='form-control' disabled required />
                                            
                                    </div>
                                </div>
                                <div className="inputgroup">
                                    <div className='mb-3 w-100 p-2'>
                                        <label htmlFor="description" className='form-label'>Təsvir</label>
                                        <textarea value={formData.description} disabled  maxLength={"255"} rows={"3"} name='description' id='description' className='form-control textarea' placeholder='Bu Hesabat 12.05.2025 Tarixinin Hesabatını Əks Etdiri' required />
                                    </div>


                                </div>
                                <div className="inputgroup">
                                    <div className='mb-3 w-50 p-2'>
                                        <label htmlFor="encryption" className='form-label'>Şifrələmə Metodu</label>
                                        <select value={formData.cryption} disabled  name='cryption' id='encryption' className='form-control'>
                                            <option value="1">AES</option>
                                            <option value="2">DES</option>
                                            <option value="3">RSA</option>
                                            <option value="4">ECC</option>
                                        </select>
                                    </div>
                                    <div className='mb-3 w-50 p-2'>
                                        <label htmlFor="decryption" className='form-label'>Deşifrələmə Metodu</label>
                                        <select value={formData.cryption} disabled  name='cryption' id='decryption' className='form-control'>
                                            <option value="1">AES</option>
                                            <option value="2">DES</option>
                                            <option value="3">RSA</option>
                                            <option value="4">ECC</option>

                                        </select>
                                    </div>
                                </div>
                                <div className="inputgroup">
                                    <div className='mb-3 w-50 p-2'>
                                        <label htmlFor="orginal_file_name" className='form-label' >Sənəd</label>
                                        <input value={formData.orginal_file_name} disabled type="text" name='orginal_file_name' id='orginal_file_name' className='form-control' required />
                                    </div>
                                    <div className='mb-3 w-50 p-2'>
                                        <label htmlFor="secured_file_name" className='form-label' >Şifrələnmiş Sənəd</label>
                                        <input value={formData.secured_file_name} disabled type="text" name='secured_file_name' id='secured_file_name' className='form-control' required />
                                    </div>
                                </div>



                                

                            </form>

                        </div>
                    ) : (null)}

                </div>
            </div>
        </div>
    )
}

export default Viewsended