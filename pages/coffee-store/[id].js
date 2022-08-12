import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/coffee-store.module.css';
import cls from 'classnames';
import axios from 'axios';
import { normalizev2 } from '../../utils/normalize';

const CoffeeStore = ({ coffeeStore }) => {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  const { fsq_id, location, country, name, img } = coffeeStore;
   console.log(img.imgUrl);
  const handleUpvoteButton = () => {
    console.log('handle');
  };
  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>Back to Home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={img.imgUrl}
            alt={name}
            width={600}
            height={360}
            className={styles.storeImg}
          />
        </div>
        <div className={cls('glass', styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/places.svg"
              width={24}
              height={24}
              alt={'icon'}
            />
            <p className={styles.text}>{location.address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/nearMe.svg"
              width={24}
              height={24}
              alt={'icon'}
            />
            <p className={styles.text}>{location.country === 'CL' ? 'Chile': ''}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width={24}
              height={24}
              alt={'icon'}
            />
            <p className={styles.text}>1</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Vote!!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
export const getStaticPaths = async () => {
  const options = {
    url: 'https://api.foursquare.com/v3/places/search',
    headers: {
      Authorization: 'fsq3g3Hm1u7eF1OQBIaU4maTD9yQY/flEYrdWbTjizPQp/Q=',
    },
  };
  const { data } = await axios.request(options);
  const { results } = data;
  const idArr = results.map((store) => String(store.fsq_id));
  return {
    paths: idArr.map((id) => ({
      params: {
        id,
      },
    })),
    fallback: true,
  };
};

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.
export const getStaticProps = async ({ params }) => {
  const { id } = params;
  console.log(id);
  const options = {
    url: `https://api.foursquare.com/v3/places/${id}`,
    headers: {
      Authorization: 'fsq3g3Hm1u7eF1OQBIaU4maTD9yQY/flEYrdWbTjizPQp/Q=',
    },
  };
  const { data } = await axios.request(options);
  const img = await normalizev2(data);
  const resp = {
    ...data,
    img
  };
  return {
    props: {
      coffeeStore: resp,
    },
  };
};
