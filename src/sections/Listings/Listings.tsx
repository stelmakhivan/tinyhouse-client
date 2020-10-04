import React, { FC } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import { gql } from 'apollo-boost'

import { List, Avatar, Button, Spin, Alert } from 'antd'

import './styles/Listings.css'
import { ListingsSkeleton } from './components/ListingsSkeleton'

import { Listings as ListingsData } from './__generated__/Listings'
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from './__generated__/DeleteListing'

const LISTINGS = gql`
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBeds
      numOfBaths
      rating
    }
  }
`

const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`

interface Props {
  title: string
}

export const Listings: FC<Props> = ({ title }) => {
  const { data, loading, error, refetch } = useQuery<ListingsData>(LISTINGS)
  const [
    deleteListing,
    { loading: deleteListingLoading, error: deleteListingError },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING)

  const handleDeleteListing = async (id: string) => {
    await deleteListing({ variables: { id } })
    await refetch()
  }

  const listings = data ? data.listings : null

  const listingsList = listings ? (
    <List
      itemLayout="horizontal"
      dataSource={listings}
      renderItem={(listing) => (
        <List.Item
          actions={[
            <Button
              type="primary"
              onClick={() => handleDeleteListing(listing.id)}
            >
              Delete
            </Button>,
          ]}
        >
          <List.Item.Meta
            title={listing.title}
            description={listing.address}
            avatar={<Avatar src={listing.image} shape="square" size={48} />}
          />
        </List.Item>
      )}
    />
  ) : null

  if (loading) {
    return (
      <div className="listings">
        <ListingsSkeleton title={title} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="listings">
        <ListingsSkeleton title={title} error />
      </div>
    )
  }

  const deleteListingErrorAlert = deleteListingError ? (
    <Alert
      type="error"
      message="Uh oh! Something went wrong with deleting — please try again later :("
      className="listings__alert"
    />
  ) : null

  return (
    <div className="listings">
      <Spin spinning={deleteListingLoading}>
        {deleteListingErrorAlert}
        <h2>{title}</h2>
        {listingsList}
      </Spin>
    </div>
  )
}
