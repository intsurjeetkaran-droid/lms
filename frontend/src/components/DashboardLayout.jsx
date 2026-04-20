import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <Sidebar role={user?.role} userName={user?.name} />
      <main className="lg:ml-64 min-h-screen">
        {/* Add padding-top on mobile to account for hamburger menu */}
        <div className="p-4 md:p-8 pt-16 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
