const fetch = require('node-fetch');

async function queryGPT(query) {
  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.API_KEY}`
    },
    body: JSON.stringify({
      "model": "text-davinci-003",
      "prompt":  ( "I have a sample sql like this - SELECT * FROM \"marts\".\"content_base\". Similarly write an sql query on the same table and database. It has ( columns - entity, sources, pageviews, title, slug, publish_date, sports, scrollrate ) for the following question - " + query + ". Encode the table name and databse name in double quotes in encoded format add escape char for \" "),
      "temperature": 0.7,
      "max_tokens": 256,
      "top_p": 1,
      "frequency_penalty": 0,
      "presence_penalty": 0
    })
  });

  const data = await response.json();
  let generatedText = data.choices[0].text.trim();

  if (generatedText.endsWith(';')) {
    generatedText = generatedText.slice(0, -1);
  }

  const queryResponseRows = await fetch('https://twkdnlwj3jlmhljdy6tvja2dcu0dyilm.lambda-url.us-east-1.on.aws/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "query": generatedText
    })
  });

  const dataRes = await queryResponseRows.json();

  return dataRes;

  // return generatedText;
}

export default async function handler(req, res) {
  const reqData = JSON.parse(req.body)
  const query = reqData.query;
  const generatedText = await queryGPT(query);
  
  res.status(200).json({ response: generatedText });
}
