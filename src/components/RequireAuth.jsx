import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import jwt_decode from "jwt-decode"

const RequireAuth = ({allowedRoles}) => {
    const {auth} = useAuth()
    const location = useLocation()

    const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined

    //console.log(decoded)
    const roles = decoded?.UserInfo.roles || []
    
    return (
        roles.find(role => allowedRoles?.includes(role))
            ? <Outlet />
            : <Navigate to='/login' state={{from:location}} replace />
    )
}

export default RequireAuth