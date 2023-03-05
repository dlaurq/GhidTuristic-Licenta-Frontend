import { NavLink } from "react-router-dom"

const MainNav = () => {
  return (
    <nav className="flex flex-row justify-between bg-gray-800 text-gray-300 px-20 py-5 font-bold items-center">
      <h1 className="text-3xl">Ghid Turisitc</h1>
      <ul>
        <li>
          <NavLink to="admin" className=" text-xl">Admin</NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default MainNav