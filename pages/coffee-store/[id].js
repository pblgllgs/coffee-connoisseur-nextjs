import Link from 'next/link';
import { useRouter } from 'next/router';
import coffeeStores from '../../data/coffee-stores.json';

const CoffeeStore = (props) => {
  const router = useRouter();
  return (
    <div>
      CoffeStore {router.query.id}
      <Link href="/">Back to Home</Link>
      <Link href="/">Back to Dynamic</Link>
      <p>{props.coffeeStore.address}</p>
      <p>{props.coffeeStore.name}</p>
    </div>
  );
};

export default CoffeeStore;

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
export const getStaticPaths = async (ctx) => {
  const idArr = coffeeStores.map((store) => String(store.id));
  return {
    paths: idArr.map((id) => ({
      params: {
        id,
      },
    })),
    fallback: false,
  };
};

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.
export const getStaticProps = async ({params}) => {
  const { id } = params;
  return {
    props: {
      coffeeStore: coffeeStores.find((store) => store.id.toString() === id),
    },
  };
};
