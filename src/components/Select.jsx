

const Select = ({children, name, id, handleChange, classes,value,handleBlur}) => {
  return (
    <select 
        className={`text-gray-900 ${classes}`}
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