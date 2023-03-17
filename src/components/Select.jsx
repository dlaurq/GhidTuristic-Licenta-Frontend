

const Select = ({children, name, id, handleChange, className,value,handleBlur}) => {
  return (
    <select 
        className={`text-gray-900 ${className}`}
        name={name} 
        id={id} 
        onChange={handleChange} 
        value={value}
        onBlur={handleBlur}
    >

          {children}
    </select>
  )
}

export default Select