import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col ">
      {/* Header */}
      <header className="bg-gray-900 px-[5px] md:px-[100px] text-white py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">📒 Моя CRM</h1>
          <nav className="flex gap-4">
            <NavLink
              to="/debts"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 font-semibold"
                  : "text-white hover:text-yellow-300"
              }
            >
              Долги
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 font-semibold"
                  : "text-white hover:text-yellow-300"
              }
            >
              Товары
            </NavLink>
            <NavLink
              to="/installments"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 font-semibold"
                  : "text-white hover:text-yellow-300"
              }
            >
              Рассрочки
            </NavLink>
            <NavLink
              to="/staticstics"
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-400 font-semibold"
                  : "text-white hover:text-yellow-300"
              }
            >
              Статистика
            </NavLink>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-[5px] md:px-[100px] container mx-auto p-4">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 px-[5px] md:px-[100px]11    text-center text-sm py-4">
        &copy; {new Date().getFullYear()} Моя CRM. Все права защищены.
      </footer>
    </div>
  );
}
