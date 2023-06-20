import { faUser, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from "yup"
import EntityCard from '../components/EntityCard'
import ConfBox from '../components/ConfBox'
import Review from '../components/Review'
import ErrorMsg from '../components/ErrorMsg'
import { useNavigate } from 'react-router-dom'

const Cont = () => {

    const {auth} = useAuth()
    const api = useAxiosPrivate()

    const [showEditForm, setShowEditForm] = useState(false)
    const [showPwForm, setShowPwForm] = useState(false)
    const [showLocatiiVizitate, setShowLocatiiVizitate] = useState(false)
    const [showLocatiiDeVizitat, setShowLocatiiDeVizitat] = useState(false)
    const [showRecenzii, setShowRecenzii] = useState(false)
    const [showLista, setShowLista] = useState('')
    const [user, setUser] = useState({})
    const [showConfBox, setShowConfBox] = useState()
    const [serverResp, setServerResp] = useState({bgColor: 'bg-black', text: 'test', show: false})

    const navigate = useNavigate()

    useEffect(() => {

        const fetchUser = async () => {
            try{
                const res = await api.get(`/users/${auth.username}`)
                setUser(res.data)
            }catch(err){

            }
        }

        fetchUser()
    }, [])

    const handleDeleteVisited = async (id) => {
        try{
            const res = await api.delete(`/visited/${id}`)
            const newVisited = [...user.PlacesVisited2].filter(item => item.PlacesVisited.id !== id)
            setUser({...user, PlacesVisited2: newVisited})
            setShowConfBox('')
            setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
        }catch(err){
            setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
        }
    }

    const handleDeleteReview = async (id) => {
        try{
            const res = await api.delete(`/reviews/${id}`)
            const newReviews = [...user.Reviews].filter(item => item.id !== id)
            setUser({...user, Reviews: newReviews})
            setShowConfBox('')
            setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
        }catch(err){
            setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
        }
    }

    const handleDone = async (entity, list) => {
        try{
            const newPlaces = list.Places.map(e => e.id === entity.id ? {...entity, ListaEntitati:{done: true}} : {...e})
            const newList = {...list, Places: newPlaces}
            const newArrList = [...user.PlacesToVisits].map(l => l.id === newList.id ? {...newList} : {...l})
            const newUser = {...user, PlacesToVisits: newArrList}
            setUser(newUser)

            const res = await api.patch(`/toVisit/${list.id}/${entity.id}`)
        }catch(err){
            
        }
    }

    const handleDeleteList = async (id) =>{
        try{
            const res = await api.delete(`/toVisit/${id}`)
            setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
            setUser({...user, PlacesToVisits: [...user.PlacesToVisits].filter(e => e.id !== id)})
            setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
        }catch(err){
            setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
        }
    }

  return (<>
    
    {serverResp.show && <ErrorMsg bgColor={serverResp.bgColor} text={serverResp.text} setServerResp={setServerResp} />}

    <section className='px-5 sm:mx-auto sm:w-[37rem] md:w-[45rem] lg:w-[61rem] xl:w-[71rem]'>

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

        <section className='md:grid md:grid-cols-2 md:gap-5 md:auto-rows-min'>
            <Tab 
                toggle={showEditForm} 
                setToggle={setShowEditForm} 
                text='Editeaza profilul' 
                component={<ProfilForm user={user} setShowEditForm={setShowEditForm} setUser={setUser} userData={user} setServerResp={setServerResp} />} 

            />
                
            <Tab 
                toggle={showPwForm}
                setToggle={setShowPwForm}
                text='Schimba parola'
                component={<ChangePwForm setShowPwForm={setShowPwForm} setServerResp={setServerResp} />}
            />
        </section>
        
        <Tab 
            toggle={showLocatiiDeVizitat}
            setToggle={setShowLocatiiDeVizitat}
            text='Planurile mele'
            component={
                <section className="sm:mx-auto ">
                    {user?.PlacesToVisits?.length === 0 && <p>Lista goala</p>}
                    <button onClick={() => navigate('/creeazaplan')}>Creeaza plan nou</button>

                    <section>
                        {user?.PlacesToVisits?.map(list => 
                            <section key={list.id} className='border-2 border-gray-900 my-2 p-2 md:h-fit'>
                                <section onClick={() => setShowLista(list.id === showLista ? '' : list.id)} className='flex justify-between items-center text-xl cursor-pointer md:p-2'>
                                    <p>Planul - {list?.data}</p>
                                    <FontAwesomeIcon icon={showLista ? faCaretDown : faCaretUp}/>
                                </section>
                                <button type="button" onClick={() => setShowConfBox(list.id)} className="disabled:line-through sm:px-5 sm:w-auto  bg-red-500 text-left pl-5 w-full border-2 font-bold">Sterge lista</button>
                                {list.id === showConfBox && <ConfBox handleNo={() => setShowConfBox('')} handleYes={() => handleDeleteList(list.id)} >Confirmati stergerea?</ConfBox>}
                            {list.id === showLista && 
                                <section className='md:grid md:grid-cols-2 md:gap-5 lg:grid-cols-3'>
                                    {list?.Places?.sort((a, b) => a.ListaEntitati.sort - b.ListaEntitati.sort).map(entity => 
                                        <EntityCard key={entity.id} entity={entity} className={entity.ListaEntitati.done && 'opacity-40 '} >
                                            <section className="mt-5">
                                                <button disabled={entity.ListaEntitati.done} type="button" onClick={() => setShowConfBox(entity.id)} className="disabled:line-through sm:px-5 sm:w-auto  bg-red-500 text-left pl-5 w-full border-2 font-bold">Marcheaza ca finalizat</button>
                                                {entity.id === showConfBox && <ConfBox handleNo={() => setShowConfBox('')} handleYes={() => handleDone(entity, list)} >Confirmati stergerea?</ConfBox>}
                                            </section>
                                        </EntityCard>
                                    )}
                                </section>
                                
                            }
                        </section>
                        )}
                    </section>
                    
                </section>
            }
        />

        <Tab 
            toggle={showLocatiiVizitate}
            setToggle={setShowLocatiiVizitate}
            text='Locatii vizitate'
            component={
                <section className="sm:mx-auto  md:grid md:grid-cols-2 md:auto-rows-fr md:gap-5 lg:grid-cols-3" >
                    {user?.PlacesVisited2?.length === 0 && <p>Lista goala</p>}
                    {user?.PlacesVisited2?.map(entity => 
                    <EntityCard key={entity.id} entity={entity} >
                        <section className="mt-5">
                            <button type="button" onClick={() => setShowConfBox(entity.id)} className="sm:px-5 sm:w-auto  bg-red-500 text-left pl-5 w-full border-2 font-bold">Sterge din lista</button>
                            {entity.id === showConfBox && <ConfBox handleNo={() => setShowConfBox('')} handleYes={() => handleDeleteVisited(entity.PlacesVisited.id)} >Confirmati stergerea?</ConfBox>}
                        </section>
                    </EntityCard>)}
                </section>
            }
        />

        

        <Tab 
            toggle={showRecenzii}
            setToggle={setShowRecenzii}
            text='Recenziile mele'
            component={
                <section className="text-gray-900 flex flex-col justify-start gap-5 ">
                    {user?.Reviews?.map(review =>
                    <Review key={review.id} review={review}>
                        <section className="mt-5">
                            <button type="button" onClick={() => setShowConfBox(review.id)} className="w-full text-gray-900 border-gray-900 border-2 font-bold">Sterge recenzia</button>
                            {review.id === showConfBox  && <ConfBox handleNo={() => setShowConfBox('')} handleYes={() => handleDeleteReview(review.id)} >Confirmati stergerea?</ConfBox>}
                        </section>
                    </Review>)}
                </section>
            }

        />
       
    </section>
    </>)
}


const Tab = ({toggle, setToggle, text, component}) => {

    return(
        <section className='border-2 border-gray-900 my-2 p-2 md:h-fit'>
            <section onClick={() => setToggle(prev => !prev)} className='flex justify-between items-center text-xl cursor-pointer md:p-2'>
                <p>{text}</p>
                <FontAwesomeIcon icon={toggle ? faCaretDown : faCaretUp}/>
            </section>
            {toggle && component}
        </section>
    )

}

const ProfilForm = ({user, setShowEditForm, setUser, userData, setServerResp}) => {

    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    
    const api = useAxiosPrivate()
    const {auth} = useAuth()


    const handleSubmit = async (values) => {
        try{
            const res = await api.patch(`/users/${auth.username}`, values)
            if(res.status === 200){
                setUser({...userData, ...values})
            }
            setShowEditForm(false)
            setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
        }catch(err){
            setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
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
        <form onSubmit={formik.handleSubmit} autoComplete="off" className='w-auto mt-2'>
            
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
                className=''
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

const ChangePwForm = ({setShowPwForm, setServerResp}) => {

    const api = useAxiosPrivate()
    const {auth} = useAuth()

    const handleSubmit = async (values) => {
        try{
            const res = await api.patch(`/users/edit/password/${auth.username}`, values)
            setShowPwForm(false)
            setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
        }catch(err){
            setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
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
        <form onSubmit={formik.handleSubmit} autoComplete="off" className='w-auto'>

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