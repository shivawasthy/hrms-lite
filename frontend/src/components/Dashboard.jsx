import React, { useState, useEffect } from 'react';
import { LogOut, Calendar, Clock, Users } from 'lucide-react';

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/leaves?user_id=${user.id}`)
      .then(r => r.json()).then(setLeaves);
    fetch(`http://localhost:8000/api/attendance?user_id=${user.id}`)
      .then(r => r.json()).then(setAttendance);
  }, []);

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#f9fafb'}}>
      <nav style={{backgroundColor:'#4F46E5',color:'white',padding:'16px 24px',display:'flex',justifyContent:'space-between'}}>
        <h1 style={{fontSize:'20px',fontWeight:'bold'}}>HRMS Lite - Employee</h1>
        <button onClick={onLogout} style={{background:'rgba(255,255,255,0.2)',border:'none',borderRadius:'6px',padding:'8px',color:'white',cursor:'pointer'}}>
          <LogOut size={18}/>
        </button>
      </nav>
      <div style={{padding:'24px'}}>
        <h2>Welcome, {user.full_name}!</h2>
        <div style={{marginTop:'20px',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'20px'}}>
          <div style={{background:'white',padding:'24px',borderRadius:'12px',textAlign:'center'}}>
            <Users size={32} color="#4F46E5"/>
            <h3 style={{fontSize:'32px',margin:'8px 0'}}>{leaves.length}</h3>
            <p style={{color:'#6b7280'}}>Leave Requests</p>
          </div>
          <div style={{background:'white',padding:'24px',borderRadius:'12px',textAlign:'center'}}>
            <Calendar size={32} color="#10B981"/>
            <h3 style={{fontSize:'32px',margin:'8px 0'}}>{leaves.filter(l=>l.status==='approved').length}</h3>
            <p style={{color:'#6b7280'}}>Approved</p>
          </div>
          <div style={{background:'white',padding:'24px',borderRadius:'12px',textAlign:'center'}}>
            <Clock size={32} color="#F59E0B"/>
            <h3 style={{fontSize:'32px',margin:'8px 0'}}>{attendance.length}</h3>
            <p style={{color:'#6b7280'}}>Days Present</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
