import { createClient } from 'next-sanity';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: 'cymt4nd7',
  dataset: 'production',
  apiVersion: '2025-04-16',
  useCdn: false,
  token: process.env.SANITY_API_READ_TOKEN,
});

async function main() {
  const projects = await client.fetch('*[_type == "project"] { "id": id.current, title, featured }');
  console.log(JSON.stringify(projects, null, 2));
}

main().catch(console.error);
