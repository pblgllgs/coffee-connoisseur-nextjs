import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/coffee-store.module.css';
import cls from 'classnames';
import { getComments, getPlace, getPlaces, normalizePlace } from '../../utils/normalize';
import { useContext, useEffect, useState } from 'react';
import { ACTION_TYPES, StoreContext } from '../../store/storeContext';
import { isEmpty } from '../../utils/index';
import useSWR from 'swr';
import confetti from 'canvas-confetti';

const CoffeeStore = (initialProps) => {
  const router = useRouter();

  const id = router.query.id;

  const {
    state: { coffeeStores, votes },
    dispatch
  } = useContext(StoreContext);

  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);

  const [statusVote, setStatusVote] = useState(false);

  const { address, name, imgUrl } = coffeeStore;

  const [votingCount, setVotingCount] = useState(0);

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, imgUrl, neighbourhood, address } = coffeeStore;
      await fetch('/api/createCoffeeStore', {
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
        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps.coffeeStore, initialProps, coffeeStores]);

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, (url) =>
    fetch(url).then((res) => res.json())
  );

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  const handleUpvoteCoffeeStore = async (coffeeStore) => {
    try {
      const { id } = coffeeStore;
      await fetch('/api/upvoteCoffeeStore', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id
        })
      });
      setStatusVote(true);
      dispatch({
        type: ACTION_TYPES.ADD_VOTES,
        payload: { id: coffeeStore.id }
      });
    } catch (error) {
      console.log('Error creando los places', error);
    }
  };

  const handleUpvoteButton = () => {
    const alreadyVote = votes.find((vote) => {
      return vote === coffeeStore.id;
    });
    if (alreadyVote) {
      setStatusVote(true);
      return;
    }
    let count = votingCount + 1;
    setVotingCount(count);
    handleUpvoteCoffeeStore(coffeeStore);
    confetti({
      zIndex: 999,
      particleCount: 100,
      spread: 160,
      angle: -100,
      origin: {
        x: 1,
        y: 0
      }
    });
  };

  const alreadyVote = votes.find((vote) => {
    return vote === coffeeStore.id;
  });

  useEffect(() => {
    if (alreadyVote) {
      setStatusVote(true);
      return;
    }
  }, [alreadyVote]);

  if (error) {
    return <div>Something went wrong retrieving data from server!!</div>;
  }

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>←Volver atras</a>
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
            <p className={styles.text}>{votingCount}</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            {statusVote ? 'You already vote' : 'Vote!!'}
          </button>
          <div className={styles.iconWrapper}>
            {initialProps.comments.length > 0 &&
              initialProps.comments.slice(0, 2).map((comment) => {
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
    fallback: 'blocking'
  };
}

export const getStaticProps = async ({ params }) => {
  const { id } = params;
  try {
    const resp = await getPlace(id);
    const comments = await getComments(id);
    const storeNormalized = normalizePlace(resp);
    return {
      props: {
        coffeeStore: storeNormalized ? storeNormalized : {},
        comments
      }
    };
  } catch (error) {
    if (error) {
      return {
        redirect: {
          permanent: false,
          destination: '/'
        }
      };
    }
  }
};
