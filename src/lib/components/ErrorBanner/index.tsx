import React from 'react'
import { Alert } from 'antd'

interface Props {
  message?: string
  description?: string
}

export const ErrorBanner = ({
  message = 'Uh oh! Something went wrong :(',
  description = 'Look like something went wrong. Please check your connection and/or try again later.',
}: Props) => {
  return (
    <Alert
      banner
      closable
      type="error"
      message={message}
      description={description}
      className="error-banner"
    />
  )
}
