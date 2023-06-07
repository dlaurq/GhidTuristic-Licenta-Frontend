import { useEffect, useState } from "react"
import useStaticApi from "../hooks/useStaticApi"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { useNavigate } from "react-router-dom"

const EntityCard = ({entity, children, className}) => {

  const staticApi = useStaticApi()
  const api = useAxiosPrivate()
  const navigate = useNavigate()
  
  //const [entity, setEntity] = useState({})

  useEffect(() => {
    /** 
    const fetchEntity = async () => {
      
      try {
        const res = await api.get(`/places/${name}`)
        console.log(res.data)
        setEntity(res.data)
      } catch (err) {
        console.log(err)
      }
      
    }

    fetchEntity()
    */
  }, [])

  const calcRating = (reviews) => {
    let sum = 0
    reviews?.forEach(review => sum += parseFloat(review?.rating));
    return sum / reviews?.length
  }

  return (
    <section className={`last:border-b-0 sm:px-0 md:mt-5 md:p-0 md:border-2 md:last:border-b-2  md:flex md:flex-col md:justify-between  p-5 border-gray-900 border-b-2 ${className}`} >
      <section className="">
        <img onClick={() => navigate(`/obiective/${entity.name}`)} className="w-full cursor-pointer !p-0" src={`${staticApi}${entity?.Images?.[0]?.imgUrl}`} alt={entity?.name} />

        <section onClick={() => navigate(`/obiective/${entity.name}`)} className="md:pl-5 flex flex-row justify-start gap-5 items-center mt-4 cursor-pointer">
          <h2 className="text-2xl font-bold">{entity?.name}</h2>
          <p className="opacity-50 text-lg">{entity?.Category?.name}</p>
        </section>

        <p className="md:pl-5 text-lg mb-2">Rating {calcRating(entity?.Reviews) || 0} &#x2022; Recenzii {entity?.Reviews?.length} </p>
        
        <p className="md:pl-5  text-left sm:w-4/5">{entity?.description}</p>
      </section>
      
      <section className="md:pl-5 md:pb-5">
        {children}
      </section>
    </section>
  )
}

export default EntityCard