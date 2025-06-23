import React, { useEffect, useState } from 'react'
import Navbartop from '../../components/Navbartop'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'

function Editcriterion() {
    const [ages, setAges] = useState([])

    const [formData, setFormData] = useState(null)
    const [units, setUnits] = useState(null)
    const getUnits = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_IP}/getunits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const sourcedata = await response.json()
            setUnits(sourcedata)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        const getCriterionById = async () => {
            try {
                const idarr = window.location.pathname.split("/")
                const response = await fetch(`${process.env.REACT_APP_API_IP}/getcriterionbyid`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ criterion_id: Number(idarr[4]) })  // send username in body
                });
                const data = await response.json()
                setFormData(data[0])
                const response2 = await fetch(`${process.env.REACT_APP_API_IP}/getageevaluationsbycriterionid`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ criterion_id: Number(data[0].id) })  // send username in body
                });
                const data2 = await response2.json()
                if(data2.error){
                    setAges([])
                }else{
                    setAges(data2)
                }
                
            } catch (error) {
                console.log(error)
            }
        }
        getCriterionById()
        getUnits()
        
    }, [])
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
            await fetch(`${process.env.REACT_APP_API_IP}/updatecriterions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({...formData,ages_options:ages})
            });
            window.location.pathname = "/superadmin/criterions"

        } catch (error) {
            console.log(error)
        }
    }
    const deleteAge = async(index,element) => {
        try{
            if(element.id){
                await fetch(`${process.env.REACT_APP_API_IP}/deleteageevaluation`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: Number(element.id) })
                });
            }
            
            setAges(prevState => prevState.filter((_, i) => i !== index));
        }catch(error){
            console.log(error)
        }
    };
    const createage = async () => {
        try {
            setAges(prevState => ([
                ...prevState,
                { min_age: 0, max_age: 0, so_bad_min: 0, so_bad_max: 0, bad_min: 0, bad_max: 0, good_min: 0, good_max: 0, best_min: 0, best_max: 0,deleted_age_evaluation:0 }

            ]))
        } catch (error) {
            console.log(error)
        }
    }
    
    const handleChangeAge = (e, key) => {
        const { name, value } = e.target;

        setAges(prevState => {
            const updatedAges = [...prevState];
            updatedAges[key] = {
                ...updatedAges[key],
                [name]: Number(value)
            };
            return updatedAges;
        });
    };
    return (
        <div className='createadministration'>
            <Navbartop />
            <div className='group'>
                <Navbar />
                <div className="containerr">
                    <div className="head-group">
                        <div className="head-text">Kriteriyalar - Dəyişdir</div>
                        <Link to={"/superadmin/criterions"} className="lnk-btn btn btn-danger">Ləğv Et</Link>
                    </div>
                    {formData ? (
                        <div className='container-2'>
                            <form onSubmit={handleSubmit} className='form-control form'>
                                <div className="inputgroup">
                                    <div className='mb-3 w-50 p-2'>
                                        <label htmlFor="criterion_name" className='form-label'>Kriteriya Adı *</label>
                                        <input value={formData.criterion_name} onChange={handleChange} type="text" name='criterion_name' id='criterion_name' className='form-control' required />
                                    </div>
                                    <div className='mb-3 w-50 p-2'>
                                        <label htmlFor="criterion_description" className='form-label'>Kriteriya Açıqlaması *</label>
                                        <input value={formData.criterion_description} onChange={handleChange} type="text" name='criterion_description' id='criterion_description' className='form-control' required />
                                    </div>
                                </div>
                                <div className="inputgroup">
                                    <div className='mb-3 w-50 p-2'>
                                        <label htmlFor="reversed" className='form-label'>Əksinə İşləyir</label>
                                        <select value={formData.reversed} onChange={handleChange} name='reversed' id='reversed' className='form-control' required >
                                            <option value="0">Yox</option>
                                            <option value="1">Hə</option>
                                        </select>
                                    </div>
                                    <div className='mb-3 w-50 p-2'>
                                        <label htmlFor="unit_id" className='form-label'>Vahid *</label>
                                        <select value={formData.unit_id} onChange={handleChange} name='unit_id' id='unit_id' className='form-control' required >
                                            <option value="0">Seçim Et</option>
                                            {units ? (units.map((element, key) => {
                                                if (!element.deleted_unit) {
                                                    return (
                                                        <option value={element.id} key={key}>{element.unit_name} ({element.unit_description})</option>
                                                    )
                                                }

                                            })) : (null)}
                                        </select>
                                    </div>
                                </div>
                                <div className="inputgroup">
                                    <div className='mb-3 w-50 p-2'>
                                        <label htmlFor="age_effect" className='form-label'>Qiymətləndirməyə Yaşın Təsiri Var ?</label>
                                        <select value={formData.age_effect} onChange={handleChange} name='age_effect' id='age_effect' className='form-control' required >
                                            <option value="0">Yox</option>
                                            <option value="1">Hə</option>
                                        </select>
                                    </div>
                                </div>
                                {formData.age_effect == "0" ? (
                                    <div className="inputgroup">
                                        <div className='mb-3 w-25 p-2'>
                                            <label htmlFor="so_bad_min" className='form-label'>Qeyri-kafi Min Göstərici</label>
                                            <input value={formData.so_bad_min} onChange={handleChange} type="number" name='so_bad_min' id='so_bad_min' className='form-control' required />
                                        </div>
                                        <div className='mb-3 w-25 p-2'>
                                            <label htmlFor="so_bad_max" className='form-label'>Qeyri-kafi Max Göstərici</label>
                                            <input value={formData.so_bad_max} onChange={handleChange} type="number" name='so_bad_max' id='so_bad_max' className='form-control' required />
                                        </div>
                                        <div className='mb-3 w-25 p-2'>
                                            <label htmlFor="bad_min" className='form-label'>Kafi Min Göstərici</label>
                                            <input value={formData.bad_min} onChange={handleChange} type="number" name='bad_min' id='bad_min' className='form-control' required />
                                        </div>
                                        <div className='mb-3 w-25 p-2'>
                                            <label htmlFor="bad_max" className='form-label'>Kafi Max Göstərici</label>
                                            <input value={formData.bad_max} onChange={handleChange} type="number" name='bad_max' id='bad_max' className='form-control' required />
                                        </div>
                                    </div>
                                ) : (null)}
                                {formData.age_effect == "0" ? (
                                    <div className="inputgroup">
                                        <div className='mb-3 w-25 p-2'>
                                            <label htmlFor="good_min" className='form-label'>Yaxşı Min Göstərici</label>
                                            <input value={formData.good_min} onChange={handleChange} type="number" name='good_min' id='good_min' className='form-control' required />
                                        </div>
                                        <div className='mb-3 w-25 p-2'>
                                            <label htmlFor="good_max" className='form-label'>Yaxşı Max Göstərici</label>
                                            <input value={formData.good_max} onChange={handleChange} type="number" name='good_max' id='good_max' className='form-control' required />
                                        </div>
                                        <div className='mb-3 w-25 p-2'>
                                            <label htmlFor="best_min" className='form-label'>Əla Min Göstərici</label>
                                            <input value={formData.best_min} onChange={handleChange} type="number" name='best_min' id='best_min' className='form-control' required />
                                        </div>
                                        <div className='mb-3 w-25 p-2'>
                                            <label htmlFor="best_max" className='form-label'>Əla Max Göstərici</label>
                                            <input value={formData.best_max} onChange={handleChange} type="number" name='best_max' id='best_max' className='form-control' required />
                                        </div>
                                    </div>
                                ) : (null)}
                                {formData.age_effect == "1" ? (
                                    ages && ages.length > 0 ? (
                                        ages.map((element, key) => {
                                            if(!element.deleted_age_evaluation){
                                                return (
                                                <div className="form form-control w-100" key={key}>
                                                    <div className="head text-light text-center w-100 fs-4 mt-1">{element.min_age} - {element.max_age} Yaş İntervalı Qiymətləndirməsi</div>
                                                    <div className="inputgroup">
                                                        <div className='mb-3 w-50 p-2'>
                                                            <label htmlFor="min_age" className='form-label'>Min Yaş</label>
                                                            <input onChange={(e) => { handleChangeAge(e, key) }} value={element.min_age} type="number" name='min_age' id='min_age' className='form-control' required />
                                                        </div>
                                                        <div className='mb-3 w-50 p-2'>
                                                            <label htmlFor="max_age" className='form-label'>Max Yaş</label>
                                                            <input onChange={(e) => { handleChangeAge(e, key) }} value={element.max_age} type="number" name='max_age' id='max_age' className='form-control' required />
                                                        </div>
                                                    </div>
                                                    <div className="inputgroup">
                                                        <div className='mb-3 w-25 p-2'>
                                                            <label htmlFor="so_bad_min" className='form-label'>Qeyri-kafi Min Göstərici</label>
                                                            <input onChange={(e) => { handleChangeAge(e, key) }} value={element.so_bad_min} type="number" name='so_bad_min' id='so_bad_min' className='form-control' required />
                                                        </div>
                                                        <div className='mb-3 w-25 p-2'>
                                                            <label htmlFor="so_bad_max" className='form-label'>Qeyri-kafi Max Göstərici</label>
                                                            <input onChange={(e) => { handleChangeAge(e, key) }} value={element.so_bad_max} type="number" name='so_bad_max' id='so_bad_max' className='form-control' required />
                                                        </div>
                                                        <div className='mb-3 w-25 p-2'>
                                                            <label htmlFor="bad_min" className='form-label'>Kafi Min Göstərici</label>
                                                            <input onChange={(e) => { handleChangeAge(e, key) }} value={element.bad_min} type="number" name='bad_min' id='bad_min' className='form-control' required />
                                                        </div>
                                                        <div className='mb-3 w-25 p-2'>
                                                            <label htmlFor="bad_max" className='form-label'>Kafi Max Göstərici</label>
                                                            <input onChange={(e) => { handleChangeAge(e, key) }} value={element.bad_max} type="number" name='bad_max' id='bad_max' className='form-control' required />
                                                        </div>
                                                    </div>
                                                    <div className="inputgroup">
                                                        <div className='mb-3 w-25 p-2'>
                                                            <label htmlFor="good_min" className='form-label'>Yaxşı Min Göstərici</label>
                                                            <input onChange={(e) => { handleChangeAge(e, key) }} value={element.good_min} type="number" name='good_min' id='good_min' className='form-control' required />
                                                        </div>
                                                        <div className='mb-3 w-25 p-2'>
                                                            <label htmlFor="good_max" className='form-label'>Yaxşı Max Göstərici</label>
                                                            <input onChange={(e) => { handleChangeAge(e, key) }} value={element.good_max} type="number" name='good_max' id='good_max' className='form-control' required />
                                                        </div>
                                                        <div className='mb-3 w-25 p-2'>
                                                            <label htmlFor="best_min" className='form-label'>Əla Min Göstərici</label>
                                                            <input onChange={(e) => { handleChangeAge(e, key) }} value={element.best_min} type="number" name='best_min' id='best_min' className='form-control' required />
                                                        </div>
                                                        <div className='mb-3 w-25 p-2'>
                                                            <label htmlFor="best_max" className='form-label'>Əla Max Göstərici</label>
                                                            <input onChange={(e) => { handleChangeAge(e, key) }} value={element.best_max} type="number" name='best_max' id='best_max' className='form-control' required />
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
                                                            <div onClick={() => deleteAge(key,element)} className='btn w-100 btn-danger mx-auto'>Sil</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                            }
                                            
                                        })
                                    ) : (null)

                                ) : (null)}
                                {formData.age_effect == "1" ? (
                                    <div className="inputgroup w-100">
                                        <div className='mb-3 mx-auto w-50 mt-3'>
                                            <button type='button' onClick={createage} className='btn w-100 mx-auto'>Yaş İntervalı Əlavə Et</button>
                                        </div>
                                    </div>
                                ) : (null)}
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

export default Editcriterion