import { useFormik } from "formik"
import { useEffect, useState } from "react"
import Form from "../../../components/Form"
import Input from "../../../components/Input"
import Label from "../../../components/Label"
import Select from "../../../components/Select"
import Option from "../../../components/Option"
import useAxiosPrivate from "../../../hooks/useAxiosPrivate"
import Button from "../../../components/Button"
import useAuth from "../../../hooks/useAuth"
import * as Yup from "yup"
import jwt_decode from "jwt-decode"
import useStaticApi from "../../../hooks/useStaticApi"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX } from "@fortawesome/free-solid-svg-icons"

const NewEntityForm = ({entity, submitTxt, children, update, hideForm}) => {

    const [geo, setGeo] = useState({})
    const [imgsUrl, setImgsUrl] = useState([])
    const [extImgs, setExtImgs] = useState(entity?.Images ? entity?.Images : [])
    const api = useAxiosPrivate()
    const staticApi = useStaticApi()
    const {auth} = useAuth()
    

    useEffect(() => {
        //console.log(entity)  
        const fetchGeo = async () => {
            const res = await api.get('/geo')
            setGeo(res.data)
        }

        fetchGeo()
        console.log(extImgs)
    }, [])

 

    const handleSubmit = async (values) => {

        console.log(values)

        const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined

        const username = decoded.UserInfo.username

        console.log(values)
        console.log(typeof decoded.UserInfo.username)

        const formData = new FormData();
        
        for (let value in values) {
            if(values !== 'imgs')
                formData.append(value, values[value]);
        }
        formData.append('username', username)
        const imgs = [...values.imgs]
        imgs.forEach(img => formData.append('imgs', img))
        

        for (var pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }
        if(update){
            console.log(extImgs)
            console.log(values.imgs)
            formData.append('extImgs', JSON.stringify(extImgs))
            const res = await api.patch(
                `/places/${entity.id}`,
                formData,
                {headers: {'Content-Type': 'multipart/form-data'}})
            console.log(res.data)
            hideForm()
            

        }else{
            const res = await api.post(
                '/places',
                formData,
                {headers: {'Content-Type': 'multipart/form-data'}})
            console.log(res.data)
        }

        
        
    }

    const formik = useFormik({
        initialValues:{
            name: entity?.name || '',
            description: entity?.description || '',
            country: entity?.Location?.City?.County?.Country?.id || '',
            county: entity?.Location?.City?.County?.id || '',
            city: entity?.Location?.City?.id || '',
            imgs: [],
            address: entity?.Location?.address || '',
        },

        validationSchema: Yup.object({
            name: Yup.string()
              .max(30,"Numele tarii poate sa contina maxim 30")
              .required("Camp obligatoriul"),
            description: Yup.string()
                .max(300,"Descrierea nu poate sa fie mai lunga de 300 de caractere.")
              .required("Camp obligatoriul"),
            country: Yup.string().required("Camp obligatoriul"),
            county: Yup.string().required("Camp obligatoriul"),
            city: Yup.string().required("Camp obligatoriul"),
            imgs: Yup.mixed().required("Camp obligatoriul"),
            address: Yup.string().required("Camp obligatoriul"),
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
    <Form handleSubmit={formik.handleSubmit} encType="multipart/form-data" className="gap-3">
        <section>
            <Label htmlFor="name">
                {formik.touched.name && formik.errors.name 
                    ? formik.errors.name
                    : 'Nume'
            }</Label>
            <Input 
                id="name" 
                name="name" 
                type="text" 
                placeholder="Numele entitatii" 
                handleChange={formik.handleChange} 
                handleBlur={formik.handleBlur} 
                value={formik.values.name}/>
        </section>

        <section>
            <Label htmlFor="description">
                {formik.touched.description && formik.errors.description 
                    ? formik.errors.description
                    : 'Descriere'
            }</Label>
            <textarea 
                className="resize-none text-gray-900 w-full"
                spellCheck='false'
                id="description" 
                name="description" 
                placeholder="Descriere" 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                value={formik.values.description}
            />
        </section>

        <section className="w-full flex flex-row justify-between">
            <Label htmlFor="country">
                {formik.touched.country && formik.errors.country 
                    ? formik.errors.country
                    : 'Tara'
            }</Label>
            <Select 
                className="w-3/4"
                name="country" 
                id="country"
                value={formik.values.country}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
            >
                    <Option value="">Selectati o tara</Option>
                    {geo?.countries?.map( country => <Option key={country.id} value={country.id}>{country.name}</Option>)}
            </Select>
        </section>

        <section className="w-full flex flex-row justify-between">
            <Label htmlFor="county">
                {formik.touched.county && formik.errors.county 
                    ? formik.errors.county
                    : 'Judet'
            }</Label>
            <Select 
                className="w-3/4"
                name="county" 
                id="county"
                value={formik.values.county}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
            >
                <Option value="">Selectati un judet</Option>
                {geo?.counties?.filter( county => county.CountryId === formik.values.country).map( county => <Option key={county.id} value={county.id}>{county.name}</Option>)}
            </Select>
        </section>

        <section className="w-full flex flex-row justify-between">
            <Label htmlFor="city">
                {formik.touched.city && formik.errors.city 
                    ? formik.errors.city
                    : 'Oras'
            }</Label>
            <Select 
                className="w-3/4"
                name="city" 
                id="city"
                value={formik.values.city}
                handleChange={formik.handleChange}
                handleBlur={formik.handleBlur}
            >
                <Option value="">Selectati un oras</Option>
                {geo?.cities?.filter( city => city.CountyId === formik.values.county).map( city => <Option key={city.id} value={city.id}>{city.name}</Option>)}
            </Select>
        </section>

        <section>
            <Label htmlFor="address">
                {formik.touched.address && formik.errors.address 
                    ? formik.errors.address
                    : 'Adresa'
            }</Label>
            <textarea 
                className="resize-none text-gray-900 w-full"
                spellCheck='false'
                id="address" 
                name="address" 
                placeholder="Adresa" 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                value={formik.values.address} 
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
        </section>
        
        <Button type="submit"> { submitTxt || "Inregistreaza"}</Button>

        <section>
            <p>Poze incarcate</p>
            {imgsUrl.map(
                img => 
                    <img 
                        className="py-2"
                        key={img} 
                        src={img} 
                        alt={img} 
                    />
                )
            }
        </section>
        <section>
            <p>Poze existente</p>
            {extImgs.map(
                img => 
                    <section className='relative my-2' key={img.imgUrl} >
                        <FontAwesomeIcon 
                            icon={faX} 
                            onClick={() => setExtImgs(prev => prev?.filter(filterImg => filterImg.imgUrl !== img.imgUrl))}
                            className='absolute top-2 right-2 text-4xl text-gray-300 cursor-pointer'/>
                        
                        <img 
                            className=""
                            
                            src={`${staticApi}${img.imgUrl}`} 
                            alt={img.imgUrl} 
                        />
                    
                    </section>
                )
            }
        </section>
        {children}
    </Form>
  )
}

export default NewEntityForm