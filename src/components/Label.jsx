

const Label = ({children, classes, htmlFor}) => {
  return (
    <label htmlFor={htmlFor} className={`${classes}`}>
          {children}
    </label>
  )
}

export default Label