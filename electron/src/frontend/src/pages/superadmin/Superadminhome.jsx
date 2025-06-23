import React from 'react'

import Navbartop from '../../components/Navbartop'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router-dom'

function Superadminhome() {
  
  return (
    <div className='superadminhome'>
      <Navbartop/>
      <div className='group'>
          <Navbar/>
          <div className="containerr-home">
            Kriptoqrafiyadan istifadə edərək təhlükəsiz sənəd mübadilə sistemi
              
          </div>
      </div>
    </div>
  )
}

export default Superadminhome