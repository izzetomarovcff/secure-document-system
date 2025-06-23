import React from 'react'
import Navbartopsubadmin from '../../components/Navbartopsubadmin'
import Navbarsubadmin from '../../components/Navbarsubadmin'

function Subadminhome() {
  return (
    <div className='superadminhome'>
      <Navbartopsubadmin/>
      <div className='group'>
          <Navbarsubadmin/>
      </div>
    </div>
  )
}

export default Subadminhome