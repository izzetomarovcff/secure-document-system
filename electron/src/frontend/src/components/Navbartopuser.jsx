import React from 'react'
function Navbartopuser() {
  const token = localStorage.getItem('token');
  const { name,surname,role} = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
  return (
    <div className='navbartop p-3'>
      <div className='user'>{name} {surname}</div>
      <div className='profile'>{name[0]} {surname[0]}</div>
    </div>
  )
}

export default Navbartopuser