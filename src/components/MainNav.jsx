import { NavLink, Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faX} from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import useAuth from "../hooks/useAuth"
import jwt_decode from "jwt-decode"
import useLogout from "../hooks/useLogout"

const MainNav = () => {
  const [mobileNav, setMobileNav] = useState(false)

  const {auth} = useAuth()
  const logout = useLogout()

  const roles = auth.roles

  useEffect(() => {
    //console.log(auth)
  }, [])

  const handleClick = () =>{
    setMobileNav(prevMobileNav => !prevMobileNav)

  }

  const handleLogout = async () => {
    await logout()
  }

  return (
    <>
      {!mobileNav
        ?<nav className="h-full flex flex-row justify-between items-center bg-gray-900 text-gray-300 p-5 font-bold ">
          <Link className="text-3xl w-1/2" to='/'>Ghidul Calatorului</Link>
          <FontAwesomeIcon onClick={handleClick} icon={faBars} size='3x'/>
          
          <ul className="hidden">
          <li><NavLink to="admin" className=" text-xl">Admin</NavLink></li>
          <li></li>
          </ul>
        </nav>
        :<nav onClick={handleClick} className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-screen h-screen flex flex-col items-center bg-gray-900  text-gray-300 font-bold ">
            <header className="flex justify-between items-center p-5 border-b-2">
              <Link className="text-3xl w-1/2" to='/'>Ghidul Calatorului</Link>
              <FontAwesomeIcon icon={faX} size='3x'/>
            </header>
            <ul className="pt-20 text-3xl font-normal flex flex-col justify-evenly items-center gap-5">
              <>
                {!auth?.accessToken
                  ?<>
                    <li><NavLink to="register" className="">Inregistrare</NavLink></li>
                    <li><NavLink to="login" className="">Autentificare</NavLink></li>
                  </>  
                  :<>
                    <li><NavLink to="/cont" className="">Cont</NavLink></li>
                    <li><NavLink to="/" onClick={handleLogout} className="">Logout</NavLink></li>

                    {roles?.find(role => role === 420) 
                    ?<li><NavLink to="admin" className="">Admin</NavLink></li>
                    :roles?.find(role => role === 1337) && <li><NavLink to="partener" className="">Partener</NavLink></li>}

                  </>
                
              }
                  
                  
              </>
            </ul>
          </nav>
      }
    </>
  )
}

export default MainNav