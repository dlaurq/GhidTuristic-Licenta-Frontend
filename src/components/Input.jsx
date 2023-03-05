import React from 'react'

const Input = ({id,name,type,placeholder,handleChange,value,handleBlur}) => {


  /**
    <input 
      className=""
      id="county" 
      name="county" 
      type="text" 
      placeholder="Nume judet"
      onChange={formik.handleChange}
      value={formik.values.county}
      onBlur={formik.handleBlur}
    />
    */


  return (
    <input 
      className='text-neutral-700 w-full'
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      onChange={handleChange}
      value={value}
      onBlur={handleBlur}
    />
  )
}

export default Input