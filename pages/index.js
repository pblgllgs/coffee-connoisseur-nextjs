import Head from 'next/head';
import Image from 'next/image';
import Banner from '../components/Banner';
import Card from '../components/Card';
import styles from '../styles/Home.module.css';

import axios from 'axios';
import { normalize } from '../utils/normalize';

export default function Home({ coffeeStores }) {
  console.log(coffeeStores);
  const handleOnBannerBtnClick = () => {
    console.log('Holaa Btn');
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Discover</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          handleOnClick={handleOnBannerBtnClick}
          buttonText="View stores nearby!!"
        />
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            alt="hero-image"
            width={700}
            height={400}
          />
        </div>
        {coffeeStores.length && (
          <>
            <h2 className={styles.heading2}>Toronto stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((store) => {
                return (
                  <Card
                    key={store.fsq_id}
                    href={`/coffee-store/${store.fsq_id}`}
                    name={store.name}
                    imgUrl={store.imgUrl.imgUrl}
                    className={styles.card}
                  />
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.
export const getStaticProps = async () => {
  const options = {
    url: 'https://api.foursquare.com/v3/places/search',
    headers: {
      Authorization: 'fsq3g3Hm1u7eF1OQBIaU4maTD9yQY/flEYrdWbTjizPQp/Q=',
    },
  };
  const { data } = await axios.request(options);
  const { results } = data;
  const imgs = await Promise.all(normalize(results));
  const resp = results.map((result) => {
    return {
      ...result,
      imgUrl: imgs.find((img) => img.fsq_id === result.fsq_id),
    };
  })
  return {
    props: {
      coffeeStores: resp,
    },
  };
};
