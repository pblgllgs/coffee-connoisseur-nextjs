import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/coffee-store.module.css';
import cls from 'classnames';
import {
  // getCommets,
  getPlace,
  getPlaces,
  normalizePlace
} from '../../utils/normalize';
import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../store/storeContext';
import { isEmpty } from '../../utils/index';

const CoffeeStore = (initialProps) => {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  const id = router.query.id;

  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const {
    state: { coffeeStores }
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, imgUrl, neighbourhood, address } = coffeeStore;
      const response = await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          neighbourhood: neighbourhood || '',
          address: address || '',
          imgUrl
        })
      });
      const dbCoffeeStore = await response.json();
      console.log({ dbCoffeeStore });
    } catch (error) {
      console.log('Error creando los places', error);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id;
        });
        console.log('encontrado');
        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps.coffeeStore, initialProps]);

  const { address, name, imgUrl, voting } = coffeeStore;

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
            src={
              imgUrl ||
              'https://gastronomiaycia.republica.com/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2021/12/lista_bar_2021_Schmucks-680x429.jpg.webp'
            }
            alt={name}
            width={600}
            height={360}
            className={styles.storeImg}
          />
        </div>

        <div className={cls('glass', styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/places.svg" width={24} height={24} alt={'icon'} />
            <p className={styles.text}>{address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/nearMe.svg" width={24} height={24} alt={'icon'} />
            <p className={styles.text}>{address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width={24} height={24} alt={'icon'} />
            <p className={styles.text}>{voting}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Vote!!
          </button>
          {/* <div className={styles.iconWrapper}>
            {commets.length > 0 &&
              commets.slice(0, 2).map((comment) => {
                return (
                  <div key={comment.created_at}>
                    <p className={styles.textComments}>{comment.created_at}</p>
                    <p className={styles.textComments}>{comment.text}</p>
                  </div>
                );
              })}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;

export async function getStaticPaths() {
  const coffeeStores = await getPlaces();
  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: {
        id: coffeeStore.fsq_id.toString()
      }
    };
  });
  return {
    paths,
    fallback: true
  };
}

export const getStaticProps = async ({ params }) => {
  const { id } = params;
  const resp = await getPlace(id);
  // const commets = await getCommets(id);
  // const respuesta = {
  //   ...resp
  //   commets
  // };
  const storeNormalized = normalizePlace(resp);
  console.log(storeNormalized);
  return {
    props: {
      coffeeStore: storeNormalized ? storeNormalized : {}
    }
  };
};
