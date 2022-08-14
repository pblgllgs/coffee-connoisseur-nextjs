import { getPlaces } from '../../utils/normalize';

const getCoffeeStoreByLocation = async (req, res) => {
  try {
    const { latLong, limit } = req.query;
    const response = await getPlaces(latLong, limit);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Bad request' });
  }
};

export default getCoffeeStoreByLocation;
