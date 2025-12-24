import { 
  LayoutDashboard, 
  TrendingUp,
  ShoppingBag,
  Users
} from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Stats Cards */}
        <div className="bg-surface p-6 rounded-xl shadow-sm border border-secondary/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-secondary text-sm font-medium">Total Orders</h3>
            <span className="p-2 bg-primary/10 text-primary rounded-lg">
              <ShoppingBag className="h-5 w-5" />
            </span>
          </div>
          <p className="text-3xl font-bold text-text">1,248</p>
          <p className="text-green-500 text-sm mt-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +12.5% <span className="text-secondary ml-1">from last month</span>
          </p>
        </div>

        <div className="bg-surface p-6 rounded-xl shadow-sm border border-secondary/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-secondary text-sm font-medium">Total Revenue</h3>
            <span className="p-2 bg-green-100 text-green-600 rounded-lg">
              <LayoutDashboard className="h-5 w-5" />
            </span>
          </div>
          <p className="text-3xl font-bold text-text">$45,231</p>
          <p className="text-green-500 text-sm mt-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +8.2% <span className="text-secondary ml-1">from last month</span>
          </p>
        </div>

        <div className="bg-surface p-6 rounded-xl shadow-sm border border-secondary/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-secondary text-sm font-medium">Active Users</h3>
            <span className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Users className="h-5 w-5" />
            </span>
          </div>
          <p className="text-3xl font-bold text-text">3,405</p>
          <p className="text-red-500 text-sm mt-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-1 rotate-180" />
            -2.4% <span className="text-secondary ml-1">from last month</span>
          </p>
        </div>
      </div>

      {/* Recent Activity or Charts could go here */}
      <div className="bg-surface rounded-xl shadow-sm border border-secondary/10 p-6">
        <h3 className="text-lg font-semibold text-text mb-4">Recent Activity</h3>
        <div className="text-secondary text-center py-8">
          Chart placeholder
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
