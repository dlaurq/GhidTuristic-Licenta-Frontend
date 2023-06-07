import { NavLink } from "react-router-dom"


const AdminNav = () => {

  return (
    <nav className="">
        <ul className="sm:mx-auto sm:w-[37rem] sm:grid-cols-4 md:w-[45rem] lg:w-[61rem] lg:grid-cols-8 xl:w-[71rem]  grid grid-cols-2 gap-5 m-5">
          {[
            ['Admin','/admin'],
            ['Tari','tari'],
            ['Judete','judete'],
            ['Orase','orase'],
            ['Adrese','locatii'],
            ['Utilizatori','utilizatori'],
            ['Entitati','entitati'],
            ['Categorii','categorii'],
  
          ].map(([title, url]) => (
            <li 
              key={title} 
              className="border-2 border-gray-900 text-center text-xl decoration-amber-500 hover:underline focus:underline  underline-offset-4">
                <NavLink 
                  className={ ({isActive}) => 'block h-full w-full p-2' + (isActive ? ' text-amber-500 underline border-amber-500 font-bold'  : '') }
                  to={url}
                >
                    {title}
                </NavLink>
            </li>
          ))
          }
        </ul>
    </nav>
  )
}
export default AdminNav