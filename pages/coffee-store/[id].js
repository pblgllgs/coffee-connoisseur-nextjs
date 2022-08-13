import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/coffee-store.module.css';
import cls from 'classnames';
import axios from 'axios';
import { getCommets, getPlace, normalizev2 } from '../../utils/normalize';

const CoffeeStore = ({ coffeeStore }) => {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  const { location, name, img, commets } = coffeeStore;
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
              <a>←Back to Home</a>
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
            <p className={styles.text}>
              {location.country === 'CL' ? 'Chile' : ''}
            </p>
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
          <div className={styles.iconWrapper}>
            {commets.length > 0 &&
              commets.slice(0,2).map((comment) => {
                return (
                  <div key={comment.created_at}>
                    <p className={styles.textComments}>{comment.created_at}</p>
                    <p className={styles.textComments}>{comment.text}</p>
                  </div>
                );
              })}
          </div>
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
      Authorization: process.env.NEXT_PUBLIC_AUTHORIZATION,
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
  const resp = await getPlace(id);
  const commets = await getCommets(id);
  const respuesta = {
    ...resp,
    commets,
  };
  return {
    props: {
      coffeeStore: respuesta,
    },
  };
};
