import React, { useEffect, useState } from 'react'
import api from "../../../api/axios"
import ErrorMsg from '../../../components/ErrorMsg'
import City from './components/City'
import CityForm from './components/CityForm'
import Select from '../../../components/Select'
import Option from '../../../components/Option'

const Cities = () => {
  const [cities ,setCities] = useState([])
  const [counties ,setCounties] = useState([])
  const [filter, setFilter] = useState('')
  const [serverMsg, setServerMsg] = useState()
  const [msgColor, setMsgColor] = useState('')

  useEffect(() =>{
    fetchCities()
    fetchCounties()
  },[])

  const fetchCities = async () =>{
    try{
      const res = await api.get('/cities')
      setCities(res.data)
      setServerMsg('')
    }catch (err){
      setServerMsg(`Error: ${err.message}`)
    }
  }

  const fetchCounties = async () =>{
    try{
      const res = await api.get('/counties')
      setCounties(res.data)
      setServerMsg('')
    }catch (err){
      setServerMsg(`Error: ${err.message}`)
    }
  }

  const handleChange = (e) =>{
    setFilter(e.target.value)
  }

  const handleCreate = async (values) =>{
    try{
      const res = await api.post('/cities',{name:values.city, countyId:values.county})
      const newCities = [...cities, {...res.data.city}]
      setCities(newCities)
      setServerMsg(res.data.message)
      setMsgColor('text-green-500')
    }catch(err){
      setServerMsg(`Error: ${err.message}`)
      setMsgColor('text-red-500')
    }
  }

  const handleDelete = async (id) => {
    try{
      const res = await api.delete(`/cities/${id}`)
      const newCities = cities.filter(city => city.id !== id)
      setCities(newCities)
      setServerMsg(res.data.message)
      setMsgColor('text-green-500')
    }catch(err){
      setServerMsg(`Error: ${err.response.data.message}`)
      setMsgColor('text-red-500')
    }
  }
  
  const handleUpdate = async (values) =>{
    try{
      const res = await api.patch(`/cities/${values.id}`,{name:values.city,countyId:values.county})
      const newCities = cities.map(city => (city.id === values.id ? {...city, name:values.city, edit:false} : {...city}))
      setCities(newCities)
      setServerMsg(res.data.message)
      setMsgColor('text-blue-500')
    }catch(err){
      setServerMsg(`Error: ${err.response.data.message}`)
      setMsgColor('text-red-500')
    }
  }

  const handleEdit = async (id) => {
    const newCities = cities.map(city => (city.id === id ? {...city, edit:true} : {...city, edit:false}))
    setCities(newCities)
  }

  const toggleConfDelBox = (id)=>{
    const newCities = cities.map(city => city.id === id ? {...city, deleteBox:!city.deleteBox} : city)
    setCities(newCities)
  }

  return (
    <section className='bg-gray-900 text-gray-300'>

      <section className="flex flex-row justify-between items-center p-5 text-xl border-b font-medium">
        <p>Filtreaza dupa Judet:</p>
        <Select name="citySelector" id="citySelector" handleChange={handleChange} className='text-gray-900'>
          <Option value="">--Alege un Judet--</Option>
          {counties.map(county => 
            <Option 
              key={county.id} 
              value={county.id}
            >
              {county.name}
            </Option>
          )}
        </Select>
      </section>

      <ErrorMsg color={msgColor}>{serverMsg}</ErrorMsg>

      <CityForm 
        counties={counties}
        buttonText='Adauga'
        handleSubmit={handleCreate}
      />

      {cities.map(city => 
        <City 
          key={city.id} 
          toggleConfDelBox={() => toggleConfDelBox(city.id)}
          handleEdit={() => handleEdit(city.id)} 
          city={city} 
          handleDelete={() => handleDelete(city.id)}
          handleUpdate={handleUpdate}
          counties={counties}
          classes={filter && city.CountyId !== filter && "hidden"}
        />
      )}

    </section>
  )
}

export default Cities