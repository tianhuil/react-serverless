import React from 'react'
import { Query } from "react-apollo"
import gql from "graphql-tag"
import { Link } from "react-router-dom"
import queryString from 'query-string'

import { UserConsumer } from '../lib/user'

const SearchPosts = gql`
query SearchPosts($search: String, $cursor: Cursor = null) {
  searchPosts(search: $search, first: 5, after: $cursor) {
    totalCount
    edges {
      node {
        id
        personByAuthorId {
          id
          fullName
        }
        topic
        headline
        createdAt
        summary(length: 200)
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}`

const Post = (props) => (
  <React.Fragment>
    <h3>{props.node.headline}</h3>
    <p>
      { props.node.personByAuthorId.fullName &&
          <em className="mr-3">{props.node.personByAuthorId.fullName}</em> }
      { props.node.topic &&
          <span className="mr-3">({props.node.topic})</span> }
      { props.node.createdAt &&
          <span className="mr-3">Written {(new Date(props.node.createdAt)).toString()}</span> }
      { <UserConsumer>
        {({ userId }) => {
          if (userId == props.node.personByAuthorId.id) {
            return <Link to={`/edit/${props.node.id}`}>Edit</Link>
          } else {
            return null
          }
        }}
      </UserConsumer> }
    </p>
    <p>{ props.node.summary }</p>
  </React.Fragment>
)

const PostNextPage = (props) => {
  const pageInfo = props.pageInfo

  const nextPageClick = (e) => {
    e.preventDefault()
    props.fetchMore({
      query: SearchPosts,
      variables: {
        cursor: props.pageInfo.endCursor,
        search: props.search
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newEdges = fetchMoreResult.searchPosts.edges
        const pageInfo = fetchMoreResult.searchPosts.pageInfo

        return newEdges.length
          ? {
              searchPosts: {
                totalCount: previousResult.searchPosts.totalCount,
                __typename: previousResult.searchPosts.__typename,
                edges: [...previousResult.searchPosts.edges, ...newEdges],
                pageInfo
              }
            }
          : previousResult
      }
    })
  }

  return (pageInfo.hasNextPage) ? (
    <button onClick={(e) => nextPageClick(e)} className="btn btn-primary">Next Page</button>
  ) : (
    <button className="btn btn-disabled">No More Pages</button>
  )
}

const PostList = (props) => {
  const search = queryString.parse(props.location.search).q || ""

  return <Query query={SearchPosts} variables={{search: search}}>
    {({ loading, error, data, fetchMore }) => {
      if (loading) return <p>Loading...</p>
      if (error) return <p>Error :(</p>

      const searchPosts = data.searchPosts

      return <React.Fragment>
        <h1 className="mb-3">Posts ({searchPosts.totalCount})</h1>
        <ol>
        {
          searchPosts.edges.map(edge =>
            <li key={edge.node.id}>
              <Post node={edge.node} />
            </li>
          )
        }
        </ol>
        <PostNextPage
          fetchMore={fetchMore}
          pageInfo={searchPosts.pageInfo}
          search={search}
        />
      </React.Fragment>
    }}
  </Query>
}

export default PostList
