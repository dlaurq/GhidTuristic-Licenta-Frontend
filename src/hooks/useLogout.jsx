import api from "../api/axios"
import useAuth from './useAuth'

const useLogout = () => {
    const {setAuth} = useAuth()

    const logout = async () => {
        setAuth({})
        try{
            const res = await api.get('/auth/logout', {
                withCredentials: true
            })
        }catch(err){
            console.log(err)
        }
    }
  return logout
}

export default useLogout