import Button from "../../../../components/Button"
import CountryForm from "./CountryForm"

const Country = ({country, handleDelete, handleEdit,handleUpdate}) => {

  
  return (
    <>
    {!country.edit ?
        <section className="flex flex-row justify-between p-5 items-center border-b">
          <h3 className="text-2xl text-gray-100">{country.name}</h3>
          <div className="buttons">
            <Button handleClick={handleEdit}>Edit</Button>
            <Button handleClick={handleDelete}>Delete</Button>
          </div>
        </section>
      :
      <CountryForm buttonText='Edit' handleSubmit={handleUpdate} country={country}/>}
  </>
  )
}

export default Country