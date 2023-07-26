const STATIC_API_ROUTE = import.meta.env.VITE_BASE_BACKEND_URL + '/uploads/'


const useStaticApi = () => {
  return STATIC_API_ROUTE
}

export default useStaticApi