import useStaticApi from "../../../hooks/useStaticApi"

const staticApi = useStaticApi()

const EntityCard = ({entity}) => {
  return (
    <section className="text-gray-300">
        <img src={`${staticApi}${entity.Images[0]?.imgUrl}`} alt={entity.name} />
        <h2>{entity.name}</h2>
        <p>{entity.description}</p>
    </section>
  )
}

export default EntityCard