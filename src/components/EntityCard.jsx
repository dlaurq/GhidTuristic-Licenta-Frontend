import useStaticApi from "../hooks/useStaticApi"

const staticApi = useStaticApi()

const EntityCard = ({entity}) => {
  return (
    <section className="text-gray-300 bg-gray-900 text-center border-b-2 mt-4">
        <img src={`${staticApi}${entity.Images[0]?.imgUrl}`} alt={entity.name} />
        <h2 className="font-bold text-2xl my-4">{entity.name}</h2>
        <section className="flex flex-row justify-evenly text-xl my-2">
          <p>Rating: 8</p>
          <p>Recenzii: 10</p>
        </section>
        <p className="p-6 text-left">{entity.description}</p>
    </section>
  )
}

export default EntityCard