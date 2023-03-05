

const ErrorMsg = ({children, color = "text-red-500"}) => {
  return (
    <p className={`text-xl p-5 text-center font-bold ${color}`}>{children}</p>
  )
}

export default ErrorMsg