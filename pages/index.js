import Head from 'next/head'
import Image from 'next/image';
import Banner from '../components/Banner'
import styles from '../styles/Home.module.css'

export default function Home() {
  const handleOnBannerBtnClick = () => {
    console.log('Holaa Btn');
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner handleOnClick={handleOnBannerBtnClick} buttonText="View stores nearby!!" />
        <div className={styles.heroImage}>
        <Image src={'/static/hero-image.png'} alt='hero-image' width={700} height={400} />

        </div>
      </main>
    </div>
  );
}
