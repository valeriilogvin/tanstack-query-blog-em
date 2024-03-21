import {useEffect, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";


import {fetchPosts, deletePost, updatePost} from "./api";
import {PostDetail} from "./PostDetail";

const maxPostPage = 10;

export function Posts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPost, setSelectedPost] = useState(null);

  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (postId) => deletePost(postId)
  })

  const updateMutation = useMutation({
    mutationFn: (postId) => updatePost(postId)
  })

  useEffect(() => {
    if(currentPage < maxPostPage) {
      const nextPage = currentPage + 1
      queryClient.prefetchQuery({
        queryKey: ['posts', nextPage],
        queryFn: () => fetchPosts(nextPage)
      })
    }
  }, [currentPage, queryClient])

  const {data, isError, error, isLoading} = useQuery({
    queryKey: ['posts', currentPage],
    queryFn: () => fetchPosts(currentPage),
    staleTime: 2000
  });

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Oops, something went wrong <p>{error.toString()}</p></div>

  return (
      <>
        <ul>
          {data.map((post) => (
              <li
                  key={post.id}
                  className="post-title"
                  onClick={() => {
                    setSelectedPost(post)
                    deleteMutation.reset()
                    updateMutation.reset()
                  }}
              >
                {post.title}
              </li>
          ))}
        </ul>
        <div className="pages">
          <button disabled={currentPage <= 1} onClick={() => {
            setCurrentPage(ps => ps - 1)
          }}>
            Previous page
          </button>
          <span>Page {currentPage}</span>
          <button disabled={currentPage >= maxPostPage} onClick={() => {
            setCurrentPage(ps => ps + 1)
          }}>
            Next page
          </button>
        </div>
        <hr/>
        {selectedPost && <PostDetail
            post={selectedPost}
            deleteMutation={deleteMutation}
            updateMutation={updateMutation}
        />}
      </>
  );
}
