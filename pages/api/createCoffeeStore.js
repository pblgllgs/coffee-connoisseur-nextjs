import { findRecordByFilter, table } from '../../utils/airtable';
import { normalizeRecords } from '../../utils/normalize';

const createCoffeeStore = async (req, res) => {
  if (req.method === 'POST') {
    const { id, name, neighbourhood, address, imgUrl, voting } = req.body;

    try {
      if (!id) {
        return res.status(406).json({ message: 'field id is missing' });
      }
      const records = await findRecordByFilter(id);
      if (records.length !== 0) {
        return res.json(records);
      } else {
        if (!name) {
          return res.status(406).json({ message: 'field name is missing' });
        }
        const createRecord = await table.create([
          {
            fields: {
              id,
              name,
              address,
              neighbourhood,
              voting,
              imgUrl
            }
          }
        ]);
        const records = normalizeRecords(createRecord);
        res.status(201).json(records);
      }
    } catch (error) {
      console.log({ error });
      res.status(400).json({ message: 'Bad Request, error, revidsar logs' });
    }
  }
};

export default createCoffeeStore;
