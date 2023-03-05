import { NavLink } from "react-router-dom"


const AdminNav = () => {
  return (
    <nav className="py-5 bg-gray-700 text-gray-300 text-xl font-bold">
        <ul className="flex flex-row justify-evenly ">
            <li><NavLink to="Country">Tari</NavLink></li>
            <li><NavLink to="County">Judete</NavLink></li>
            <li><NavLink to="City">Orase</NavLink></li>
            <li><NavLink to="Location">Locatii</NavLink></li>
        </ul>
    </nav>
  )
}

export default AdminNav