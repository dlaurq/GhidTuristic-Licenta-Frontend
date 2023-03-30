

const ErrorMsg = ({children, color = "text-red-500"}) => {
  return (
    <p className={`text-2xl pt-5 text-center font-bold ${color}`}>{children}</p>
  )
}

export default ErrorMsg