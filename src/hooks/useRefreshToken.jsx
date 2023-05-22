import api from '../api/axios'
import useAuth from './useAuth'

const useRefreshToken = () => {
    const {setAuth} = useAuth()

    const refresh = async () => {
        const res = await api.get('/refresh',{
            withCredentials:true
        })
        setAuth(prev =>{
            //console.log(JSON.stringify(prev))
            //console.log(res.data.accessToken)
            //console.log(prev)
            return {
                ...prev, 
                accessToken:res.data.accessToken,
                roles: res.data.roles,
                username: res?.data?.username
            }
        })

        return res.data.accessToken
    }
  return refresh
}

export default useRefreshToken