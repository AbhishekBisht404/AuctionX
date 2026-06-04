export default function AdminDashboard() {
  return (
    <div className="w-full space-y-6">
      <div className="bg-blue-900 border border-blue-600 rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-blue-600">
          <h3 className="text-xl sm:text-2xl font-bold text-yellow-300 m-0">Platform Overview</h3>
        </div>
        <p className="text-center text-blue-300 py-12 px-4">Admin metrics and statistics coming soon...</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-blue-900 border border-blue-600 rounded-lg p-4 sm:p-6">
          <h4 className="text-yellow-300 font-semibold text-sm uppercase tracking-wide m-0 mb-2\">Total Users</h4>
          <p className="text-3xl sm:text-4xl font-bold text-yellow-300 m-0\">--</p>
        </div>
        <div className="bg-blue-900 border border-blue-600 rounded-lg p-4 sm:p-6\">
          <h4 className="text-yellow-300 font-semibold text-sm uppercase tracking-wide m-0 mb-2\">Active Auctions</h4>
          <p className="text-3xl sm:text-4xl font-bold text-yellow-300 m-0\">--</p>
        </div>
        <div className="bg-blue-900 border border-blue-600 rounded-lg p-4 sm:p-6\">
          <h4 className="text-yellow-300 font-semibold text-sm uppercase tracking-wide m-0 mb-2\">Total Bids</h4>
          <p className="text-3xl sm:text-4xl font-bold text-yellow-300 m-0\">--</p>
        </div>
      </div>
    </div>
  );
}
