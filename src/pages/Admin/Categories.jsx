import { useFormik } from 'formik'
import * as Yup from "yup"
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DropDownForm from '../../components/DropDownForm'
import ErrorMsg from '../../components/ErrorMsg'
import SearchBar from '../../components/SearchBar'
import AdminItem from '../../components/AdminItem'

const Categories = () => {

  const navigate = useNavigate()

  const api = useAxiosPrivate()

  const [categories, setCategories] = useState([])
  const [showConfBox, setShowConfBox] = useState(false)
  const [filteredCategs, setFilteredCategs] = useState(categories)
  const [serverResp, setServerResp] = useState({bgColor: 'bg-black', text: 'test', show: false})

  useEffect( () => {
    const fetchCategories = async () =>{
      try{
        const res = await api.get('/categories')
        setCategories(res.data)
      }catch(err){
        console.log(err)
      }
      
    }

    fetchCategories()
  }, [])

  const handleDelete = async (id) =>{
    try{
      const res = await api.delete(`/categories/${id}`)
      const newCategories = categories.filter(category => category.id !== id)
      setCategories(newCategories)
      setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
    }catch(err){
      console.log(err)
      setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
    }
    
  }
  
  const handleEdit = async (id) => {
    const newCategories = categories.map(category => (category.id === id ? {...category, edit:true} : {...category, edit:false}))
    setCategories(newCategories)
    
  }

const handleCreate = async (values) => {
  try{
    const res = await api.post('/categories', {name: values.name})
    setCategories(prev => [...prev, res?.data?.category])
    setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
  }catch(err){
    console.log(err)
    setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
  }
}

const toggleConfDelBox = (id)=>{
  const newCategs = categories.map(category => category.id === id ? {...category, deleteBox:!category.deleteBox} : category)
  setCategories(newCategs)
}

const handleUpdate = async (values) =>{
  try{
    const res = await api.patch(`/categories/${values.id}`,{name: values.name})
    const newCategories = categories.map(category => (category.id === values.id ? {...category, name:values.name, edit:false} : {...category}))
    setCategories(newCategories)
    setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
  }catch(err){
    setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
  }
}

const hideForm = () => {
  const newArr = categories.map(category => ({...category, edit: false}))
  setCategories(newArr)
}

  return (
    <section>

        {serverResp.show && <ErrorMsg bgColor={serverResp.bgColor} text={serverResp.text} setServerResp={setServerResp} />}

        <DropDownForm 
              text='Adauga o categorie' 
              form={<CategoryForm setCategories={setCategories} buttonText='Adauga' handleSubmit={handleCreate}/>}
            />

        <hr />

        <SearchBar list={categories} setFilterList={setFilteredCategs} compare='name' />

        <div className="p-2"></div>

          {filteredCategs.map(category => 
            <AdminItem 
              key={category.id}
              item={category}
              toggleConfDelBox={() => toggleConfDelBox(category.id)}
              handleDelete={() => handleDelete(category.id)} 
              handleNavigate={() => navigate('/admin/Entities', {state: {filter: category.id}})}
              subItemsLength={category?.Locations?.length}
              handleEdit={() => handleEdit(category.id)} 
              form={
                <CategoryForm buttonText='Edit' handleSubmit={handleUpdate} category={category}>
                  <button className="sm:w-40 mt-5 md:w-60 lg:w-80" type="button" onClick={hideForm}>Cancel</button>
                </CategoryForm>
              }
            />
          )}
        
    </section>
  )
}

const CategoryForm = ({ buttonText, children, handleSubmit, category }) => {

  const formik = useFormik({
    initialValues:{
      name: (category?.name || ''),
      id: (category?.id || '')
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Camp obligatoriu").max(100, "Numele trebuie sa fie mai scurt de 100 de caractere")
    }),

    onSubmit: handleSubmit
  })

  return(
    <form onSubmit={formik.handleSubmit} className="bg-gray-900">
      <section className='flex flex-col gap-2 '>
          <label htmlFor="name" className="">
            {formik.touched.name && formik.errors.name 
              ? formik.errors.name
              : 'Nume'}
          </label>
          <input
            id="name"
            name="name"
            placeholder="Introduceti numele"
            value={formik.values.name}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
          />
      </section>

      <section className="flex flex-col justify-between sm:flex-row lg:justify-start lg:gap-32">
        <button className=" sm:w-40 mt-5 md:w-60 lg:w-80" type="submit">{buttonText}</button>
        {children}
      </section>
    </form>
  )
}

export default Categories