import { jwtDecode } from 'jwt-decode';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import { useEffect, useState } from 'react';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import Superadminhome from './pages/superadmin/Superadminhome';
import Unauthorized from './pages/Unauthorized';
import Notfound from './pages/Notfound';
import Users from './pages/superadmin/Users';
import Createuser from './pages/superadmin/Createuser';
import Administrations from './pages/superadmin/Administrations';
import Departments from './pages/superadmin/Departments';
import Createadministration from './pages/superadmin/Createadministration';
import Createdepartment from './pages/superadmin/Createdepartment';
import Editadministration from './pages/superadmin/Editadministration';
import Editdepartment from './pages/superadmin/Editdepartment';
import Edituser from './pages/superadmin/Edituser';
import Adminhome from './pages/admin/Adminhome';
import Subadminhome from './pages/subadmin/Subadminhome';
import Userhome from './pages/user/Userhome';
import Permissions from './pages/superadmin/Permissions';
import Roles from './pages/superadmin/Roles';
import Editrole from './pages/superadmin/Editrole';
import Departmentsadmin from './pages/admin/Departmentsadmin';
import Createdepartmentadmin from './pages/admin/Createdepartmentadmin';
import Editdepartmentadmin from './pages/admin/Editdepartmentadmin';
import Usersadmin from './pages/admin/Usersadmin';
import Createuseradmin from './pages/admin/Createuseradmin';
import Edituseradmin from './pages/admin/Edituseradmin';
import Userssubadmin from './pages/subadmin/Userssubadmin';
import Createusersubadmin from './pages/subadmin/Createusersubadmin';
import Editusersubadmin from './pages/subadmin/Editusersubadmin';
import Sendeds from './pages/superadmin/Sendeds';
import Send from './pages/superadmin/Send';
import Viewsended from './pages/superadmin/Viewsended';
import Reciveds from './pages/superadmin/Reciveds';
import Viewrecived from './pages/superadmin/Viewrecived';
import Sendedsadmin from './pages/admin/Sendedsadmin';
import Sendadmin from './pages/admin/Sendadmin';
import Viewsendedadmin from './pages/admin/Viewsendedadmin';
import Recivedsadmin from './pages/admin/Recivedsadmin';
import Viewrecivedadmin from './pages/admin/Viewrecivedadmin';

