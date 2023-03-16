import { NavLink } from "react-router-dom"


const AdminNav = () => {
  return (
    <nav className="py-10 px-2 bg-zinc-300 text-gray-900 text-2xl font-bold">
        <ul className="flex flex-row justify-evenly items-start flex-wrap gap-5">
          {[
            ['Admin','/admin'],
            ['Tari','Country'],
            ['Judete','County'],
            ['Orase','City'],
            ['Adrese','Locations'],
            ['Utilizatori','Location'],
            ['Recenzii','Location'],
            ['Entitati','Location'],
            ['Poze','Location'],
          ].map(([title, url]) => (
            <li key={title} className="hover:underline focus:underline underline-offset-8"><NavLink className={({isActive}) => isActive ? 'text-emerald-600 underline' : {undefined}} to={url}>{title}</NavLink></li>
          ))
          }
        </ul>
    </nav>
  )
}

export default AdminNav