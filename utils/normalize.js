import axios from 'axios';

export const imgSearch = async (place) => {
  const options = {
    url: `https://api.foursquare.com/v3/places/${place.fsq_id}/photos`,
    headers: {
      Authorization: process.env.NEXT_PUBLIC_AUTHORIZATION
    },
    method: 'GET'
  };
  const { data } = await axios.request(options);
  const img = `${data[0].prefix.substring(0, data[0].prefix.length - 1)}/original${data[0].suffix}`;
  return img;
};

export const normalizes = (places) => {
  const resp = places.map(async (store) => {
    return getImgObject(store);
  });
  return resp;
};

export const getImgObject = async (place) => {
  const img = await imgSearch(place);
  return {
    fsq_id: place.fsq_id,
    url: img
  };
};

export const getPlace = async (id) => {
  const options = {
    url: `https://api.foursquare.com/v3/places/${id}`,
    headers: {
      Authorization: process.env.NEXT_PUBLIC_AUTHORIZATION
    }
  };
  const { data } = await axios.request(options);
  const img = await getImgObject(data);
  const resp = {
    ...data,
    img
  };
  return resp;
};

export const getComments = async (id) => {
  const options = {
    url: `https://api.foursquare.com/v3/places/${id}/tips`,
    headers: {
      Authorization: process.env.NEXT_PUBLIC_AUTHORIZATION
    }
  };
  const { data } = await axios.request(options);
  return data;
};

export const getPlaces = async (latlong = '-33.4372,-70.6343', limit = 6) => {
  const options = {
    url: `https://api.foursquare.com/v3/places/search?limit=${limit}&ll=${latlong}`,
    headers: {
      Authorization: process.env.NEXT_PUBLIC_AUTHORIZATION
    }
  };
  const { data } = await axios.request(options);
  const { results } = data;
  const imgs = await Promise.all(normalizes(results));
  const resp = results.map((result) => {
    return {
      ...result,
      img: imgs.find((img) => img.fsq_id === result.fsq_id)
    };
  });
  return resp;
};

export const normalizeRecord = (record) => {
  return {
    ...record.fields
  };
};

export const normalizeRecordWithId = (record) => {
  return {
    recordId: record.id,
    ...record.fields
  };
};

export const normalizeRecords = (records) => {
  return records.map((record) => normalizeRecord(record));
};

export const normalizeRecordsWithId = (records) => {
  return records.map((record) => normalizeRecordWithId(record));
};

export const normalizePlaces = (places) => {
  const normalizedPlaces = places.map((place) => {
    return normalizePlace(place);
  });
  return normalizedPlaces;
};

export const normalizePlace = ({ fsq_id, location = '', name, img }) => {
  const { address = 'Sin definir' } = location;
  return {
    id: fsq_id,
    name,
    address: address,
    voting: 0,
    neighbourhood: address,
    imgUrl: img.url
  };
};
