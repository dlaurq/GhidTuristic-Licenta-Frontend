import React, { useEffect, useState } from 'react'
import api from "../../../api/axios"
import ErrorMsg from '../../../components/ErrorMsg'
import Location from './components/Location'
import LocationForm from './components/LocationForm'
import Select from '../../../components/Select'
import Option from '../../../components/Option'
import { useLocation } from 'react-router-dom'

const Locations = () => {
  const [cities ,setCities] = useState([])
  const [locations ,setLocations] = useState([])
  const [filter, setFilter] = useState('')
  const [serverMsg, setServerMsg] = useState()
  const [msgColor, setMsgColor] = useState('')

  const location = useLocation()

  useEffect(() =>{
    fetchCities()
    fetchLocations()
    setFilter(location?.state?.id)
  },[])

  const fetchCities = async () =>{
    try{
      const res = await api.get('api/cities')
      setCities(res.data)
      setServerMsg('')
    }catch (err){
      setServerMsg(`Error: ${err.message}`)
    }
  }

  const fetchLocations = async () =>{
    try{
      const res = await api.get('api/locations')
      setLocations(res.data)
      setServerMsg('')
    }catch (err){
      setServerMsg(`Error: ${err.message}`)
    }
  }

  const handleChange = (e) =>{
    setFilter(e.target.value)
  }

  const handleCreate = async (values) =>{
    console.log(values)
    try{
      const res = await api.post('api/locations',{address:values.location, cityId:values.city})
      console.log(res.data)
      const newLocations = [...locations, {...res.data.location}]
      setLocations(newLocations)
      setServerMsg(res.data.message)
      setMsgColor('text-green-500')
    }catch(err){
      setServerMsg(`Error: ${err.message}`)
      setMsgColor('text-red-500')
    }
  }

  const handleDelete = async (id) => {
    try{
      const res = await api.delete(`api/locations/${id}`)
      const newLocations = locations.filter(location => location.id !== id)
      setLocations(newLocations)
      setServerMsg(res.data.message)
      setMsgColor('text-green-500')
    }catch(err){
      setServerMsg(`Error: ${err.response.data.message}`)
      setMsgColor('text-red-500')
    }
  }
  
  const handleUpdate = async (values) =>{
    try{
      const res = await api.patch(`api/locations/${values.id}`,{address:values.location,cityId:values.city})
      const newLocations = locations.map(location => (location.id === values.id ? {...location, address:values.location, edit:false} : {...location}))
      setLocations(newLocations)
      setServerMsg(res.data.message)
      setMsgColor('text-blue-500')
    }catch(err){
      setServerMsg(`Error: ${err.response.data.message}`)
      setMsgColor('text-red-500')
    }
  }

  const handleEdit = async (id) => {
    const newLocations = locations.map(location => (location.id === id ? {...location, edit:true} : {...location, edit:false}))
    setLocations(newLocations)
  }

  const toggleConfDelBox = (id)=>{
    const newLocations = locations.map(location => location.id === id ? {...location, deleteBox:!location.deleteBox} : location)
    setLocations(newLocations)
  }

  return (
    <section className='bg-gray-900 text-gray-300'>

      <section className="flex flex-row justify-between items-center p-5 text-xl border-b font-medium">
        <p>Filtreaza dupa Oras:</p>
        <Select name="locationSelector" id="locationSelector" handleChange={handleChange} className='text-gray-900' value={filter}>
          <Option value="">--Alege un Oras--</Option>
          {cities.map(city => 
            <Option 
              key={city.id} 
              value={city.id}
            >
              {city.name}
            </Option>
          )}
        </Select>
      </section>
      
      {/** 
      <ErrorMsg color={msgColor}>{serverMsg ? serverMsg : "Adauga o adresa"}</ErrorMsg>
      
        <LocationForm 
          cities={cities}
          buttonText='Adauga'
          handleSubmit={handleCreate}
        />
      */}
      {locations.map(location => 
        <Location 
          key={location.id} 
          toggleConfDelBox={() => toggleConfDelBox(location.id)}
          handleEdit={() => handleEdit(location.id)} 
          location={location} 
          handleDelete={() => handleDelete(location.id)}
          handleUpdate={handleUpdate}
          cities={cities}
          className={filter && location.CityId !== filter && "hidden"}
        />
      )}

    </section>
  )
}

export default Locations