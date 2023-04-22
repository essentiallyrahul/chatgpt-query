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
      "prompt": query,
      "temperature": 0.7,
      "max_tokens": 256,
      "top_p": 1,
      "frequency_penalty": 0,
      "presence_penalty": 0
    })
  });

  const data = await response.json();
  const generatedText = data.choices[0].text.trim();

  return generatedText;
}

export default async function handler(req, res) {
  const reqData = JSON.parse(req.body)
  const query = reqData.query;
  const generatedText = await queryGPT(query);
  
  res.status(200).json({ response: generatedText });
}
