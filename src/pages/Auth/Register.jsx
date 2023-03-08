import { useFormik } from 'formik'
import React from 'react'
import Button from '../../components/Button'
import Form from '../../components/Form'
import Input from '../../components/Input'
import Label from '../../components/Label'
import * as Yup from "yup"
import api from "../../api/axios"

const Register = () => {

    const handleSubmit = async (values) =>{
        try{
            const res = await api.post('/register',
                {
                    username:values.username, 
                    password:values.password, 
                    email:values.email
                },
                {
                    headers: { 'Content-Type': 'application/json'},
                    withCredentials: true
                }
            )
            console.log(res.data)

        }catch(err){
            //console.log(err)
        }
    }


    const formik = useFormik({
        initialValues:{
            username: '',
            password: '',
            confPassword: '',
            email: '',
        },

        validationSchema: Yup.object({
            username: Yup.string()
                .required('Camp obligatoriu')
                .min(4,"Numele utilizatorului trebuie sa aibe minim 4 caractere")
                .max(16,"Numele utilizatorului nu poate depasi 16 caractere")
                .matches(/^[a-zA-Z0-9_]*$/, "Numele utilizatorului trebuie sa contina doar litere  si cifre"),
            password: Yup.string()
                .required('Camp obligatoriu')
                .min(8,'Parola trebuie sa aiba minim 8 caractere'),
            confPassword: Yup.string()
                .required('Camp obligatoriu')
                .oneOf([Yup.ref('password'), null], 'Parolele trebuie sa coincida'),
            email: Yup.string()
                .required('Camp obligatoriu')
                .email('Email-ul nu este valid'),
        }),

        onSubmit:handleSubmit
    })


  return (
    <section className='bg-gray-900 text-gray-300 pt-3 border-t'>
        <h3 className='text-3xl text-center font-bold'>Inregistare</h3>
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
            <section>
                <Label htmlFor='confPassword'>
                {formik.touched.confPassword && formik.errors.confPassword 
                    ? formik.errors.confPassword
                    : 'Confirmare Parola'
                }
                </Label>
                <Input 
                    id='confPassword'
                    name='confPassword'
                    type='password'
                    placeholder='Confirmati parola'
                    handleChange={formik.handleChange}
                    value={formik.values.confPassword}
                    handleBlur={formik.handleBlur}
                />
            </section>
            <section>
                <Label htmlFor='email'>
                    {formik.touched.email && formik.errors.email 
                        ? formik.errors.email
                        : 'Email'
                    }
                </Label>
                <Input 
                    id='email'
                    name='email'
                    type='email'
                    placeholder='Email'
                    handleChange={formik.handleChange}
                    value={formik.values.email}
                    handleBlur={formik.handleBlur}
                />
            </section>
            <Button type="submit">Inregistreaza-te</Button>
        </Form>
    </section>
  )
}

export default Register