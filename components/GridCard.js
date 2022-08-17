import React from 'react';
import styles from '../styles/Home.module.css';
import Card from './Card';

const GridCard = ({ coffeeStores, title = 'Solo a metros de distancia' }) => {
  return (
    <div className={styles.sectionWrapper}>
      <h2 className={styles.heading2}>{title}</h2>
      <div className={styles.cardLayout}>
        {coffeeStores.map((store) => {
          return (
            <Card
              key={store.id}
              href={`/coffee-store/${store.id}`}
              name={store.name}
              imgUrl={store.imgUrl}
              className={styles.card}
            />
          );
        })}
      </div>
    </div>
  );
};

export default GridCard;
