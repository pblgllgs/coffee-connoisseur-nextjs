import Airtable from 'airtable';
import { normalizeRecords } from '../../utils/normalize';

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);

const table = base('coffee-store');

const createCoffeeStore = async (req, res) => {
  if (req.method === 'POST') {
    const { id, name, neighbourhood, address, imgUrl, voting } = req.body;

    try {
      if (!id) {
        return res.status(406).json({ message: 'field id is missing' });
      }
      const findCoffeeStoreRecords = await table
        .select({
          filterByFormula: `id="${id}"`
        })
        .firstPage();
      if (findCoffeeStoreRecords.length !== 0) {
        const records = normalizeRecords(findCoffeeStoreRecords);

        res.json(records);
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
