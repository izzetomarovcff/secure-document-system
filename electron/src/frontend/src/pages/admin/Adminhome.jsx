import React from 'react'
import Navbaradmin from '../../components/Navbaradmin'
import Navbartopadmin from '../../components/Navbartopadmin'

function Adminhome() {
  return (
    <div className='superadminhome'>
      <Navbartopadmin/>
      <div className='group'>
          <Navbaradmin/>
      </div>
    </div>
  )
}

export default Adminhome