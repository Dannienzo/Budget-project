import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Context/AuthContext'
import Sidebar from '../../Navbarfiles/Sidebar';
import Header from '../../Navbarfiles/Header';
import FinanceDashboard from './FinanceDashboard';
import Budgeting from './Budgeting';
import Transaction from './Transaction';
import Settings from './Settings';
import Analytics from './Analytics';
import Report from './Report';


const Dashboard = () => {

  const {api, logout} = useAuth()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null);
  const [currentPage, SetCurrentPage] = useState('FinanceDashboard')

  useEffect(() => {
    const fetchDashboard = async () => {
      try{
        const userRes = await api.get("dashboard/")
        setUserData(userRes.data)
      }catch (err){
        console.error("Error fetching dashboard data:", err)
      }finally{
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [api])

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen bg-[#0b0b0f]'>
        <p className='text-white text-lg'>Loading Dashboard...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-[#0b0b0f] text-white overflow-hidden">
      <Sidebar 
        currentPage={currentPage}
        onPageChange={SetCurrentPage}
        logout={logout}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full lg:w-auto">
        <Header username={userData?.username}
         recentActivity={userData?.recent_transactions || []}
         goToSettings={() => SetCurrentPage("Settings")}
        />

        <main className='flex-1 overflow-y-auto bg-transparent pt-0 lg:pt-0'>
          <div className='p-4 sm:p-6 space-y-4 sm:space-y-6'>
            {currentPage === "FinanceDashboard" && <FinanceDashboard data={userData} />}
            {currentPage === "Analytics" && <Analytics /> }
            {currentPage === "Transaction" && <Transaction /> }
            {currentPage === "Budgeting" && <Budgeting /> }
            {currentPage === "Report" && <Report />}
            {currentPage === "Settings" && <Settings /> }
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;