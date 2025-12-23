import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  UtensilsCrossed, 
  LogOut, 
  Menu,
  Bell
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-blue-400">IndoCafe</h1>
          <p className="text-xs text-slate-400 mt-1">Back Office Panel</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center px-4 py-3 bg-blue-600 rounded-lg text-white">
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors">
            <Store className="h-5 w-5 mr-3" />
            Outlets
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors">
            <UtensilsCrossed className="h-5 w-5 mr-3" />
            Menu Items
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors">
            <Users className="h-5 w-5 mr-3" />
            Staff
          </a>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center px-4 py-2">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <button className="md:hidden text-gray-500 focus:outline-none">
              <Menu className="h-6 w-6" />
            </button>
            
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                <Bell className="h-5 w-5" />
              </button>
              
              <div className="h-6 w-px bg-gray-200 mx-2"></div>
              
              <button 
                onClick={logout}
                className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Stats Cards */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
                <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <LayoutDashboard className="h-5 w-5" />
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-800">1,248</p>
              <p className="text-green-500 text-sm mt-2 flex items-center">
                +12.5% <span className="text-gray-400 ml-1">from last month</span>
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                <span className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <Store className="h-5 w-5" />
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-800">$45,200</p>
              <p className="text-green-500 text-sm mt-2 flex items-center">
                +8.2% <span className="text-gray-400 ml-1">from last month</span>
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 text-sm font-medium">Active Outlets</h3>
                <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Store className="h-5 w-5" />
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-800">12</p>
              <p className="text-gray-400 text-sm mt-2">
                Across 4 cities
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-96 flex items-center justify-center text-gray-400">
            Main Content Area
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
