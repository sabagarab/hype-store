const ErrorMessage = ({
  error,
  "data-testid": dataTestid,
}: {
  error?: string | null
  "data-testid"?: string
}) => {
  if (!error) {
    return null
  }

  return (
    <p
      role="alert"
      className="pt-3 text-sm font-medium text-error"
      data-testid={dataTestid}
    >
      {error}
    </p>
  )
}

export default ErrorMessage
