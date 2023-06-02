import { faUser, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
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

    const [showEditForm, setShowEditForm] = useState(false)
    const [showPwForm, setShowPwForm] = useState(false)
    const [showLocatiiVizitate, setShowLocatiiVizitate] = useState(false)
    const [showLocatiiDeVizitat, setShowLocatiiDeVizitat] = useState(false)
    const [showRecenzii, setShowRecenzii] = useState(false)
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

        <Tab 
            toggle={showEditForm} 
            setToggle={setShowEditForm} 
            text='Editeaza profilul' 
            component={<ProfilForm user={user} setShowEditForm={setShowEditForm} setUser={setUser} userData={user} />} 

        />
        
        <Tab 
            toggle={showPwForm}
            setToggle={setShowPwForm}
            text='Schimba parola'
            component={<ChangePwForm setShowPwForm={setShowPwForm}/>}
        />

        <Tab 
            toggle={showLocatiiVizitate}
            setToggle={setShowLocatiiVizitate}
            text='Locatii vizitate'
            
        />

        <Tab 
            toggle={showLocatiiDeVizitat}
            setToggle={setShowLocatiiDeVizitat}
            text='Locatii de vizitat'
            
        />

        <Tab 
            toggle={showRecenzii}
            setToggle={setShowRecenzii}
            text='Recenziile mele'
            
        />

        <button className='text-white w-full my-3 bg-red-700 font-bold'>Sterge cont</button>
       
        
    </section>
  )
}


const Tab = ({toggle, setToggle, text, component}) => {

    return(
        <section className='border-2 border-gray-900 my-2 p-2'>
            <section onClick={() => setToggle(prev => !prev)} className='flex justify-between items-center text-xl cursor-pointer'>
                <p>{text}</p>
                <FontAwesomeIcon icon={toggle ? faCaretDown : faCaretUp}/>
            </section>
            {toggle && component}
        </section>
    )

}

const ProfilForm = ({user, setShowEditForm, setUser, userData}) => {
    
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    
    const api = useAxiosPrivate()
    const {auth} = useAuth()


    const handleSubmit = async (values) => {
        console.log('asd')
        console.log(values)
        try{
            const res = await api.patch(`/users/${auth.username}`, values)
            console.log(res.data)
            if(res.status === 200){
                setUser({...userData, ...values})
            }
            setShowEditForm(false)
        }catch(err){
            console.log(err)
        }
    }

    const formik = useFormik({
        initialValues:{
            lastName: user.lastName || '',
            firstName: user.firstName || '',
            bio: user.bio || '',
            email: user.email || '',
            phoneNr: user.phoneNr || '',
        },

        validationSchema: Yup.object({
            lastName: Yup.string().min(4,'Campul trebuie sa contina minim 4 caracter').matches(/^[aA-zZ\s]+$/, "Campul trebuie sa contina doar litere"),
            firstName: Yup.string().min(4,'Campul trebuie sa contina minim 4 caracter').matches(/^[aA-zZ\s]+$/, "Campul trebuie sa contina doar litere"),
            bio: Yup.string(),
            email: Yup.string().email('Adresa de email este invalida'),
            phoneNr: Yup.string().matches(phoneRegExp, 'Numarul de telefon este invalid'),
        }),

        onSubmit: handleSubmit
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
            <textarea 
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

            <button className='mt-5 text-amber-400 border-2 border-amber-400' type="submit">Editeaza</button>
        </form>
    )
}

const ChangePwForm = ({setShowPwForm}) => {

    const api = useAxiosPrivate()
    const {auth} = useAuth()

    const handleSubmit = async (values) => {
        console.log(values)
        try{
            const res = await api.patch(`/users/edit/password/${auth.username}`, values)
            console.log(res.data)
            setShowPwForm(false)
        }catch(err){
            console.log(err)
        }
    }

    const formik = useFormik({
        initialValues: {
            pw: '',
            confPw: ''
        },
         validationSchema: Yup.object({
            pw: Yup.string().required('Camp Obligatoriu').min(8, 'Parola trebuie sa contina minim 8 caractere'),
            confPw: Yup.string().required('Camp Obligatoriu').oneOf([Yup.ref('pw'), null], 'Parolele trebuie sa coincida'),
         }),

         onSubmit: handleSubmit
    }
    )

    return(
        <form onSubmit={formik.handleSubmit} autoComplete="off">

            <label htmlFor="pw">
                {formik.touched.pw && formik.errors.pw 
                    ? formik.errors.pw
                    : 'Parola: '
                } 
            </label>
            <input 
                type="password" 
                name='pw'
                id='pw'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.pw}
            />

            <label htmlFor="confPw">
                {formik.touched.confPw && formik.errors.confPw 
                    ? formik.errors.confPw
                    : 'Confirmati parola: '
                } 
            </label>
            <input 
                type="password" 
                name='confPw'
                id='confPw'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confPw}
            />

            <button className='mt-5 text-amber-400 border-2 border-amber-400' type="submit">Confirma</button>
        </form>
    )
}

export default Cont