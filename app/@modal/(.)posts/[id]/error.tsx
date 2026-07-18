'use client';

interface ErrorProps {
  error: Error | null;
}

export default function Error({ error }: ErrorProps) {
  return <p>{`Could not fetch post details. ${error?.message}`}</p>;
}
