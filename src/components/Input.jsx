import { useEffect } from "react"


const Input = ({id,name,type,placeholder,handleChange,value,handleBlur, multiple, accept, className}) => {





  return (
    <input 
      className={`text-neutral-700 w-full ${className}`}
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      onChange={handleChange}
      value={value}
      onBlur={handleBlur}
      accept = {accept}
      multiple = {multiple ? true : false}
    />
  )
}

export default Input