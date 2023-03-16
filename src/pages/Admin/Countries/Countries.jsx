import { useEffect, useState } from "react"
import Country from "./components/Country"
import CountryForm from "./components/CountryForm"
import ErrorMsg from "../../../components/ErrorMsg"
import useAxiosPrivate from "../../../hooks/useAxiosPrivate"
import { useNavigate, useLocation } from "react-router-dom"

const Countries = () => {
  const [countries, setCountries] = useState([])
  const [serverMsg, setServerMsg] = useState('')
  const [msgColor, setMsgColor] = useState('')
  const [delConfBox, setDelConfBox] = useState(false)
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const location = useLocation()

  
  
  useEffect(()=>{

    const fetchCountries = async () =>{
      try{
        const res = await axiosPrivate.get('/countries', {
        })
        const newCountries = res.data.map(country => ({...country, edit:false}))
        setCountries(newCountries)
        setServerMsg('')
      }catch (err){
        console.log(err)
        navigate('/login', { state: { from: location}, replace: true})
        setServerMsg(`Error: ${err.message}`)
      }
    }
  
    fetchCountries()


  },[])

  const handleCreate = async (values) => {
    try{
      const res = await axiosPrivate.post('/countries',{name:values.country})
      console.log(res.data)
      const newCountries = [...countries, {...res.data.country, edit:false}]
      setCountries(newCountries)
      setServerMsg(res.data.message)
      setMsgColor('text-green-500')
    }catch(err){
      console.log(err.response)
      setServerMsg(`Error: ${err.response.data.message}`)
    }
    
  }

  const handleDelete = async (id) => {
    try{
      const res = await axiosPrivate.delete(`/countries/${id}`)
      const newCountries = countries.filter(country => country.id !== id)
      setCountries(newCountries)
      setServerMsg(res.data.message)
      setMsgColor('text-green-500')
    }catch(err){
      setServerMsg(`Error: ${err.response.data.message}`)
      setMsgColor('text-red-500')
    }finally{
      setDelConfBox(false)
    }
  }
  
  const handleUpdate = async (values) =>{
    console.log(values)
    try{
      const res = await axiosPrivate.patch(`/countries/${values.id}`,{name:values.country})
      const newCountries = countries.map(country => (country.id === values.id ? {...country, name:values.country, edit:false} : {...country}))
      setCountries(newCountries)
      setServerMsg(res.data.message)
      setMsgColor('text-blue-500')
    }catch(err){
      setServerMsg(`Error: ${err.response.data.message}`)
    }
  }

  const handleEdit = async (id) => {
    const newCountries = countries.map(country => (country.id === id ? {...country, edit:true} : {...country, edit:false}))
    setCountries(newCountries)
    
  }

  const toggleConfDelBox = (id)=>{
    const newCountries = countries.map(country => country.id === id ? {...country, deleteBox:!country.deleteBox} : country)
    setCountries(newCountries)
  }


  

  return (
    <section className="bg-gray-900">
      
      <ErrorMsg color={msgColor}>{serverMsg}</ErrorMsg>
      <CountryForm handleSubmit={handleCreate} buttonText='Adauga'/>

      {countries.map(country =>
        <Country 
          toggleConfDelBox={() => toggleConfDelBox(country.id)}
          delConfBox={delConfBox}
          country={country} 
          handleDelete={() => handleDelete(country.id)} 
          handleEdit={() => handleEdit(country.id)} 
          handleUpdate={handleUpdate}
          key={country.id}
        />
      )}

    </section>
  )
}

export default Countries