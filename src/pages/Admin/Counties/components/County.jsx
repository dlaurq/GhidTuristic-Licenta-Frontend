import Button from "../../../../components/Button"

const County = ({county, handleDelete, handleEdit,handleUpdate}) => {
  return (
    <section className="flex flex-row justify-between p-5 items-center border-b border-gray-300">
        <h3 className="text-2xl">{county.name}</h3>
        <div className="flex flex-row">
            <Button handleClick={handleEdit} classes='mx-1'>Edit</Button>
            <Button handleClick={handleDelete} classes='mx-1'>Delete</Button>
        </div>
    </section>
  )
}

export default County