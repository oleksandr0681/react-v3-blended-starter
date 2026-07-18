import { useState } from "react";
import PostList from "../PostList/PostList";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
// import Pagination from "../Pagination/Pagination";

import css from "./App.module.css";
import type { Post } from "../../types/post";
import { useDebounce } from "use-debounce";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchPosts } from "../../services/postService";
// import Modal from "../Modal/Modal";
// import CreatePostForm from "../CreatePostForm/CreatePostForm";
// import EditPostForm from "../EditPostForm/EditPostForm";

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCreatePost, setIsCreatePost] = useState<boolean>(false);
  const [isEditPost, setIsEditPost] = useState<boolean>(false);
  const [editedPost, setEditedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  const { data } = useQuery({
    queryKey: ["posts", debouncedSearchQuery, currentPage],
    queryFn: () => fetchPosts(debouncedSearchQuery, currentPage),
    placeholderData: keepPreviousData,
  });

  const posts = data?.posts ?? [];

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox />
        {/* <Pagination /> */}
        <button className={css.button}>Create post</button>
      </header>
      {/* {<Modal onClose={toggleModal}>Передати через children компонент CreatePostForm або EditPostForm</Modal> */}
      {isModalOpen && (
        <Modal onClose={toggleModal}>
          {/* {isCreatePost && <CreatePostForm />} */}
          {/* {isEditPost && <EditPostForm />} */}
          <p>Modal</p>
        </Modal>
      )}
      {posts.length > 0 && (
        <PostList posts={posts} toggleModal={toggleModal} toggleEditPost={toggleModal} />
      )}
    </div>
  );
}
