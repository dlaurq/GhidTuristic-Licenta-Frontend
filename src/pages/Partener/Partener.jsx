import { useEffect, useState } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import jwt_decode from "jwt-decode"
import useAuth from '../../hooks/useAuth'
import EntityCard from '../../components/EntityCard'
import ConfBox from '../../components/ConfBox'
import ErrorMsg from '../../components/ErrorMsg'
import DropDownForm from '../../components/DropDownForm'
import Filtru from '../../components/Filtru'
import SearchBar from '../../components/SearchBar'
import { useRef } from 'react'
import { useFormik } from "formik"
import * as Yup from "yup"
import useStaticApi from '../../hooks/useStaticApi'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faX } from "@fortawesome/free-solid-svg-icons"

const Partener = () => {

  const [toggleForm, setToggleForm] = useState(false)
  const [entities, setEntities] = useState([])
  const [showConfBox, setShowConfBox] = useState(false)
  const [showEditBox, setShowEditBox] = useState(false)
  const [formSubmited, setFormSubmited] = useState(false)
  const [filter, setFilter] = useState('')
  const [serverResp, setServerResp] = useState({bgColor: 'bg-black', text: 'test', show: false})
  const [filterEntities, setFilterEntities] = useState(entities)
  const [categories, setCategories] = useState([])

  const closeFormRef = useRef(null)

  const { auth } = useAuth()

  const api = useAxiosPrivate()

  useEffect(() => {

    const fetchEntities = async () => {
      const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined

      const username = decoded.UserInfo.username

      try{
        const res = await api.get(`/places/user/${username}`)
        setEntities(res.data)
        setFilterEntities(res.data)
      }catch(err){

      }
    }

    const fetchCategories = async () => {
      try{
        const res = await api.get('/categories')
        setCategories(res.data)
      } catch(err){
        
      }
    }

    fetchCategories()
    fetchEntities()
  }, [formSubmited])

  const handleCloseForm = () => {
    if(closeFormRef.current){
      closeFormRef.current.handleForm()
    }
  }

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/places/${id}`)
      const newEntities = entities.filter(review => review.id !== id)
      setEntities(newEntities)
      setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
    }catch(err){
      setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response?.data?.message}`, show: true})
    }
    
  }

  return (
    <section>

      {serverResp.show && <ErrorMsg bgColor={serverResp.bgColor} text={serverResp.text} setServerResp={setServerResp} />}

      <hr />
      <DropDownForm 
        ref={closeFormRef}
        text='Adauga o entitate' 
        form={<NewEntityForm setFormSubmited={setFormSubmited} setEntities={setEntities} setToggleForm={setToggleForm} setServerResp={setServerResp} handleCloseForm={handleCloseForm}/>}
      />

      <hr />

      <Filtru 
        text='Filtreaza dupa tara:'
        handleChange={(e) => setFilter(e.target.value)}
        list={categories}
        placeholder='--Alege un tara--'
        value={filter}
      />

      <hr />

      <SearchBar list={entities} setFilterList={setFilterEntities} compare='name' />

      <div className="p-2"></div>

      <hr />
      
      <section className="sm:mx-auto sm:w-[37rem] md:w-[45rem] lg:w-[61rem] xl:w-[71rem] md:grid md:grid-cols-2 md:gap-5 md:auto-rows-min lg:grid-cols-3 ">
        {filterEntities.length === 0  && <h3 className=''>Nu aveti nici o entitate inregistrata</h3>}

        {filterEntities.map(entity => entity.id !== showEditBox 
          ? <EntityCard key={entity.id} entity={entity} className={` ${filter && entity.Category.id !== filter && "!hidden"}`}>
              <section className='flex flex-col justify-between gap-4 mt-5 md:pr-5'>
                <button className='text-gray-900 border-gray-900 font-bold border-4' type='button' onClick={() => setShowEditBox(entity.id)}>Editeaza</button>
                <button className='text-red-500 font-bold border-4 border-red-500' type='button' onClick={() => setShowConfBox(entity)}>Sterge</button>
                {showConfBox?.id === entity.id && <ConfBox handleNo={() => setShowConfBox({})} handleYes={() => handleDelete(entity.id)} >Confirmati stergerea?</ConfBox>}
              </section>
          </EntityCard>
          :<NewEntityForm 
            setFormSubmited={setFormSubmited} 
            setEntities={setEntities} 
            key={entity.id} 
            entity={entity} 
            submitTxt="Salveaza" 
            update={true} 
            hideForm={() => setShowEditBox(false)}
            setServerResp={setServerResp}
            className='md:mt-5 col-span-3 '
            >
            <section>
              <button type='button' className="w-full md:w-80" onClick={() => setShowEditBox(false)}>
                Cancel
              </button>
            </section>
          </NewEntityForm>
          
        )}
      </section>

    </section>
  )
}


