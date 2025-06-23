import React, { useEffect, useState } from 'react'
import Navbaruser from '../../components/Navbaruser'
import Navbartopuser from '../../components/Navbartopuser'
import { Link } from 'react-router-dom'
function Senduser() {
    const token = localStorage.getItem('token');
    const { role_id,id } = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
    const [srcResults, setSrcResults] = useState(null)
    const [src, setSrc] = useState("")
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        orginal_file_name: "",
        secured_file_name: "",
        from_id: 0,
        to_id: 0,
        cryption: "1",
        date: "",
        time: "",
        private_key_file: "",
        public_key_file: "",
        hash: ""
    })
    useEffect(() => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months start from 0
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const formattedDate = `${day}-${month}-${year}`;
        const currentTime = `${hours}:${minutes}`;
        setFormData(prevState => ({
            ...prevState,
            date: formattedDate,
            time: currentTime
        }))
    }, [])
    const handlesearchChange = async (e) => {
        const { name, value } = e.target;
        if (name == "search") {

            try {
                const response = await fetch(`${process.env.REACT_APP_API_IP}/getusersbysearch`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ search: value })
                });
                const data = await response.json()
                setSrc(value)
                setSrcResults(data)
                console.log(data)
            } catch (error) {
                console.log(error)
            }

        }
    }
    const handlechange = async (e) => {
        try {
            const { name, value } = e.target;
            if (name == "title" || name == "to_id" || name == "description" || name == "cryption") {
                setFormData(prevState => ({
                    ...prevState,
                    [name]: value,
                }))
            }

            if (name == "orginal_file_name") {
                const file = e.target.files[0];
                setFormData(prevState => ({
                    ...prevState,
                    [name]: file.name,
                }))
                if (formData.cryption == 1) {
                    const arrayBuffer = await file.arrayBuffer();
                    const uint8Array = new Uint8Array(arrayBuffer);
                    const result = await window.electronAPI.encryptFileAes(uint8Array, file.name);
                    console.log(result)
                    console.log(result.file_name)
                    const sha_hash = await window.electronAPI.calculateFileHash(`./src/encrypted/${result.file_name}`);
                    console.log(sha_hash)
                    setFormData(prevState => ({
                        ...prevState,
                        secured_file_name: result.file_name, hash: sha_hash.hash,
                    }))


                } else if (formData.cryption == 2) {
                    const arrayBuffer = await file.arrayBuffer();
                    const uint8Array = new Uint8Array(arrayBuffer);
                    const result = await window.electronAPI.encryptFileDes(uint8Array, file.name);
                    const sha_hash = await window.electronAPI.calculateFileHash(`./src/encrypted/${result.file_name}`);

                    setFormData(prevState => ({
                        ...prevState,
                        secured_file_name: result.file_name, hash: sha_hash.hash
                    }));
                } else if (formData.cryption == 3) {
                    const arrayBuffer = await file.arrayBuffer();
                    const uint8Array = new Uint8Array(arrayBuffer);
                    const result = await window.electronAPI.encryptFileRsa(uint8Array, file.name);
                    const sha_hash = await window.electronAPI.calculateFileHash(`./src/encrypted/${result.file_name}`);

                    setFormData(prevState => ({
                        ...prevState,
                        secured_file_name: result.file_name,
                        private_key_file: result.privatekey,
                        public_key_file: result.publickey,
                        hash: sha_hash.hash
                    }));

                } else if (formData.cryption == 4) {
                    const arrayBuffer = await file.arrayBuffer();
                    const uint8Array = new Uint8Array(arrayBuffer);
                    const result = await window.electronAPI.encryptFileEcc(uint8Array, file.name);

                    const sha_hash = await window.electronAPI.calculateFileHash(`./src/encrypted/${result.file_name}`);


                    setFormData(prevState => ({
                        ...prevState,
                        secured_file_name: result.file_name,
                        private_key_file: result.privatekey,
                        public_key_file: result.publickey,
                        hash: sha_hash.hash
                    }));
                }


            }
        } catch (error) {
            console.log(error)
        }

    }
    const handlesubmit = async (e) => {
        try {
            e.preventDefault()
            const last_data = { ...formData,from_id:Number(id),to_id:Number(formData.to_id),cryption:Number(formData.cryption)  }
            await fetch(`${process.env.REACT_APP_API_IP}/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(last_data)
            });
            window.location.pathname="/user/sendeds"
            
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='createdepartment'>
            <Navbartopuser />
            <div className='group'>
                <Navbaruser />
                <div className="containerr">
                    <div className="head-group">
                        <div className="head-text">Göndərilənlər - Göndər</div>
                        <Link to={"/user/sendeds"} className="lnk-btn btn btn-danger">Ləğv Et</Link>
                    </div>
                    <div className='container-2'>
                        <form onSubmit={handlesubmit} className='form-control form mb-3'>
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
                                    <input value={formData.title} type="text" onChange={handlechange} name='title' id='title' className='form-control' placeholder='Günün Hesabatı' required />
                                </div>
                                <div className='mb-3 w-50 p-2'>
                                    <label htmlFor="search" className='form-label'>Qəbul Edən</label>
                                    <div class="input-group">
                                        <input value={src} type="text" onChange={handlesearchChange} name='search' id='search' className='form-control' placeholder='axtar' required />
                                        <select value={formData.to_id} onChange={handlechange} name="to_id" id="to_id" className='form-control'>
                                        <option value="0">Seçim Et</option>
                                        {srcResults&&srcResults.length>0?(
                                            srcResults.map((element,key)=>{
                                                return(
                                                    <option key={key} value={element.id}>{element.username}</option>
                                                )
                                            })
                                        ):(null)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="inputgroup">
                                <div className='mb-3 w-100 p-2'>
                                    <label htmlFor="description" className='form-label'>Təsvir</label>
                                    <textarea value={formData.description} onChange={handlechange} maxLength={"255"} rows={"3"} name='description' id='description' className='form-control textarea' placeholder='Bu Hesabat 12.05.2025 Tarixinin Hesabatını Əks Etdiri' required />
                                </div>


                            </div>
                            <div className="inputgroup">
                                <div className='mb-3 w-50 p-2'>
                                    <label htmlFor="encryption" className='form-label'>Şifrələmə Metodu</label>
                                    <select value={formData.cryption} onChange={handlechange} name='cryption' id='encryption' className='form-control'>
                                        <option value="1">AES</option>
                                        <option value="2">DES</option>
                                        <option value="3">RSA</option>
                                        <option value="4">ECC</option>
                                    </select>
                                </div>
                                <div className='mb-3 w-50 p-2'>
                                    <label htmlFor="decryption" className='form-label'>Deşifrələmə Metodu</label>
                                    <select value={formData.cryption} onChange={handlechange} name='cryption' id='decryption' className='form-control'>
                                        <option value="1">AES</option>
                                        <option value="2">DES</option>
                                        <option value="3">RSA</option>
                                        <option value="4">ECC</option>

                                    </select>
                                </div>
                            </div>
                            <div className="inputgroup">
                                <div className='mb-3 w-50 p-2'>
                                    <label htmlFor="orginal_file_name" className='form-label' >Şifrələnəcək Sənəd</label>
                                    <input onChange={handlechange} type="file" name='orginal_file_name' id='orginal_file_name' className='form-control' required />
                                </div>
                                {formData.secured_file_name?(
                                    <div className='mb-3 w-50 p-2'>
                                    <label  htmlFor="secured_file_name" className='form-label' >Şifrələnmiş Sənəd</label>
                                    <input value={formData.secured_file_name} disabled type="text" name='secured_file_name' id='secured_file_name' className='form-control' required />
                                </div>
                                ):(null)}
                                
                            </div>



                            <div className="inputgroup">
                                <button type='submit' className='btn m-2'>Göndər</button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Senduser