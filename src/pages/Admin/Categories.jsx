import { useFormik } from 'formik'
import * as Yup from "yup"
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import { useEffect } from 'react'
import { useState } from 'react'
import ConfBox from '../../components/ConfBox'
import { useNavigate } from 'react-router-dom'

const Categories = () => {

  const navigate = useNavigate()

  const api = useAxiosPrivate()

  const [categories, setCategories] = useState([])
  const [showConfBox, setShowConfBox] = useState(false)

  const toggleShowConfBox = () => setShowConfBox(prev => !prev)

  useEffect( () => {
    const fetchCategories = async () =>{
      const res = await api.get('/categories')
      setCategories(res.data)
    }

    fetchCategories()
  }, [])

  const handleDelete = async (id) =>{
    const res = await api.delete(`/categories/${id}`)
    const newCategories = categories.filter(category => category.id !== id)
    setCategories(newCategories)
  }
  

  const formik = useFormik({
    initialValues:{
      name: ''
    },

    validationSchema: Yup.object({
      name: Yup.string().required("Camp obligatoriu").max(100, "Numele trebuie sa fie mai scurt de 100 de caractere")
    }),

    onSubmit: async (values) =>{
      const res = await api.post('/categories', {name: values.name})
      setCategories(prev => [...prev, res?.data?.category])
      console.log(res.data)
    }
  })

  return (
    <section>
        <form onSubmit={formik.handleSubmit} className="bg-gray-900">
            <section className='mb-6'>
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
            <button type='submit'>Adauga</button>
        </form>
        <section>
            {categories.map(category => 
              <section key={category.id} className='p-5 bg-gray-900 border-b-2 flex justify-between items-center text-gray-300 text-2xl'>
                <p onClick={() => navigate('/admin/Entities', {state: {filter: category.id}})}>{category.name}</p>
                <button type="button" onClick={toggleShowConfBox}>Sterge</button>
                {showConfBox && <ConfBox handleNo={toggleShowConfBox} handleYes={() => handleDelete(category.id)} >Confirmati stergerea?</ConfBox>}
              </section>
              )}
        </section>
    </section>
  )
}

export default Categories