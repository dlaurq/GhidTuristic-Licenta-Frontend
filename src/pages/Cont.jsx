import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from "yup"

const Cont = () => {

    const {auth} = useAuth()
    const api = useAxiosPrivate()

    const [user, setUser] = useState({})

    useEffect(() => {

        const fetchUser = async () => {
            try{
                const res = await api.get(`/users/${auth.username}`)
                console.log(res.data)
                setUser(res.data)
            }catch(err){
                console.log(err)
            }
        }

        fetchUser()
    }, [])

  return (
    <section className='px-5'>
        <section className='text-xl'>
            <section className='flex flex-row justify-start items-center'>
                <FontAwesomeIcon icon={faUser} className="mr-5 text-4xl"/>
                <section>
                    <p className='text-2xl'>{user.firstName} {user.lastName}</p>
                    <p className='text-lg'>@{user.username}</p>
                </section>
            </section>
            
            <p>{user.email}</p>
            <p>{user.phoneNr}</p>
            <p>{user.bio}</p>
            <p>Adresa</p>
        </section>
       
        <button className='w-full my-3'>Editeaza profil</button>
        <button className='w-full my-3'>Schimba parola</button>
        <button className='w-full my-3'>Locatii vizitate</button>
        <button className='w-full my-3'>Locatii de vizitat</button>
        <button className='w-full my-3'>Recenziile mele</button>
        <button className='w-full my-3 bg-red-700 font-bold'>Sterge cont</button>
       
        <ProfilForm />
    </section>
  )
}


const ProfilForm = () => {
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    
    const formik = useFormik({
        initialValues:{
            lastName: '',
            firstName: '',
            bio: '',
            email: '',
            phoneNr: '',
        },

        validationSchema: Yup.object({
            lastName: Yup.string().min(4,'Camul trebuie sa contina minim 4 caracter'),
            firstName: Yup.string().min(4,'Camul trebuie sa contina minim 4 caracter'),
            bio: Yup.string(),
            email: Yup.string().email('Adresa de email este invalida'),
            phoneNr: Yup.string().matches(phoneRegExp, 'Numarul de telefon este invalid'),
        }),

        onSubmit: (values) => {
            console.log('asd')
            console.log(values)
        }
    })

    return(
        <form onSubmit={formik.handleSubmit} autoComplete="off">
            
            <label htmlFor="lastName">
                {formik.touched.lastName && formik.errors.lastName 
                    ? formik.errors.lastName
                    : 'Nume:'
                } 
            </label>
            <input 
                type="text" 
                name="lastName" 
                id="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />

            <label htmlFor="firstName">
                {formik.touched.firstName && formik.errors.firstName 
                    ? formik.errors.firstName
                    : 'Prenume: '
                } 
            </label>
            <input 
                type="text" 
                name="firstName" 
                id="firstName" 
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />

            <label htmlFor="bio">
                {formik.touched.bio && formik.errors.bio 
                    ? formik.errors.bio
                    : 'Bio: '
                } 
            </label>
            <input 
                type="text" 
                name="bio" 
                id="bio" 
                value={formik.values.bio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />

            <label htmlFor="email">
                {formik.touched.email && formik.errors.email 
                    ? formik.errors.email
                    : 'Email: '
                } 
            </label>
            <input 
                type="email" 
                name="email" 
                id="email" 
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />

            <label htmlFor="phoneNr">
                
                {formik.touched.phoneNr && formik.errors.phoneNr 
                    ? formik.errors.phoneNr
                    : 'Nr tel: '
                } 
            </label>
            <input 
                type="tel" 
                name="phoneNr" 
                id="phoneNr" 
                value={formik.values.phoneNr}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />

            <button className='mt-5 text-amber-400 border-2 border-amber-400 cursor-pointer' type="submit">Editeaza</button>
        </form>
    )
}

export default Cont