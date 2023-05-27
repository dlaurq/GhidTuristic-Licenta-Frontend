import { useFormik } from "formik"
import { useEffect, useState } from "react"
import useAxiosPrivate from "../../../hooks/useAxiosPrivate"
import useAuth from "../../../hooks/useAuth"
import * as Yup from "yup"
import jwt_decode from "jwt-decode"
import useStaticApi from "../../../hooks/useStaticApi"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX } from "@fortawesome/free-solid-svg-icons"

const NewEntityForm = ({entity, submitTxt, children, update, hideForm, setToggleForm, setFormSubmited, setEntities}) => {

    const [geo, setGeo] = useState({})
    const [categories, setCategories] = useState([])
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

        const fetchCategories = async () => {
            const res = await api.get('/categories')
            setCategories(res.data)
            //console.log(res.data)
        }

        fetchGeo()
        fetchCategories()
        
        //console.log(entity)
    }, [])

 

    const handleSubmit = async (values) => {

        //console.log(values)

        const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined

        const username = decoded.UserInfo.username

        //console.log(values)
        //console.log(typeof decoded.UserInfo.username)

        const formData = new FormData();
        
        for (let value in values) {
            if(values !== 'imgs')
                formData.append(value, values[value]);
        }
        formData.append('username', username)
        const imgs = [...values.imgs]
        imgs.forEach(img => formData.append('imgs', img))
        

        for (var pair of formData.entries()) {
            //console.log(pair[0]+ ', ' + pair[1]); 
        }
        if(update){
            //console.log(extImgs)
            //console.log(values.imgs)
            formData.append('extImgs', JSON.stringify(extImgs))
            const res = await api.patch(
                `/places/${entity.id}`,
                formData,
                {headers: {'Content-Type': 'multipart/form-data'}})
            //console.log(res.data)
            hideForm()
            

        }else{
            const res = await api.post(
                '/places',
                formData,
                {headers: {'Content-Type': 'multipart/form-data'}})
            //console.log(res.data)
        }

        if(setToggleForm)
            setToggleForm(prev => !prev)

        setFormSubmited(prev => !prev)
        setEntities([])
    }

    const formik = useFormik({
        initialValues:{
            name: entity?.name || '',
            description: entity?.description || '',
            category: entity?.Category?.id || '',
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
            category: Yup.string().required("Camp obligatoriul"),
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
    <form onSubmit={formik.handleSubmit} encType="multipart/form-data" className="gap-3">
        <section>
            <label htmlFor="name">
                {formik.touched.name && formik.errors.name 
                    ? formik.errors.name
                    : 'Nume'
            }</label>
            <input 
                id="name" 
                name="name" 
                type="text" 
                placeholder="Numele entitatii" 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                value={formik.values.name}/>
        </section>

        <section>
            <label htmlFor="description">
                {formik.touched.description && formik.errors.description 
                    ? formik.errors.description
                    : 'Descriere'
            }</label>
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
            <label htmlFor="category">
                {formik.touched.category && formik.errors.category 
                    ? formik.errors.category
                    : 'Categorie'
            }</label>
            <select 
                className="w-3/4"
                name="category" 
                id="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            >
                    <option value="">Selectati o categorie</option>
                    {categories.map( category => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
        </section>

        <section className="w-full flex flex-row justify-between">
            <label htmlFor="country">
                {formik.touched.country && formik.errors.country 
                    ? formik.errors.country
                    : 'Tara'
            }</label>
            <select 
                className="w-3/4"
                name="country" 
                id="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            >
                    <option value="">Selectati o tara</option>
                    {geo?.countries?.map( country => <option key={country.id} value={country.id}>{country.name}</option>)}
            </select>
        </section>

        <section className="w-full flex flex-row justify-between">
            <label htmlFor="county">
                {formik.touched.county && formik.errors.county 
                    ? formik.errors.county
                    : 'Judet'
            }</label>
            <select 
                className="w-3/4"
                name="county" 
                id="county"
                value={formik.values.county}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            >
                <option value="">Selectati un judet</option>
                {geo?.counties?.filter( county => county.CountryId === formik.values.country).map( county => <option key={county.id} value={county.id}>{county.name}</option>)}
            </select>
        </section>

        <section className="w-full flex flex-row justify-between">
            <label htmlFor="city">
                {formik.touched.city && formik.errors.city 
                    ? formik.errors.city
                    : 'Oras'
            }</label>
            <select 
                className="w-3/4"
                name="city" 
                id="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            >
                <option value="">Selectati un oras</option>
                {geo?.cities?.filter( city => city.CountyId === formik.values.county).map( city => <option key={city.id} value={city.id}>{city.name}</option>)}
            </select>
        </section>

        <section>
            <label htmlFor="address">
                {formik.touched.address && formik.errors.address 
                    ? formik.errors.address
                    : 'Adresa'
            }</label>
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
        </section>
        
        <button type="submit"> { submitTxt || "Inregistreaza"}</button>

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
    </form>
  )
}

export default NewEntityForm