import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [text, setText] = useState('')
  const [ans, setAns] = useState()

  const fetchData = async () => {
    try {
      const response = await fetch('api/query', {
        method: 'POST',
        body: JSON.stringify({
          query: text
        })
      })

      if(response.status===200){

        const data = await response.json()

        const responseData = Array.isArray(data.response)
          ? data.response.map((item, index) => index!==0 ? item.Data[0].VarCharValue: '')
          : [data.response.Data[0].VarCharValue]

        setAns(responseData.map(val => <div style={{whiteSpace: 'pre-wrap'}}>{val}</div>))

      }else{
        alert("Please Try with someother question")
      }


    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleTextChange = (event) => {
    setText(event.target.value)
  }

  const handleButtonClick = () => {
    fetchData()
  }

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '100px'
          }}
        >
          Enter your query
          <textarea
            style={{ marginTop: '30px', width: '400px', height: '200px' }}
            value={text}
            onChange={handleTextChange}
          />
          <button style={{ marginTop: '30px' }} onClick={handleButtonClick}>
            Submit
          </button>
          {ans && (
            <div>
              <p>Your answer is : </p>
              {ans}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
