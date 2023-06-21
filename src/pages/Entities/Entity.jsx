import { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import Review from '../../components/Review'
import useAuth from '../../hooks/useAuth'
import ConfBox from '../../components/ConfBox'
import Map from '../../components/Map'
import { Marker } from 'react-leaflet'
import Gpx from '../../components/Gpx'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Rating } from 'react-simple-star-rating'
import jwt_decode from "jwt-decode"
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ErrorMsg from '../../components/ErrorMsg'

const Entity = () => {

    const {name} = useParams()
    const api = useAxiosPrivate()
    const [entity, setEntity] = useState({PlacesToVisits: [], PlacesVisiteds: []})
    const {auth} = useAuth()
    const [showConfBox, setShowConfBox] = useState(false)
    const [serverResp, setServerResp] = useState({bgColor: 'bg-black', text: 'test', show: false})


    const fetchEntity = async () => {
        const res = await api.get(`/places/${name}`)
        setEntity(res.data)
        //DE CALCULAT RATING SI NR RECENZII
    }

    useEffect(() => {
        fetchEntity()
    }, [])

    const handleDeleteReview = async (id) => {
        try {
            const res = await api.delete(`/reviews/${id}`)
            fetchEntity()
            setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
        }catch(err){
            setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
        } 
    }

    const calcRating = (reviews) => {
        let sum = 0
        reviews?.forEach(review => sum += parseFloat(review?.rating));
        return sum / reviews?.length
    }

  return (
    <section className='sm:mx-auto sm:w-[37rem] md:w-[45rem] lg:w-[61rem] xl:w-[71rem]'>
        {serverResp.show && <ErrorMsg bgColor={serverResp.bgColor} text={serverResp.text} setServerResp={setServerResp} />}

        <section className=' p-5'>
            <h2 className='text-3xl font-bold pt-5'>{entity.name}</h2>

            <p className="text-xl"> {entity?.Category?.name} &#x2022; Rating {calcRating(entity?.Reviews) || 0} &#x2022; Recenzii {entity?.Reviews?.length} </p>

            <section className='flex flex-row overflow-auto my-5 gap-5'>
                {entity?.Images?.map((img, index) => <img key={index} src={`http://localhost:5000/uploads/${img?.imgUrl}`} className='md:max-h-80 max-h-64 object-contain' />)}
            </section>

            {entity?.Gpx && <Map center={[entity.lat, entity.lng]} children={
            <>
                <Marker position={[entity.lat, entity.lng]}></Marker>
                <Gpx src={`${import.meta.env.VITE_BASE_BACKEND_URL}/gpxs/${entity.Gpx.id}`} options={{async: true}} />
            </>
            }/>}
            <p className='text-xl py-3'>{entity.description}</p>    
        </section>
        
        <section className='p-5 '>
            {!auth?.accessToken 
            ?<p className='text-gray-300 text-2xl p-5'><NavLink to='/login' className='font-bold text-amber-500 hover:cursor-pointer'>Autentifica-te</NavLink> pentru a putea lasa recenzii</p>
            :entity?.Reviews?.find(review => review?.User?.username === auth?.username)
            ?entity?.Reviews?.map((review, index) => review?.User?.username === auth?.username && 
                <Review key={index} review={review}>
                    <section className="mt-5">
                        <button type="button" onClick={() => setShowConfBox(prev => !prev)} className="w-full text-gray-900 border-gray-900 border-2 font-bold">Sterge recenzia</button>
                        {showConfBox  && <ConfBox handleNo={() => setShowConfBox(prev => !prev)} handleYes={() => handleDeleteReview(review.id)} >Confirmati stergerea?</ConfBox>}
                    </section>
                </Review>)
            :<ReviewForm fetchEntity={fetchEntity} entityName={name}/>}
            
            {entity?.Reviews?.map((review, index) => review?.User?.username !== auth?.username && <Review key={index} review={review}/>)}
        </section>
    </section>
  )
}

