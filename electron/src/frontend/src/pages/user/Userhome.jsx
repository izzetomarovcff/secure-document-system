import React from 'react'
import Navbartopuser from '../../components/Navbartopuser'
import Navbaruser from '../../components/Navbaruser'
function Userhome() {
  return (
    <div className='superadminhome'>
      <Navbartopuser/>
      <div className='group'>
          <Navbaruser/>
      </div>
    </div>
  )
}

export default Userhome