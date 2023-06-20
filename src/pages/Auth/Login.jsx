import { useFormik } from 'formik'
import * as Yup from "yup"
import api from "../../api/axios"
import useAuth from '../../hooks/useAuth'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import ErrorMsg from '../../components/ErrorMsg'

const Login = () => {

    const {auth, setAuth} = useAuth()
    const [serverResp, setServerResp] = useState({bgColor: 'bg-black', text: 'test', show: false})
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || '/'

    const handleSubmit = async (values) =>{
        try{
            const res = await api.post('/auth/login',{username:values.username,password:values.password},
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })
            const accessToken = res.data.accessToken
            setAuth({...auth, username:values.username, accessToken})
            navigate(from, { replace: true })
        }catch(err){
            setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
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
        <>
            {serverResp.show && <ErrorMsg bgColor={serverResp.bgColor} text={serverResp.text} setServerResp={setServerResp} />}

            <form onSubmit={formik.handleSubmit} className='sm:w-96 sm:my-10 sm:border-0 border-t gap-5 bg-gray-900'>
                <h3 className='text-3xl font-bold'>Autentificare</h3>
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
                        className='w-full'
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
                        className='w-full'
                    />
                </section>
                <button type="submit">Auntentifica-te</button>
            </form>
        </>
    )
}

export default Login