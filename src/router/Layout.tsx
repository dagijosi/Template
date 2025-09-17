import { Outlet, Link } from "react-router-dom";

const MainLayout = () => (
  <>
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex space-x-4">
        <Link to="/" className="text-white">Home</Link>
        <Link to="/items" className="text-white">Items</Link>
        <Link to="/tasks" className="text-white">Tasks</Link>
        <Link to="/protected" className="text-white">Protected</Link>
        <Link to="/ai-demo" className="text-white">AI Demo</Link>
      </div>
    </nav>
    <main className="flex-grow">
      <Outlet />
    </main>
  </>
);

export default MainLayout;
