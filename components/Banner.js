import styles from './Banner.module.css';

const Banner = (props) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.title1}>Coffee</span>
        <span className={styles.title2}>Connoisseur</span>
      </h1>
      <p className={styles.subTitle}>Descubre las tiendas cerca tuyo!!</p>
      <div className={styles.buttonWrapper}>
        <button onClick={props.handleOnClick} className={styles.button}>
          {props.buttonText}
        </button>
      </div>
    </div>
  );
};

export default Banner;
