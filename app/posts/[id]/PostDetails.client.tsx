'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { fetchPostById, fetchUserById } from '@/lib/api';

import css from './PostDetails.module.css';
import { useEffect, useState } from 'react';
import Loading from '@/app/loading';
import Error from './error';
import { User } from '@/types/user';

export default function PostDetailsClient() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const parsedId = Number(id);
  const [user, setUser] = useState<User | null>(null);

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', parsedId],
    queryFn: () => fetchPostById(parsedId),
    refetchOnMount: false,
  });
  
  const handleClickBack = () => {
    router.back();
  };

  useEffect(() => {
    if (!post) return;

    const fn = async () => {
      const fetchedUser = await fetchUserById(post?.userId);
      setUser(fetchedUser);
    };
    fn();
  }, [post]);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !post) {
    return <Error error={error} />;
  }

  return (
    <>
      <main className={css.main}>
        <div className={css.container}>
          <div className={css.item}>
            <button className={css.backBtn} onClick={handleClickBack}>← Back</button>

            <div className={css.post}>
              <div className={css.wrapper}>
                <div className={css.header}>
                  <h2>{ post.title }</h2>
                </div>

                <p className={css.content}>{ post.body }</p>
              </div>
              <p className={css.user}>{`Author: ${user?.name}`}</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
