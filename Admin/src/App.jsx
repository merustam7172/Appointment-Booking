import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointment from './pages/Admin/AllAppointment';
import AddDoctors from './pages/Admin/AddDoctors';
import DoctorList from './pages/Admin/DoctorList';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorProfile from './pages/Doctor/DoctorProfile';

const App = () => {

  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)

  return aToken || dToken ? (
    <div >
      <ToastContainer/>
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          {/* Admin */}
            <Route path='/' element={<></>}/>
            <Route path='/admin-dashboard' element={<Dashboard/>}/>
            <Route path='/all-appointments' element={<AllAppointment/>}/>
            <Route path='/add-doctor' element={<AddDoctors/>}/>
            <Route path='/doctor-list' element={<DoctorList/>}/>

            {/* doctor  */}
            <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
            <Route path='/doctor-appointments' element={<DoctorAppointments />} />
            <Route path='/doctor-profile' element={<DoctorProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      <Login/>
      <ToastContainer/>
    </>
  )
}

export default App
