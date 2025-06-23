import React, { useEffect, useState } from 'react'
import Navbartop from '../../components/Navbartop'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'

function Createresult() {
    const token = localStorage.getItem('token');
    const { id } = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
    const [formData, setFormData] = useState({
        results_owner_id: id,
        results_date: ""
    })
    const [results, setResults] = useState([])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }))
    }
    const getCurrentData = () => {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const day = String(now.getDate()).padStart(2, '0');

        const formattedDate = `${year}-${month}-${day}`;
        setFormData(prevState => ({
            ...prevState,
            results_date: formattedDate
        }))
    }
    const handleChangeResult = (e, key) => {
        const { name, value } = e.target;

        setResults(prevState => {
            const updatedAges = [...prevState];
            updatedAges[key] = {
                ...updatedAges[key],
                [name]: value
            };
            return updatedAges;
        });
        if (name == "search") {
            const getUsers = async () => {
                try {
                    const response = await fetch(`${process.env.REACT_APP_API_IP}/getusersbysearch`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ search: value })
                    });
                    const data = await response.json()
                    setResults(prevState => {
                        const updatedAges = [...prevState];
                        updatedAges[key] = {
                            ...updatedAges[key],
                            results: data
                        };
                        return updatedAges;
                    });
                } catch (error) {
                    console.log(error)
                }
            }
            getUsers()
        }

    };
    const deleteResult = (index) => {
        setResults(prevState => prevState.filter((_, i) => i !== index));
    };
    const createresult = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_IP}/getcriterions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const sourcedata = await response.json()
                const now = new Date();

                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                const day = String(now.getDate()).padStart(2, '0');

                const formattedDate = `${year}-${month}-${day}`;
                
            setResults(prevState => ([
                ...prevState,
                { search: "", results: [], user_id: 0, result: 0, result_owner_id: id, criterions: [...sourcedata], criterion_id: 0,result_date: formattedDate, deleted_criterion: 0 }

            ]))
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getCurrentData()
    }, [])
    const handleSubmit = async (e) => {
        try {
            e.preventDefault()
            await fetch(`${process.env.REACT_APP_API_IP}/addresults`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData,  results_option: results })
            });
            setFormData(prevState => ({
                ...prevState,
                results_owner_id: id,
            }))
            setResults([])


        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='createuser'>
            <Navbartop />
            <div className='group'>
                <Navbar />
                <div className="containerr">
                    <div className="head-group">
                        <div className="head-text">Nəticələr - Yarat</div>
                        <Link to={"/superadmin/results"} className="lnk-btn btn btn-danger">Ləğv Et</Link>
                    </div>
                    <div className='container-2'>
                        <form onSubmit={handleSubmit} className='form-control form'>
                            <div className="inputgroup">
                                <div className='mb-3 w-50 p-2'>
                                    <label htmlFor="results_date" className='form-label'>Tarix</label>
                                    <input value={formData.results_date} onChange={handleChange} type="date" name='results_date' id='results_date' className='form-control' />
                                </div>
                            </div>
                            {
                                results && results.length > 0 ? (
                                    results.map((element, key) => {
                                        if (!element.deleted_criterion) {
                                            return (
                                                <div className="form form-control w-100" key={key}>
                                                    {/* <div className="head text-light text-center w-100 fs-4 mt-1">{element.min_age} - {element.max_age} Yaş İntervalı Qiymətləndirməsi</div> */}
                                                    <div className="inputgroup">
                                                        <div className='mb-3 w-50 p-2'>
                                                            <label htmlFor="search" className='form-label'>Axtarış</label>
                                                            <input onChange={(e) => { handleChangeResult(e, key) }} value={element.search} type="text" name='search' id='search' className='form-control' required />
                                                        </div>
                                                        <div className='mb-3 w-50 p-2'>
                                                            <label htmlFor="user_id" className='form-label'>İstifadəçi</label>
                                                            <select value={element.user_id} onChange={(e) => { handleChangeResult(e, key) }} name='user_id' id='user_id' className='form-control' required >
                                                                <option value="0">Seçim Et</option>
                                                                {element.results && element.results.length > 0 ? (
                                                                    element.results.map((element2, key2) => {
                                                                        if (!element2.deleted_user) {
                                                                            return (
                                                                                <option key={key2} value={element2.id}>{element2.username} | {element2.name} | {element2.surname} | {element2.fathername} | {element2.birth_day}</option>
                                                                            )
                                                                        }

                                                                    })
                                                                ) : (null)}

                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="inputgroup">
                                                        <div className='mb-3 w-50 p-2'>
                                                            <label htmlFor="criterion_id" className='form-label'>Kriteriya</label>
                                                            <select value={element.criterion_id} onChange={(e) => { handleChangeResult(e, key) }} name='criterion_id' id='criterion_id' className='form-control' required >
                                                                <option value="0">Seçim Et</option>
                                                                {element.criterions && element.criterions.length > 0 ? (
                                                                    element.criterions.map((element2, key2) => {
                                                                        if (!element2.deleted_criterion) {
                                                                            return (
                                                                                <option key={key2} value={element2.id}>{element2.criterion_name} | {element2.unit_name}</option>
                                                                            )
                                                                        }

                                                                    })
                                                                ) : (null)}

                                                            </select>
                                                        </div>
                                                        <div className='mb-3 w-50 p-2'>
                                                            <label htmlFor="result" className='form-label'>Nəticə</label>
                                                            <input onChange={(e) => { handleChangeResult(e, key) }} value={element.result} type="number" name='result' id='result' className='form-control' required />
                                                        </div>
                                                    </div>
                                                    <div className="inputgroup">
                                                        <div className='mb-3 w-25 p-2'>
                                                            <div className=''></div>
                                                        </div>
                                                        <div className='mb-3 w-25 p-2'>
                                                            <div className=''></div>
                                                        </div>
                                                        <div className='mb-3 w-25 p-2'>
                                                            <div className=''></div>
                                                        </div>
                                                        <div className='mb-3 w-25 p-2'>
                                                            <div onClick={() => deleteResult(key)} className='btn w-100 btn-danger mx-auto'>Sil</div>
                                                        </div>
                                                    </div>


                                                </div>
                                            )
                                        }

                                    })
                                ) : (null)
                            }
                            <div className="inputgroup w-100">
                                <div className='mb-3 mx-auto w-50 mt-3'>
                                    <button type='button' onClick={createresult} className='btn w-100 mx-auto'>Nəticə Əlavə Et</button>
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

export default Createresult