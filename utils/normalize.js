import axios from 'axios';

export const imgSearch = async (place) => {
  const options = {
    url: `https://api.foursquare.com/v3/places/${place.fsq_id}/photos`,
    headers: {
      Authorization: 'fsq3g3Hm1u7eF1OQBIaU4maTD9yQY/flEYrdWbTjizPQp/Q=',
    },
    method: 'GET',
  };
  const { data } = await axios.request(options);
  const img = `${data[0].prefix.substring(
    0,
    data[0].prefix.length - 1
  )}/original${data[0].suffix}`;
  return img;
};

export const normalize = (places) => {
  const resp = places.map(async (store) => {
    const img = await imgSearch(store);
    return {
      fsq_id: store.fsq_id,
      imgUrl: img,
    };
  });
  return resp;
};

export const normalizev2 = async (place) => {
  const img = await imgSearch(place);
  return {
    fsq_id: place.fsq_id,
    imgUrl: img,
  };
};
