import React from 'react'
import { Form, Text, TextArea } from 'react-form'
import { Query, Mutation } from "react-apollo"
import gql from "graphql-tag";
import { TopicsOptions, AuthorsOptions } from "./Options";

const QueryPost = gql`
query Query($id: Int!) {
  postById(id: $id) {
    id
    personByAuthorId {
      id
      fullName
    }
    topic
    headline
    body
  }
}`

const UpdatePost = gql`
mutation UpdatePostById($input: UpdatePostByIdInput!) {
  updatePostById(input: $input) {
    post {
      id
      personByAuthorId {
        id
        fullName
      }
      headline
      body
      topic
    }
  }
}`

const EditPost = ({match}) => {
  return <Query query={QueryPost} variables={{ id: parseInt(match.params.id) }} >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>
      if (error) return <p>Error :(</p>

      return <Mutation mutation={UpdatePost}>
        {updatePost => {
          return <Form onSubmit={(submittedValues) =>
            updatePost({
              variables: {
                input: {
                  id: match.params.id,
                  postPatch: submittedValues
                }
              }
            })
          }>
            { formApi => (
              <form onSubmit={formApi.submitForm}>
                <div className="form-group">
                  <label htmlFor="headline">Headline</label>
                  <Text
                    className="form-control"
                    id="headline" field="headline"
                    defaultValue={data.postById.headline}
                  />
                </div>
                <div className="row">
                  <div className="col-6">
                    <AuthorsOptions
                      defaultValue={data.postById.personByAuthorId.id}
                    />
                  </div>
                  <div className="col-6">
                    <TopicsOptions
                      defaultValue={data.postById.topic}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="body">Body</label>
                  <TextArea
                    className="form-control" rows="12"
                    id="body" field="body"
                    defaultValue={data.postById.body}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </form>
            )}
          </Form>
        }}
      </Mutation>
    }}
  </Query>
}

export default EditPost
