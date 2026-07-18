import axios from "axios";
import { number } from "yup";
import type { Post } from "../types/post";

axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";

type fetchPostsResponse = Post[];

export const fetchPosts = async (
  searchText: string,
  page: number
): Promise<{
  posts: Post[];
  totalCount: number;
}> => {
  const response = await axios.get<fetchPostsResponse>("/posts", {
    params: {
      ...(searchText !== "" && { q: searchText }),
      page: page,
      _limit: 8,
    },
  });

  const totalCount = Number(response.headers["x-total-count"]);
  return {
    posts: response.data,
    totalCount,
  };
};

export const createPost = async (newPost) => {};

export const editPost = async (newDataPost) => {};

export const deletePost = async (postId: number) => {
    const { data } = await axios.delete<Post>(`/posts/${postId}`);

    return data;
};
