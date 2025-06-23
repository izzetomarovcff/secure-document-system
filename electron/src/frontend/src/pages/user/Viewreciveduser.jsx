import React, { useEffect, useRef, useState } from 'react'
import Navbartopuser from '../../components/Navbartopuser'
import Navbaruser from '../../components/Navbaruser'
import { Link } from 'react-router-dom'
function Viewreciveduser() {
    const [formData, setFormData] = useState(null)
    const [decrypted, setDecrypted] = useState(null)
    const [hashStatus, setHashStatus] = useState(false)
    const [hashiscorrect, setHashiscorrect] = useState(false)
    const fileInputRef = useRef();
    const decryptfile = async (e) => {
        try {
            e.preventDefault()
            if (formData.cryption == 1) {
                const result = await window.electronAPI.decryptFileAes(`./src/encrypted/${formData.secured_file_name}`);
                console.log(result)
                const sha_hash = await window.electronAPI.calculateFileHash(`./src/encrypted/${formData.secured_file_name}`);
                setHashStatus(true)
                if (sha_hash.hash == formData.hash) {
                    setHashiscorrect(true)
                } else {
                    setHashiscorrect(false)

                }
                setDecrypted(result)
                const response = await fetch(`${process.env.REACT_APP_API_IP}/download/${result.path}`)
                if (!response.ok) {
                    throw new Error('File not found!');
                }
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = result.path; // Save name
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url); // Free memory
            }
            if (formData.cryption == 2) {
                const result = await window.electronAPI.decryptFileDes(`./src/encrypted/${formData.secured_file_name}`);
                const sha_hash = await window.electronAPI.calculateFileHash(`./src/encrypted/${formData.secured_file_name}`);
                setHashStatus(true)
                if (sha_hash.hash == formData.hash) {
                    setHashiscorrect(true)
                } else {
                    setHashiscorrect(false)

                }
                setDecrypted(result)
                const response = await fetch(`${process.env.REACT_APP_API_IP}/download/${result.path}`)
                if (!response.ok) {
                    throw new Error('File not found!');
                }
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = result.path; // Save name
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url); // Free memory
            }
            if (formData.cryption == 3) {
                const result = await window.electronAPI.decryptFileRsa(
                    `./src/encrypted/${formData.secured_file_name}`,
                    formData.private_key_file // private açar faylının adı
                );
                const sha_hash = await window.electronAPI.calculateFileHash(`./src/encrypted/${formData.secured_file_name}`);
                setHashStatus(true)
                if (sha_hash.hash == formData.hash) {
                    setHashiscorrect(true)
                } else {
                    setHashiscorrect(false)

                }
                setDecrypted(result);

                const response = await fetch(`${process.env.REACT_APP_API_IP}/download/${result.path}`)
                if (!response.ok) {
                    throw new Error('File not found!');
                }

                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = result.path; // Save name
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url); // Free memory

            }
            if (formData.cryption == 4) {
                const result = await window.electronAPI.decryptFileEcc(
                    `./src/encrypted/${formData.secured_file_name}`,
                    formData.private_key_file // private açar faylının adı
                );
                const sha_hash = await window.electronAPI.calculateFileHash(`./src/encrypted/${formData.secured_file_name}`);
                setHashStatus(true)
                if (sha_hash.hash == formData.hash) {
                    setHashiscorrect(true)
                } else {
                    setHashiscorrect(false)

                }
                setDecrypted(result);
                const response = await fetch(`${process.env.REACT_APP_API_IP}/download/${result.path}`)
                if (!response.ok) {
                    throw new Error('File not found!');
                }
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = result.path; // Save name
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url); // Free memory
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        const simulateFileSelect = async (filedata) => {
            try {
                const response = await fetch(`../../../../encrypted/${filedata.secured_file_name}`);
                const blob = await response.blob();

                const file = new File([blob], filedata.secured_file_name, { type: blob.type });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);

                if (fileInputRef.current) {
                    fileInputRef.current.files = dataTransfer.files;
                }


            } catch (error) {
                console.log(error)
            }

        }
        const getRecivedById = async () => {
            try {
                const idarr = window.location.pathname.split("/")
                const response = await fetch(`${process.env.REACT_APP_API_IP}/getrecivedbyid`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: Number(idarr[4]) })  // send username in body
                });
                const data = await response.json()
                setFormData(data[0])
                await simulateFileSelect(data[0])
            } catch (error) {
                console.log(error)
            }
        }
        getRecivedById()
    }, [])
    return (
        <div className='editadministration'>
            <Navbartopuser />
            <div className='group'>
                <Navbaruser />
                <div className="containerr">
                    <div className="head-group">
                        <div className="head-text">Qəbul Edilənlər - Bax</div>
                        <Link to={"/user/reciveds"} className="lnk-btn btn btn-danger">Geri</Link>
                    </div>
                    {formData ? (
                        <div className='container-2'>
                            <form onSubmit={decryptfile} className='form-control form mb-3'>
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
                                        <input value={formData.title} type="text" name='title' id='title' className='form-control' placeholder='Günün Hesabatı' disabled required />
                                    </div>
                                    <div className='mb-3 w-50 p-2'>
                                        <label htmlFor="to_id" className='form-label'>Qəbul Edən</label>

                                        <input type="to_id" value={formData.username} name='to_id' id='to_id' className='form-control' disabled required />

                                    </div>
                                </div>
                                <div className="inputgroup">
                                    <div className='mb-3 w-100 p-2'>
                                        <label htmlFor="description" className='form-label'>Təsvir</label>
                                        <textarea value={formData.description} disabled maxLength={"255"} rows={"3"} name='description' id='description' className='form-control textarea' placeholder='Bu Hesabat 12.05.2025 Tarixinin Hesabatını Əks Etdiri' required />
                                    </div>
                                </div>
                                <div className="inputgroup">
                                    <div className='mb-3 w-50 p-2'>
                                        <label htmlFor="encryption" className='form-label'>Şifrələmə Metodu</label>
                                        <select value={formData.cryption} disabled name='cryption' id='encryption' className='form-control'>
                                            <option value="1">AES</option>
                                            <option value="2">DES</option>
                                            <option value="3">RSA</option>
                                            <option value="4">ECC</option>
                                        </select>
                                    </div>
                                    <div className='mb-3 w-50 p-2'>
                                        <label htmlFor="decryption" className='form-label'>Deşifrələmə Metodu</label>
                                        <select value={formData.cryption} disabled name='cryption' id='decryption' className='form-control'>
                                            <option value="1">AES</option>
                                            <option value="2">DES</option>
                                            <option value="3">RSA</option>
                                            <option value="4">ECC</option>

                                        </select>
                                    </div>
                                </div>
                                <div className="inputgroup">
                                    <div className='mb-3 w-50 p-2'>
                                        <label htmlFor="secured_file_name" className='form-label' >Şifrələnmiş Sənəd</label>
                                        <input value={formData.secured_file_name} disabled type="text" name='secured_file_name' id='secured_file_name' className='form-control' required />
                                    </div>
                                    {decrypted ? (<div className='mb-3 w-50 p-2'>
                                        <label htmlFor="orginal_file_name" className='form-label' >Deşifrələnmiş Sənəd</label>
                                        <input value={decrypted.path} disabled type="text" name='orginal_file_name' id='orginal_file_name' className='form-control' required />
                                    </div>) : (null)}
                                </div>
                                {hashStatus ? (
                                    <div className={hashiscorrect ? ("hash  border border-success rounded bg-success text-light text-center p-2 ronud m-2") : ("hash  border border-danger rounded bg-danger text-light text-center p-2 ronud m-2")}>{hashiscorrect ? ("Hash eyniləşdirməsi Uğurlu!") : ("Hash eyniləşdirməsi Uğursuz!")}</div>
                                ) : (null)}
                                <div className="inputgroup">
                                    <button type='submit' className='btn w-50 m-2 mt-3'>Deşifrələ Və Yüklə</button>
                                </div>
                            </form>
                        </div>
                    ) : (null)}

                </div>
            </div>
        </div>
    )
}

export default Viewreciveduser