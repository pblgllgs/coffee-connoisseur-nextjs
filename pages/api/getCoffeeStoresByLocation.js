import { getPlaces, normalizePlaces } from '../../utils/normalize';

const getCoffeeStoreByLocation = async (req, res) => {
  try {
    const { latLong, limit } = req.query;
    const response = await getPlaces(latLong, limit);
    const resp = normalizePlaces(response);
    res.status(200).json(resp);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Bad request' });
  }
};

export default getCoffeeStoreByLocation;
