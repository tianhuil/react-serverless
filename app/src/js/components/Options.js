import React from 'react'
import { Select } from 'react-form'
import { Query, Mutation } from "react-apollo"
import gql from "graphql-tag"

const PostTopics = gql`
query PostTopics {
  __type(name: "PostTopic") {
    name
    enumValues {
      name
    }
    description
  }
}`

const QueryAuthors = gql`
query QueryAuthors {
  allPeople {
    nodes {
      id
      fullName
    }
  }
}`

const OptionsWith = (props) => (
  <div className="form-group">
    <label htmlFor={props.id}>{props.field}</label>
    <Select className="form-control"
      defaultValue={props.defaultValue}
      id={props.id} field={props.field}
      options={props.options}
    />
  </div>
)

const AuthorsOptions = (props) => (
  <Query query={QueryAuthors}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>
      if (error) return <p>Error :(</p>

      return <OptionsWith
        id="authorId" field="authorId"
        defaultValue={props.defaultValue}
        options={data.allPeople.nodes.map(
          n => ({
            value: n.id,
            label: n.fullName ? n.fullName : `(id: ${n.id})`
          })
        )}
      />
    }}
  </Query>
)

const TopicsOptions = (props) => (
  <Query query={PostTopics}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>
      if (error) return <p>Error :(</p>

      return <OptionsWith
        id="topic" field="topic"
        defaultValue={props.defaultValue}
        options={data.__type.enumValues.map(
          v => ({value: v.name, label: v.name})
        )}
      />
    }}
  </Query>
)

export { TopicsOptions, AuthorsOptions }