const ReviewForm = ({entityName, fetchEntity}) => {

    const [imgsUrl, setImgsUrl] = useState([])
    const [toggleForm, setToggleForm] = useState(false)
    const { auth } = useAuth()
    const api = useAxiosPrivate()
    const [serverResp, setServerResp] = useState({bgColor: 'bg-black', text: 'test', show: false})

    const handleToggleForm = () => {
        setToggleForm(prev => !prev)
    }

    const handleSubmit = async (values) => {
        const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined
        
        const username = decoded.UserInfo.username

        const formData = new FormData();

        formData.append("entityName", entityName)
        
        for (let value in values) {
            if(values !== 'imgs')
                formData.append(value, values[value]);
        }
        formData.append('username', username)
        const imgs = [...values.imgs]
        imgs.forEach(img => formData.append('imgs', img))

        try{
            const res = await api.post('/reviews',formData,{headers: {'Content-Type': 'multipart/form-data'}})
            setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
        }catch(err){
            setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
        }

        setToggleForm(prev => !prev)
        fetchEntity()
    }

    const formik = useFormik({
        initialValues:{
            title: '',
            description: '',
            rating: 0,
            imgs: [],
            postDate: new Date().toLocaleString('ro-RO')
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Camp obligatoriul"),
            description: Yup.string().max(500, 'Descrierea poate sa contina maxim 500 de caractere'),
            rating: Yup.number().min(1, "Camp obligatoriul").required("Camp obligatoriul"),
            imgs: Yup.mixed().test('file-length', "Puteti adauga maxim 3 poze", (value) => value.length < 4),
            
        }),
        onSubmit: handleSubmit
    })

    useEffect(() => {
        const imgs = [...formik.values.imgs]
        if(imgs.length < 1) 
            setImgsUrl([])
        else{
            const newImgsUrl = []
            imgs.forEach(img => newImgsUrl.push(URL.createObjectURL(img)))
            setImgsUrl(newImgsUrl)
        }
    }, [formik.values.imgs])

  return (<>
    {serverResp.show && <ErrorMsg bgColor={serverResp.bgColor} text={serverResp.text} setServerResp={setServerResp} />}
  
    {!toggleForm
        ?<p onClick={handleToggleForm} className='text-3xl p-5 bg-gray-900 text-gray-300 font-bold'>Lasa o recenzie <FontAwesomeIcon icon={faCaretUp}/></p>
        :<form onSubmit={formik.handleSubmit} className='bg-gray-900 border-none' encType="multipart/form-data" >
            <p onClick={handleToggleForm} className='text-3xl mb-3'>Lasa o recenzie <FontAwesomeIcon icon={faCaretDown}/></p>
            <section>
                <label htmlFor='title'>{
                    formik.touched.title && formik.errors.title 
                        ? formik.errors.title
                        : 'Titlu'
                }</label>
                <input 
                    id="title" 
                    name="title" 
                    type="text" 
                    placeholder="Titlu" 
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur} 
                    value={formik.values.title}
                />
            </section>

            <section>
                <label htmlFor='description'>{
                    formik.touched.description && formik.errors.description 
                        ? formik.errors.description
                        : 'Descriere'
                }</label>
                <textarea 
                    className='text-neutral-700 w-full'
                    id="description" 
                    name="description" 
                    spellCheck='false'
                    placeholder="Descriere" 
                    onChange={formik.handleChange} 
                    onBlur={formik.handleBlur} 
                    value={formik.values.description}
                />

                <section>
                    <label htmlFor='rating'>{
                        formik.touched.rating && formik.errors.rating 
                            ? formik.errors.rating
                            : 'Rating'
                    }</label>
                    <Rating 
                        SVGstyle={{display: 'inline-block'}}
                        onClick={(rate) => formik.setFieldValue('rating', rate)}
                    />
                </section>
                

                <section className=''>
                    <label htmlFor="imgs">
                        {formik.touched.imgs && formik.errors.imgs 
                            ? formik.errors.imgs
                            : 'Poze'
                    }</label>
                    <input 
                        className=" text-gray-200"
                        id="imgs" 
                        name="imgs" 
                        type="file" 
                        multiple
                        accept="image/*"
                        onChange={(e) => formik.setFieldValue('imgs', e.currentTarget.files)} 
                    />
                    <section className='flex flex-row flex-wrap justify-center items-center gap-4 py-2'>
                        {imgsUrl.map(img => 
                            <img 
                                className="py-2 w-1/4 h-auto self-center"
                                key={img} 
                                src={img} 
                                alt={img} 
                            />
                        )}
                    </section>
                    
                </section>
            </section>

            <button type='submit'>Adauga recenzie</button>
        </form>
    }</>)
}

export default Entity