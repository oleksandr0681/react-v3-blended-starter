'use client';

import { useQuery } from '@tanstack/react-query';
import Modal from '@/components/Modal/Modal';
import { fetchPostById, fetchUserById } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';

import css from './PostPreview.module.css';
import { useEffect, useState } from 'react';
import { User } from '@/types/user';
import Loading from '@/app/loading';
import Error from './error';

export default function PostPreviewClient() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const parsedId = Number(id);
  const [user, setUser] = useState<User | null>(null);

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['post', parsedId],
    queryFn: () => fetchPostById(parsedId),
    refetchOnMount: false,
  });

  useEffect(() => {
    if (!post) return;

    const fn = async () => {
      const fetchedUser = await fetchUserById(post?.userId);
      setUser(fetchedUser);
    };
    fn();
  }, [post]);

  const handleClose = () => {
    router.back();
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !post) {
    return <Error error={error} />;
  }

  return (
    <Modal onClose={handleClose}>
      <button className={css.backBtn} onClick={handleClose}>
        ← Back
      </button>
      <div className={css.post}>
        <div className={css.wrapper}>
          <div className={css.header}>
            <h2>{post.title}</h2>
          </div>

          <p className={css.content}>{post.body}</p>
        </div>
        <p className={css.user}>{user?.name}</p>
      </div>
    </Modal>
  );
}
