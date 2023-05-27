import { useFormik } from 'formik'
import React from 'react'
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
            <section>
                <label htmlFor='confPassword'>
                {formik.touched.confPassword && formik.errors.confPassword 
                    ? formik.errors.confPassword
                    : 'Confirmare Parola'
                }
                </label>
                <input 
                    id='confPassword'
                    name='confPassword'
                    type='password'
                    placeholder='Confirmati parola'
                    onChange={formik.handleChange}
                    value={formik.values.confPassword}
                    onBlur={formik.handleBlur}
                />
            </section>
            <section>
                <label htmlFor='email'>
                    {formik.touched.email && formik.errors.email 
                        ? formik.errors.email
                        : 'Email'
                    }
                </label>
                <input 
                    id='email'
                    name='email'
                    type='email'
                    placeholder='Email'
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    onBlur={formik.handleBlur}
                />
            </section>
            <button type="submit">Inregistreaza-te</button>
        </form>
    </section>
  )
}

export default Register