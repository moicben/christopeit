import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      // Récupérer toutes les entrées de la table payments
      const { data, error, status } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payments from Supabase:', error);
        return res.status(status || 500).json({ error: error.message });
      }

      res.status(200).json({ payments: data });
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};