function App() {
  const [permissions, setPermissions] = useState(null)
  
  const autologin = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const exp = decoded.exp * 1000;
      if (Date.now() >= exp) {
        localStorage.removeItem('token');
        window.location.pathname= "/login"
      } else {
        setTimeout(() => {
          localStorage.removeItem('token');
          window.location.pathname= "/login"
        }, exp - Date.now());
      }
    }
  }
  const getRolePermissions = async () => {
    try {
      const token = localStorage.getItem('token');
      if(token){
        const { role_id } = JSON.parse(decodeURIComponent(escape(atob(token.split('.')[1]))));
        const response = await fetch(`${process.env.REACT_APP_API_IP}/getrolepermissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role_id: Number(role_id) })  // send username in body
      });
      const data = await response.json()
      const have_permissions = new Set(data.map(p => p.name));
      setPermissions(have_permissions)
      }
      
      
    } catch (error) {
      console.log(error)

    }
  }
  useEffect(() => {
    autologin()
    getRolePermissions()
  }, []);
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={['user']} />}>
        <Route path="/user" element={<Userhome />} />
      </Route>

      <Route element={<PrivateRoute allowedRoles={['subadmin']} />}>
        <Route path="/subadmin" element={<Subadminhome />} />
        {permissions && permissions.has("view_users")?(<Route path="/subadmin/users" element={<Userssubadmin />} />):(null)}
        {permissions && permissions.has("add_user")?(<Route path="/subadmin/users/create" element={<Createusersubadmin />} />):(null)}
        {permissions && permissions.has("edit_user")?(<Route path="/subadmin/users/edit/*" element={<Editusersubadmin />} />):(null)}
      </Route>


      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        <Route path="/admin" element={<Adminhome />} />
        {permissions && permissions.has("view_departments")?(<Route path="/admin/departments" element={<Departmentsadmin />} />):(null)}
        {permissions && permissions.has("view_users")?(<Route path="/admin/users" element={<Usersadmin />} />):(null)}
        {permissions&&permissions.has("view_sendeds")?(<Route path='/admin/sendeds' element={<Sendedsadmin/>} />):(null)}
        {permissions&&permissions.has("view_sendeds")?(<Route path='/admin/sendeds/view/*' element={<Viewsendedadmin/>} />):(null)}
        {permissions && permissions.has("add_department")?(<Route path="/admin/departments/create" element={<Createdepartmentadmin />} />):(null)}
        {permissions && permissions.has("add_user")?(<Route path="/admin/users/create" element={<Createuseradmin />} />):(null)}
        {permissions&&permissions.has("can_send_document")?(<Route path="/admin/sendeds/send" element={<Sendadmin />} />):(null)}
        {permissions&&permissions.has("view_reciveds")?(<Route path="/admin/reciveds" element={<Recivedsadmin />} />):(null)}
        {permissions && permissions.has("edit_department")?(<Route path="/admin/departments/edit/*" element={<Editdepartmentadmin />} />):(null)}
        {permissions && permissions.has("edit_user")?(<Route path="/admin/users/edit/*" element={<Edituseradmin />} />):(null)}
        {permissions&&permissions.has("view_reciveds")?(<Route path='/admin/reciveds/view/*' element={<Viewrecivedadmin/>} />):(null)}

      </Route>

      <Route element={<PrivateRoute allowedRoles={['superadmin']} />}>
        <Route path="/superadmin" element={<Superadminhome />} />
        {permissions&&permissions.has("view_users")?(<Route path="/superadmin/users" element={<Users />} />):(null)}
        {permissions&&permissions.has("view_administrations")?(<Route path="/superadmin/administrations" element={<Administrations />} />):(null)}
        {permissions&&permissions.has("view_departments")?(<Route path="/superadmin/departments" element={<Departments />} />):(null)}
        {permissions&&permissions.has("view_permissions")?(<Route path="/superadmin/permissions" element={<Permissions />} />):(null)}
        {permissions&&permissions.has("view_roles")?(<Route path="/superadmin/roles" element={<Roles />} />):(null)}
        {permissions&&permissions.has("view_sendeds")?(<Route path='/superadmin/sendeds' element={<Sendeds/>} />):(null)}
        {permissions&&permissions.has("view_sendeds")?(<Route path='/superadmin/sendeds/view/*' element={<Viewsended/>} />):(null)}
        {permissions&&permissions.has("view_reciveds")?(<Route path='/superadmin/reciveds/view/*' element={<Viewrecived/>} />):(null)}
        
        {permissions&&permissions.has("add_user")?(<Route path="/superadmin/users/create" element={<Createuser />} />):(null)}
        {permissions&&permissions.has("add_administration")?(<Route path="/superadmin/administrations/create" element={<Createadministration />} />):(null)}
        {permissions&&permissions.has("add_department")?(<Route path="/superadmin/departments/create" element={<Createdepartment />} />):(null)}
        {permissions&&permissions.has("can_send_document")?(<Route path="/superadmin/sendeds/send" element={<Send />} />):(null)}
        {permissions&&permissions.has("view_reciveds")?(<Route path="/superadmin/reciveds" element={<Reciveds />} />):(null)}
        
        {permissions&&permissions.has("edit_administration")?(<Route path="/superadmin/administrations/edit/*" element={<Editadministration />} />):(null)}
        {permissions&&permissions.has("edit_department")?(<Route path="/superadmin/departments/edit/*" element={<Editdepartment />} />):(null)}
        {permissions&&permissions.has("edit_user")?(<Route path="/superadmin/users/edit/*" element={<Edituser />} />):(null)}
        {permissions&&permissions.has("edit_role")?(<Route path="/superadmin/roles/edit/*" element={<Editrole />} />):(null)}
        
      </Route>

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Notfound />} />



    </Routes>
  );
}

export default App;
