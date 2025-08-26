import UpdateTenderComponent from '@/components/updateTender'
import { Tender } from '@/lib/domain/tender.model'
import React from 'react'

const UpdatePage = (item : Tender) => {
  return (
    <UpdateTenderComponent tender = {item} />
  )
}

export default UpdatePage