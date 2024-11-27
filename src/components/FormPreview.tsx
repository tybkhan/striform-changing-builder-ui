import React from 'react'
import { Form } from '../types'
import FormViewer from './FormViewer'

interface FormPreviewProps {
  form: Form
}

const FormPreview: React.FC<FormPreviewProps> = ({ form }) => {
  return (
    <div className="w-full h-full overflow-hidden">
      <FormViewer form={form} isPreview={true} />
    </div>
  )
}

export default FormPreview