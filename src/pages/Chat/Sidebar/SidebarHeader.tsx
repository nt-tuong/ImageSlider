import { Menu, Search } from "lucide-react";

const SidebarHeader = () => {
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-bold text-blue-600">Zalo Chat Clone</h1>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Menu size={20} className="text-gray-600" />
        </button>
      </div>
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm"
          className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default SidebarHeader;