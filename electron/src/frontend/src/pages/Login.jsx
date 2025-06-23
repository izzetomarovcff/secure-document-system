import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [msg, setMsg] = useState(null);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_IP}/login`, { username: formData.email, password: formData.password });
      console.log(res)
      if (res.data.message === "Login successful") {
        localStorage.setItem('token', res.data.token);
        const decoded = jwtDecode(res.data.token);
        const exp = decoded.exp * 1000; // convert to ms
        const timeout = exp - Date.now();
        const { role } = JSON.parse(atob(res.data.token.split('.')[1]));
        if(role == "superadmin"){
          window.location.pathname = "superadmin"
        }else if(role == "admin"){
          window.location.pathname = "admin"
        }else if(role == "subadmin"){
          window.location.pathname = "subadmin"
        }else if(role == "user"){
          window.location.pathname ="user"
        }
        if (timeout > 0) {
          setTimeout(() => {
            localStorage.removeItem('token');
            window.location.pathname = "/login"
            setMsg("Sessiya müddəti başa çatdı!");
          }, timeout);
        }

      } else {
        localStorage.setItem('token', null);
      }

    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setMsg(err.response.data.error);
        setTimeout(() => {
          setMsg(null)
        }, 3000);
      } else {
        setMsg('❌ Bilinməyən xəta baş verdi!');
        setTimeout(() => {
          setMsg(null)
        }, 3000);
      }
    }
  }
  return (
    <div className='login '>
      {msg ? (<div className="notfication alert alert-danger">{msg}</div>) : (null)}

      <form onSubmit={handleSubmit} className='form form-control shadow py-4 px-3 w-50'>
        <h5 className='mt-2 mx-auto '>Daxil Ol</h5>
        <div className='mb-3'>
          <label htmlFor="email" className='form-label'>E-Mail</label>
          <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} className='form-control shadow-sm' required />
        </div>
        <div className='mb-3'>
          <label htmlFor="password" className='form-label'>Şifrə</label>
          <input type='password' id='password' name='password' value={formData.password} onChange={handleChange} className='form-control shadow-sm' required />
        </div>
        <div class="mb-3 form-check">
          <input type="checkbox" className="form-check-input shadow-sm" id="checkbox" />
          <label className="form-check-label" htmlFor="checkbox">Məni Xatırla</label>
        </div>
        <button type='submit' className='mt-3 btn btn-primary'>Daxil Ol</button>
      </form>
    </div>
  )
}

export default Login