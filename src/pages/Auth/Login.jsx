import { useFormik } from 'formik'
import React from 'react'
import Button from '../../components/Button'
import Form from '../../components/Form'
import Input from '../../components/Input'
import Label from '../../components/Label'
import * as Yup from "yup"
import api from "../../api/axios"

const Login = () => {

    const handleSubmit = async (values) =>{
        try{
            const res = await api.post('/login',{username:values.username,password:values.password},
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            })

            console.log(res.data)
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
        <Form handleSubmit={formik.handleSubmit} classes='gap-5'>
            <section>
                <Label htmlFor='username'>
                    {formik.touched.username && formik.errors.username 
                        ? formik.errors.username
                        : 'Nume utilizator'
                    }
                </Label>
                <Input 
                    id='username'
                    name='username'
                    type='text'
                    placeholder='Nume utilizator'
                    handleChange={formik.handleChange}
                    value={formik.values.username}
                    handleBlur={formik.handleBlur}
                />
            </section>
            <section>
                <Label htmlFor='password'>
                    {formik.touched.password && formik.errors.password 
                        ? formik.errors.password
                        : 'Parola'
                    }
                </Label>
                <Input 
                    id='password'
                    name='password'
                    type='password'
                    placeholder='Parola'
                    handleChange={formik.handleChange}
                    value={formik.values.password}
                    handleBlur={formik.handleBlur}
                />
            </section>
            <Button type="submit">Auntentifica-te</Button>
        </Form>
    </section>
  )
}

export default Login