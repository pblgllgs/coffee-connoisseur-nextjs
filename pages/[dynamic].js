import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

const DynamicRoute = () => {
  const router = useRouter();
  const dynamic = router.query.dynamic;
  console.log(dynamic);
  return (
    <div>
      <Head>
        <title>Estas en :{dynamic}</title>
      </Head>
      DynamicRoute : {dynamic}
    </div>
  );
};

export default DynamicRoute;
