

import { fetchComments } from "./api";
import "./PostDetail.css";
import {useQuery} from "@tanstack/react-query";

export function PostDetail({ post, deleteMutation, updateMutation }) {
  // replace with useQuery
  // const data = [];

  const {data, isError, isLoading, error} = useQuery({
    queryKey: ['comments', post.id],
    queryFn: () => fetchComments(post.id)
  })

  if(isLoading) return <h3>Loading...</h3>
  if(isError) return (
      <>
        <h3>Error</h3>
        <p>{error.toString()}</p>
      </>
  )

  return (
      <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
        <div>
          <button onClick={() => deleteMutation.mutate(post.id)}>Delete</button>
          {deleteMutation.isPending && (
              <p className='loading'>Loading</p>
          )}
          {deleteMutation.isSuccess && (
              <p className='success'>success</p>
          )}
          {deleteMutation.isError && (
              <p className='error'>error {deleteMutation.error.toString()}</p>
          )}
        </div>
        <div>
          <button onClick={() => updateMutation.mutate(post.id)}>Update title</button>
          {updateMutation.isPending && (
              <p className='loading'>Loading</p>
          )}
          {updateMutation.isSuccess && (
              <p className='success'>success</p>
          )}
          {updateMutation.isError && (
              <p className='error'>error {updateMutation.error.toString()}</p>
          )}
        </div>
        <p>{post.body}</p>
        <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
