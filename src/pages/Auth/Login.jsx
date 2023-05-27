import { useFormik } from 'formik'
import React from 'react'
import * as Yup from "yup"
import api from "../../api/axios"
import useAuth from '../../hooks/useAuth'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const Login = () => {

    const {auth, setAuth} = useAuth()

    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/'

    const handleSubmit = async (values) =>{
        try{
            const res = await api.post('/login',{username:values.username,password:values.password},
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
            const accessToken = res.data.accessToken
            setAuth({username:values.username, accessToken})
            navigate(from, { replace: true })
        }catch(err){
            console.log(err)
        }
    }

    const formik = useFormik({
        initialValues:{
            username: '',
            password: '',
        },

        validationSchema: Yup.object({
            username: Yup.string().required('Camp obligatoriu'),
            password: Yup.string().required('Camp obligatoriu')
        }),

        onSubmit:handleSubmit
    })


  return (
    <section className='bg-gray-900 text-gray-300 pt-3 border-t'>
        <h3 className='text-3xl text-center font-bold'>Autentificare</h3>
        <form onSubmit={formik.handleSubmit} className='gap-5'>
            <section>
                <label htmlFor='username'>
                    {formik.touched.username && formik.errors.username 
                        ? formik.errors.username
                        : 'Nume utilizator'
                    }
                </label>
                <input 
                    id='username'
                    name='username'
                    type='text'
                    placeholder='Nume utilizator'
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    onBlur={formik.handleBlur}
                />
            </section>
            <section>
                <label htmlFor='password'>
                    {formik.touched.password && formik.errors.password 
                        ? formik.errors.password
                        : 'Parola'
                    }
                </label>
                <input 
                    id='password'
                    name='password'
                    type='password'
                    placeholder='Parola'
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    onBlur={formik.handleBlur}
                />
            </section>
            <button type="submit">Auntentifica-te</button>
        </form>
    </section>
  )
}

export default Login