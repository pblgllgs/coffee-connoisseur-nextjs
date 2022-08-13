import Head from 'next/head';
import Image from 'next/image';
import Banner from '../components/Banner';
import Card from '../components/Card';
import useTrackLocation from '../hooks/use-track-location';
import styles from '../styles/Home.module.css';
import { getPlaces } from '../utils/normalize';
import { useContext, useEffect, useState } from 'react';
import { ACTION_TYPES, StoreContext } from '../store/storeContext';

export default function Home(props) {
  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latLong } = state;
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } = useTrackLocation();
  const [coffeeStoresByLocationError, setCoffeeStoresByLocationError] = useState(null);
  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };

  useEffect(() => {
    const getPlacesBylocation = async () => {
      if (latLong) {
        try {
          const fetchCoffeStores = await getPlaces(latLong, 24);
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStores: fetchCoffeStores }
          });
          console.log({ fetchCoffeStores });
        } catch (error) {
          console.log({ error });
          setCoffeeStoresByLocationError(error.message);
        }
      }
    };
    getPlacesBylocation();
  }, [latLong]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Discover</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          handleOnClick={handleOnBannerBtnClick}
          buttonText={isFindingLocation ? 'Locating...' : 'View stores nearby!!'}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresByLocationError && <p>Something went wrong: {coffeeStoresByLocationError}</p>}
        <div className={styles.heroImage}>
          <Image src="/static/hero-image.png" alt="hero-image" width={700} height={400} />
        </div>
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores cerca</h2>
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
          </div>
        )}
        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Santiago stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((store) => {
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
          </div>
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
  const resp = await getPlaces();
  return {
    props: {
      coffeeStores: resp
    }
  };
};