const NewEntityForm = ({entity, submitTxt, children, update, hideForm, setToggleForm, setFormSubmited, setEntities, className, setServerResp, handleCloseForm}) => {

  const [geo, setGeo] = useState({})
  const [categories, setCategories] = useState([])
  const [imgsUrl, setImgsUrl] = useState([])
  const [extImgs, setExtImgs] = useState(entity?.Images ? entity?.Images : [])
  const api = useAxiosPrivate()
  const staticApi = useStaticApi()
  const {auth} = useAuth()
  
  useEffect(() => {
      const fetchGeo = async () => {
          try{
              const res = await api.get('/geo')
              setGeo(res.data)
          }catch(err){

          }
      }

      const fetchCategories = async () => {
          try{
              const res = await api.get('/categories')
              setCategories(res.data)
          }catch(err){
              
          }
      }

      fetchGeo()
      fetchCategories()
      
  }, [])

  const handleSubmit = async (values) => {

      const decoded = auth?.accessToken ? jwt_decode(auth.accessToken) : undefined

      const username = decoded.UserInfo.username

      const formData = new FormData();
      
      /**INTRODUCERE DATE*/
      for (let value in values) {
          if(values !== 'imgs')
              formData.append(value, values[value]);
      }
      formData.append('username', username)
      const imgs = [...values.imgs]
      imgs.forEach(img => formData.append('imgs', img))
      
      /**
      for (let pair of formData.entries()) { 
          console.log(pair[0]+ ', ' + pair[1]); 
      }
       */

      if(update){
          formData.append('extImgs', JSON.stringify(extImgs))
          try{
              const res = await api.patch(`/places/${entity.id}`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
              setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
              hideForm()
          }catch(err){
              setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response?.data?.message}`, show: true})
          }
      }else{
          try{
              const res = await api.post('/places', formData, {headers: {'Content-Type': 'multipart/form-data'}})
              setServerResp({bgColor: 'bg-green-500', text: res.data.message, show: true})
          }catch(err){
              setServerResp({bgColor: 'bg-red-500', text: `Error: ${err.response.data.message}`, show: true})
          }
          handleCloseForm()
      }

      if(setToggleForm) setToggleForm(prev => !prev)

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
          gpxs: [],
          address: entity?.Location?.address || '',
          lat: entity?.lat || '',
          lng: entity?.lng || '',
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
          imgs: Yup.mixed().test('file-length', "Trebuie sa adaugati minim o poza", (value) => update ? value.length >= 0 : value.length >0 ),
          gpxs: Yup.mixed(),
          address: Yup.string().required("Camp obligatoriul"),
          lat: Yup.number().typeError('Latitudinea trebuie sa fie un numar'),
          lng: Yup.number().typeError('Longitudinea trebuie sa fie un numar'),
        }),

      onSubmit: (values) => {
          handleSubmit(values)
          formik.setFieldValue('imgs', [])
          setImgsUrl([])
          formik.resetForm()
        },
  })
  
  useEffect(() => {
      const imgs = [...formik.values.imgs]
      if(imgs.length < 1) return
      const newImgsUrl = []
      imgs.forEach(img => newImgsUrl.push(URL.createObjectURL(img)))
      setImgsUrl(newImgsUrl)
  }, [formik.values.imgs])

return (
  <form onSubmit={formik.handleSubmit} encType="multipart/form-data" className={` ${className}`}>

      <section className="md:grid gap-3md:grid md:grid-cols-2 md:justify-items-center gap-3">

          {/**NUME DESC CATEGORIE LAT LNG*/}
          <section className="md:flex md:flex-col md:justify-between">
              <section className="flex flex-col justify-start items-start">
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
                      value={formik.values.name}
                      className="md:w-80"
                      />
              </section>

              <section className="flex flex-col justify-start items-start">
                  <label htmlFor="description">
                      {formik.touched.description && formik.errors.description 
                          ? formik.errors.description
                          : 'Descriere'
                  }</label>
                  <textarea 
                      className="resize-none text-gray-900 md:w-80"
                      spellCheck='false'
                      id="description" 
                      name="description" 
                      placeholder="Descriere" 
                      onChange={formik.handleChange} 
                      onBlur={formik.handleBlur} 
                      value={formik.values.description}
                  />
              </section>

              <section className="flex flex-col justify-start items-start">
                  <label htmlFor="category">
                      {formik.touched.category && formik.errors.category 
                          ? formik.errors.category
                          : 'Categorie'
                  }</label>
                  <select 
                      className="sm:w-full md:w-80"
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


              <section className="flex flex-col justify-start items-start">
                  <label htmlFor="lat">
                      {formik.touched.lat && formik.errors.lat 
                          ? formik.errors.lat
                          : 'Latitudinea'
                  }</label>
                  <input 
                      id="lat" 
                      name="lat" 
                      type="text" 
                      placeholder="Latitudinea" 
                      onChange={formik.handleChange} 
                      onBlur={formik.handleBlur} 
                      value={formik.values.lat}
                      className="md:w-80"
                      />
              </section>

              <section className="flex flex-col justify-start items-start">
                  <label htmlFor="lng">
                      {formik.touched.lng && formik.errors.lng 
                          ? formik.errors.lng
                          : 'Longitudinea'
                  }</label>
                  <input 
                      id="lng" 
                      name="lng" 
                      type="text" 
                      placeholder="Longitudinea" 
                      onChange={formik.handleChange} 
                      onBlur={formik.handleBlur} 
                      value={formik.values.lng}
                      className="md:w-80"
                      />
              </section>


          </section>


          {/**TARA JUDET ORAS ADRESA*/}
          <section className="md:flex md:flex-col md:justify-between md:gap-3">
              <section className="flex flex-col justify-start items-start">
                  <label htmlFor="country">
                      {formik.touched.country && formik.errors.country 
                          ? formik.errors.country
                          : 'Tara'
                  }</label>
                  <select 
                      className="sm:w-full md:w-80"
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

              <section className="flex flex-col justify-start items-start">
                  <label htmlFor="county">
                      {formik.touched.county && formik.errors.county 
                          ? formik.errors.county
                          : 'Judet'
                  }</label>
                  <select 
                      className="sm:w-full md:w-80"
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

              <section className="flex flex-col justify-start items-start">
                  <label htmlFor="city">
                      {formik.touched.city && formik.errors.city 
                          ? formik.errors.city
                          : 'Oras'
                  }</label>
                  <select 
                      className="sm:w-full md:w-80"
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

              <section className="flex flex-col justify-start items-start">
                  <label htmlFor="address">
                      {formik.touched.address && formik.errors.address 
                          ? formik.errors.address
                          : 'Adresa'
                  }</label>
                  <textarea 
                      className="resize-none text-gray-900 md:w-80"
                      spellCheck='false'
                      id="address" 
                      name="address" 
                      placeholder="Adresa" 
                      onChange={formik.handleChange} 
                      onBlur={formik.handleBlur} 
                      value={formik.values.address} 
                  />
              </section>
          </section>

          
          {/**IMGS */}
          <section className="flex flex-col justify-start items-start ">
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

          {/**GPXS */}
          <section className="flex flex-col justify-start items-start ">
              <label htmlFor="gpxs">
                  {formik.touched.gpxs && formik.errors.gpxs 
                      ? formik.errors.gpxs
                      : 'Fisier GPX'
              }</label>
              <input 
                  className=" text-gray-200"
                  id="gpxs" 
                  name="gpxs" 
                  type="file" 
                  accept=".gpx"
                  onChange={(e) => formik.setFieldValue('gpxs', e.currentTarget.files[0])} 
              />
          </section>
          
          <button className="md:w-80 " type="submit"> { submitTxt || "Inregistreaza"}</button>
          {children}

      </section>
      
          {/**LISTA POZE INCARCATE */}
          <section>
              <p>Poze incarcate</p>
              <section className="flex flex-row flex-wrap gap-5">
                  {imgsUrl.map(
                      img => 
                          <img 
                              className="h-32 md:h-40"
                              key={img} 
                              src={img} 
                              alt={img} 
                          />
                      )
                  }
              </section>
          </section>

          {/**LISTA POZE EXISTENTE */}
          {update && <section>
              <p>Poze existente</p>
              <section className="flex flex-row flex-wrap gap-5">
                  {extImgs.map(
                      img => 
                          <section className='relative  ' key={img.imgUrl} >
                              <FontAwesomeIcon 
                                  icon={faX} 
                                  onClick={() => setExtImgs(prev => prev?.filter(filterImg => filterImg.imgUrl !== img.imgUrl))}
                                  className='absolute top-2 right-2 text-4xl text-gray-300 cursor-pointer'/>
                              
                              <img 
                                  className="h-32 md:h-40 "
                                  
                                  src={`${staticApi}${img.imgUrl}`} 
                                  alt={img.imgUrl} 
                              />
                          
                          </section>
                      )
                  }
              </section>
          </section>}
  </form>
)
}

export default Partener