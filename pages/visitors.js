import Link from 'next/link'
import Head from 'next/head'
import clientPromise from '../lib/mongodb'

const Visitors = ({ visitors }) => (
    <>
    <table>
      <tr>
          <th> Time </th>
          <th> User Agent </th>
      </tr>
      {visitors.map((item) => (
        <tr>
            <td>{`${new Date(item.timestamp)}` }</td>
            <td>{item.user_agent}</td>
        </tr>
      ))}
    </table>
    <style jsx>{
    `
        th,
        td {
          border: 1px solid black;
          margin: 0px 0px;
          padding: 5px 5px;
        }
      `
      }</style>
    </>
  )
  
  /* Retrieves visitor data from mongodb database */
  export async function getServerSideProps(context) {
    const client = await clientPromise

    const database = client.db("insertDB");
    const visitors = database.collection("visitors");

    /* find all the data in our database */
    const cursor = await visitors.find({}).sort({"timestamp":1})
    if ((await cursor.count()) === 0) {
        console.log("No documents found!");
      }
      let result = []
      await cursor.forEach((doc) => {
          console.log(doc)
        result.push({
            timestamp: doc.timestamp,
            user_agent: doc.user_agent
        })
      });
      console.log(result)
    return { props: { visitors: result } }
  }
  
  export default Visitors
  