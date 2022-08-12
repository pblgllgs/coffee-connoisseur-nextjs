import Head from 'next/head';
import Image from 'next/image';
import Banner from '../components/Banner';
import Card from '../components/Card';
import styles from '../styles/Home.module.css';

import coffeeStores from '../data/coffee-stores.json';

export default function Home() {
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
        <div className={styles.cardLayout}>
          {coffeeStores.map((store) => {
            return <Card
              key={store.id}
              href="/coffee-store/darkhorse-coffee"
              name={store.name}
              imgUrl={store.imgUrl}
              className={styles.card}
            />;
          })}
        </div>
      </main>
    </div>
  );
}
