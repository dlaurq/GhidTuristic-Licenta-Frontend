

const Form = ({children, handleSubmit, classes}) => {
  return (
    <form onSubmit={handleSubmit} autoComplete='off' className={`text-gray-300 text-xl font-bold p-5 w-full text-left border-b flex flex-col justify-around ${classes}`}>
        {children}
    </form>
  )
}

export default Form