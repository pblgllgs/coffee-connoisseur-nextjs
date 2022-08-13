import Head from 'next/head';
import { useRouter } from 'next/router';

const DynamicRoute = () => {
  const router = useRouter();
  const dynamic = router.query.dynamic;
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
