import Head from 'next/head';
import Image from 'next/image';
import Banner from '../components/Banner';
import useTrackLocation from '../hooks/use-track-location';
import styles from '../styles/Home.module.css';
import { getPlaces, normalizePlaces } from '../utils/normalize';
import { useContext, useEffect, useState } from 'react';
import { ACTION_TYPES, StoreContext } from '../store/storeContext';
import GridCard from '../components/GridCard';

export default function Home(props) {
  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores, latLong } = state;
  const { handleTrackLocation, locationErrorMsg, isFindingLocation } = useTrackLocation();
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);
  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };
  useEffect(() => {
    const getPlacesBylocation = async () => {
      if (latLong) {
        try {
          const response = await fetch(
            `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=24`
          );
          const coffeeStores = await response.json();
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStores }
          });
          setCoffeeStoresError('');
        } catch (error) {
          console.log({ error });
          setCoffeeStoresError(error.message);
        }
      }
    };
    getPlacesBylocation();
  }, [latLong, dispatch]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Discover</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          handleOnClick={handleOnBannerBtnClick}
          buttonText={isFindingLocation ? 'Locating...' : 'Ver locales cercanos!!'}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image src="/static/hero-image.png" alt="hero-image" width={700} height={400} />
        </div>
        {coffeeStores.length > 0 && <GridCard coffeeStores={coffeeStores} />}
        {props.coffeeStores.length > 0 && (
          <GridCard coffeeStores={props.coffeeStores} title="Locales en Santiago" />
        )}
      </main>
    </div>
  );
}

export const getStaticProps = async () => {
  const resp = await getPlaces();
  const respNormalized = normalizePlaces(resp);
  return {
    props: {
      coffeeStores: respNormalized
    }
  };
};
