import { NavLink } from "react-router-dom"


const AdminNav = () => {
  return (
    <nav className="py-10 px-5 bg-zinc-300 text-gray-900 text-2xl font-bold">
        <ul className="flex flex-row justify-start items-start flex-wrap">
          {[
            ['Admin','/admin'],
            ['Tari','Country'],
            ['Judete','County'],
            ['Orase','City'],
            ['Adrese','Locations'],
            ['Utilizatori','Users'],
            ['Entitati','Entities'],
          ].map(([title, url]) => (
            <li key={title} className="pr-5 py-2 hover:underline focus:underline underline-offset-8"><NavLink className={({isActive}) => isActive ? 'text-emerald-600 underline' : {undefined}} to={url}>{title}</NavLink></li>
          ))
          }
        </ul>
    </nav>
  )
}

export default AdminNav