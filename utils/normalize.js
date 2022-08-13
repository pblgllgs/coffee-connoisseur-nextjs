import axios from 'axios';

export const imgSearch = async (place) => {
  const options = {
    url: `https://api.foursquare.com/v3/places/${place.fsq_id}/photos`,
    headers: {
      Authorization: process.env.NEXT_PUBLIC_AUTHORIZATION,
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

export const getPlace = async (id) => {
  const options = {
    url: `https://api.foursquare.com/v3/places/${id}`,
    headers: {
      Authorization: process.env.NEXT_PUBLIC_AUTHORIZATION,
    },
  };
  const { data } = await axios.request(options);
  const img = await normalizev2(data);
  const resp = {
    ...data,
    img,
  };
  return resp;
};

export const getCommets = async (id) => {
  const options = {
    url: `https://api.foursquare.com/v3/places/${id}/tips`,
    headers: {
      Authorization: process.env.NEXT_PUBLIC_AUTHORIZATION,
    },
  };
  const { data } = await axios.request(options);
  return data;
};

export const getPlaces = async (latlong = '41.8781,-87.6298') => {
  const options = {
    url: `https://api.foursquare.com/v3/places/search?limit=6&ll=${latlong}`,
    headers: {
      Authorization: process.env.NEXT_PUBLIC_AUTHORIZATION,
    },
  };
  const { data } = await axios.request(options);
  const { results } = data;
  const imgs = await Promise.all(normalize(results));
  const resp = results.map((result) => {
    return {
      ...result,
      imgUrl: imgs.find((img) => img.fsq_id === result.fsq_id),
    };
  });
  return resp;
};
