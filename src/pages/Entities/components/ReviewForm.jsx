import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import Form from '../../../components/Form'
import * as Yup from 'yup'
import Button from '../../../components/Button'
import Label from '../../../components/Label'
import Input from '../../../components/Input'
import { Rating } from 'react-simple-star-rating'
import useAuth from '../../../hooks/useAuth'
import jwt_decode from "jwt-decode"
import useAxiosPrivate from '../../../hooks/useAxiosPrivate'

const ReviewForm = ({entityName}) => {

    const [imgsUrl, setImgsUrl] = useState([])
    const { auth } = useAuth()
    const api = useAxiosPrivate()

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
        
        const res = await api.post(
            '/reviews',
            formData,
            {headers: {'Content-Type': 'multipart/form-data'}})

        console.log(res.data)
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
            imgs: Yup.mixed().required("Camp obligatoriul"),
            
        }),
        onSubmit: handleSubmit
    })

    useEffect(() => {
        const imgs = [...formik.values.imgs]
        if(imgs.length < 1) return
        const newImgsUrl = []
        imgs.forEach(img => newImgsUrl.push(URL.createObjectURL(img)))
        setImgsUrl(newImgsUrl)
    }, [formik.values.imgs])

  return (
    <Form handleSubmit={formik.handleSubmit} className='bg-gray-900' encType="multipart/form-data" >

        <section>
            <Label htmlFor='title'>{
                formik.touched.title && formik.errors.title 
                    ? formik.errors.title
                    : 'Titlu'
            }</Label>
            <Input 
                id="title" 
                name="title" 
                type="text" 
                placeholder="Titlu" 
                handleChange={formik.handleChange} 
                handleBlur={formik.handleBlur} 
                value={formik.values.title}
            />
        </section>

        <section>
            <Label htmlFor='description'>{
                formik.touched.description && formik.errors.description 
                    ? formik.errors.description
                    : 'Descriere'
            }</Label>
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
                <Label htmlFor='rating'>{
                    formik.touched.rating && formik.errors.rating 
                        ? formik.errors.rating
                        : 'Rating'
                }</Label>
                <Rating 
                    SVGstyle={{display: 'inline-block'}}
                    onClick={(rate) => formik.setFieldValue('rating', rate)}
                />
            </section>
            

            <section>
                <Label htmlFor="imgs">
                    {formik.touched.imgs && formik.errors.imgs 
                        ? formik.errors.imgs
                        : 'Poze'
                }</Label>
                <Input 
                    className=" text-gray-200"
                    id="imgs" 
                    name="imgs" 
                    type="file" 
                    multiple
                    accept="image/*"
                    handleChange={(e) => formik.setFieldValue('imgs', e.currentTarget.files)} 
                />
                <section className='flex flex-row flex-wrap justify-center items-center gap-4'>
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

        <Button type='submit'>Adauga recenzie</Button>
    </Form>
  )
}

export default ReviewForm