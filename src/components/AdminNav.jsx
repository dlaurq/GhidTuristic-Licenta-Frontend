import { NavLink } from "react-router-dom"


const AdminNav = () => {

  return (
    <nav className="">
        <ul className="grid grid-cols-2 p-5 gap-2 h-full sm:grid-cols-3 sm:px-16 md:grid-cols-4 md:px-28 md:gap-3 lg:grid-cols-6 lg:gap-5 lg:px-36 xl:grid-cols-8 2xl:w-11/12 2xl:mx-auto">
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