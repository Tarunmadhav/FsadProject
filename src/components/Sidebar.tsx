import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaFolder, FaShareAlt, FaBell, FaCog, FaSignOutAlt, FaUser } from 'react-icons/fa';

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session or token logic here if needed
    navigate('/auth');
  };

  return (
    <nav className="bg-gray-800 text-white h-full w-64 p-4 flex flex-col justify-between">
      <ul className="space-y-4">
        <li>
          <Link to="/" className="flex items-center px-4 py-2 rounded hover:bg-gray-700">
            <FaHome className="mr-2" /> Home
          </Link>
        </li>
        <li>
          <Link to="/files" className="flex items-center px-4 py-2 rounded hover:bg-gray-700">
            <FaFolder className="mr-2" /> Files
          </Link>
        </li>
        <li>
          <Link to="/shared" className="flex items-center px-4 py-2 rounded hover:bg-gray-700">
            <FaShareAlt className="mr-2" /> Shared
          </Link>
        </li>
        <li>
          <Link to="/notifications" className="flex items-center px-4 py-2 rounded hover:bg-gray-700">
            <FaBell className="mr-2" /> Notifications
          </Link>
        </li>
        <li>
          <Link to="/settings" className="flex items-center px-4 py-2 rounded hover:bg-gray-700">
            <FaCog className="mr-2" /> Settings
          </Link>
        </li>
        <li>
          <Link to="/profile" className="flex items-center px-4 py-2 rounded hover:bg-gray-700">
            <FaUser className="mr-2" /> Profile
          </Link>
        </li>
      </ul>
      <div className="mt-auto">
        <button onClick={handleLogout} className="flex items-center px-4 py-2 rounded hover:bg-gray-700">
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>
    </nav>
  );
}

export default Sidebar;