import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { Rating } from 'react-simple-star-rating'
import useAuth from '../../../hooks/useAuth'
import jwt_decode from "jwt-decode"
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const ReviewForm = ({entityName, fetchEntity}) => {

    const [imgsUrl, setImgsUrl] = useState([])
    const [toggleForm, setToggleForm] = useState(false)
    const { auth } = useAuth()
    const api = useAxiosPrivate()

    const handleToggleForm = () => {
        setToggleForm(prev => !prev)
    }

    const handleSubmit = async (values) => {
        console.log(values)
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
        
        const res = await api.post(
            '/reviews',
            formData,
            {headers: {'Content-Type': 'multipart/form-data'}})

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
            description: Yup.string(),
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

  return (<>{
    !toggleForm
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

export default ReviewForm