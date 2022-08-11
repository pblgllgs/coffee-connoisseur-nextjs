import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const CoffeeStore = () => {
  const router = useRouter();
  return (
    <div>
      CoffeStore {router.query.id}
      <Link href="/">Back to Home</Link>
    </div>
  );
};

export default CoffeeStore;
