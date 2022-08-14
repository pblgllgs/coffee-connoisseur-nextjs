import React from 'react';
import styles from '../styles/Home.module.css';
import Card from './Card';

const GridCard = ({ coffeeStores, title = 'Stores near me' }) => {
  return (
    <div className={styles.sectionWrapper}>
      <h2 className={styles.heading2}>{title}</h2>
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
  );
};

export default GridCard;