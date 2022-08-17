import { findRecordByFilter } from '../../utils/airtable';

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;
  try {
    if (!id) {
      return res.status(406).json({ message: 'field id is missing' });
    }
    const record = await findRecordByFilter(id);
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default getCoffeeStoreById;
