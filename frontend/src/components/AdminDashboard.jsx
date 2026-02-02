import React, { useState, useEffect } from 'react';
import { LogOut, Users, Calendar } from 'lucide-react';

const AdminDashboard = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/users').then(r => r.json()).then(setUsers);
    fetch('http://localhost:8000/api/leaves').then(r => r.json()).then(setLeaves);
  }, []);

  const updateLeave = async (id, status) => {
    await fetch(`http://localhost:8000/api/leaves/${id}?status=${status}`, {method:'PUT'});
    fetch('http://localhost:8000/api/leaves').then(r => r.json()).then(setLeaves);
  };

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#f9fafb'}}>
      <nav style={{backgroundColor:'#4F46E5',color:'white',padding:'16px 24px',display:'flex',justifyContent:'space-between'}}>
        <h1 style={{fontSize:'20px',fontWeight:'bold'}}>HRMS Lite - Admin</h1>
        <button onClick={onLogout} style={{background:'rgba(255,255,255,0.2)',border:'none',borderRadius:'6px',padding:'8px',color:'white',cursor:'pointer'}}>
          <LogOut size={18}/>
        </button>
      </nav>
      <div style={{padding:'24px'}}>
        <h2>Dashboard</h2>
        <div style={{marginTop:'20px',display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'20px'}}>
          <div style={{background:'white',padding:'24px',borderRadius:'12px',textAlign:'center'}}>
            <Users size={32} color="#4F46E5"/>
            <h3 style={{fontSize:'32px',margin:'8px 0'}}>{users.length}</h3>
            <p>Employees</p>
          </div>
          <div style={{background:'white',padding:'24px',borderRadius:'12px',textAlign:'center'}}>
            <Calendar size={32} color="#F59E0B"/>
            <h3 style={{fontSize:'32px',margin:'8px 0'}}>{leaves.filter(l=>l.status==='pending').length}</h3>
            <p>Pending Leaves</p>
          </div>
        </div>
        <div style={{marginTop:'32px',background:'white',padding:'24px',borderRadius:'12px'}}>
          <h3>Leave Requests</h3>
          <table style={{width:'100%',marginTop:'16px',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{borderBottom:'2px solid #e5e7eb'}}>
                <th style={{padding:'12px',textAlign:'left'}}>Employee</th>
                <th style={{padding:'12px',textAlign:'left'}}>Type</th>
                <th style={{padding:'12px',textAlign:'left'}}>Dates</th>
                <th style={{padding:'12px',textAlign:'left'}}>Status</th>
                <th style={{padding:'12px',textAlign:'left'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map(leave => (
                <tr key={leave.id} style={{borderBottom:'1px solid #f3f4f6'}}>
                  <td style={{padding:'12px'}}>{leave.full_name}</td>
                  <td style={{padding:'12px'}}>{leave.leave_type}</td>
                  <td style={{padding:'12px'}}>{leave.start_date} to {leave.end_date}</td>
                  <td style={{padding:'12px'}}>{leave.status}</td>
                  <td style={{padding:'12px'}}>
                    {leave.status === 'pending' && (
                      <div style={{display:'flex',gap:'8px'}}>
                        <button onClick={()=>updateLeave(leave.id,'approved')} style={{padding:'6px 12px',background:'#10B981',color:'white',border:'none',borderRadius:'6px',cursor:'pointer'}}>Approve</button>
                        <button onClick={()=>updateLeave(leave.id,'rejected')} style={{padding:'6px 12px',background:'#EF4444',color:'white',border:'none',borderRadius:'6px',cursor:'pointer'}}>Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
