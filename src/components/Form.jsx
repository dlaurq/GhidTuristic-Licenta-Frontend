

const Form = ({children, handleSubmit, encType = 'application/x-www-form-urlencoded', className}) => {
  return (
    <form 
      onSubmit={handleSubmit} 
      autoComplete='off' 
      className={`text-gray-300 text-xl font-bold p-5 w-full text-left border-b flex flex-col justify-around ${className}`}
      encType={encType}
    >
        {children}
    </form>
  )
}

export default Form