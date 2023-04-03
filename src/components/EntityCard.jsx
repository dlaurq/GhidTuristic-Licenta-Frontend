import { useEffect, useState } from "react"
import useStaticApi from "../hooks/useStaticApi"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { useNavigate } from "react-router-dom"

const EntityCard = ({name, children}) => {

  const staticApi = useStaticApi()
  const api = useAxiosPrivate()
  const navigate = useNavigate()
  
  const [entity, setEntity] = useState({})

  useEffect(() => {
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
  }, [])

  const calcRating = (reviews) => {
    //console.log(reviews)
    let sum = 0
    reviews?.forEach(review => sum += parseFloat(review?.rating));
    return sum / reviews?.length
  }


  return (
    <section className="text-gray-300 bg-gray-900 text-center border-b-2 p-5">
        <img src={`${staticApi}${entity?.Images?.[0]?.imgUrl}`} alt={entity?.name} />
        <h2 onClick={() => navigate(`/obiective/${entity.name}`)} className="font-bold text-2xl my-4 cursor-pointer">{entity?.name}</h2>
        <section className="flex flex-row justify-evenly text-xl my-2">
          <p>Rating: {calcRating(entity.Reviews) || 0}</p>
          <p>Recenzii: {entity?.Reviews?.length}</p>
        </section>
        <p className="py-6 text-left">{entity?.description}</p>

        {children}
    </section>
  )
}

export default EntityCard