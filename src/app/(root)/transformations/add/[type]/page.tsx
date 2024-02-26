import Header from '@/components/shared/Header'
import { transformationTypes } from '@/constants'
import React from 'react'

const AddTransformationsTypePage = ({params:{type}}: SearchParamProps) => {


  const transformation = transformationTypes[type]

  return (
    <div>
      <Header title={transformation.title} subtitle={transformation.subTitle} />

    </div>
  )
}

export default AddTransformationsTypePage