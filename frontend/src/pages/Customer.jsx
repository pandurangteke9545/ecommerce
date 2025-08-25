import React from 'react'
import { useEffect } from 'react'
import api from '../api/api'
import { useState } from 'react'

function Customer() {

    const [customer , setCustomers] = useState([])

    async function getUser(){
        try {
             const responce = await api.get("/user/cutomers")
            console.log(responce.data.data)
            setCustomers(responce.data.data)
            
        } catch (error) {
            console.log("error",error)
        } 
    }
       
    useEffect(()=>{
            getUser()
        },[])

  return (
    <div className="flex flex-col justify-center items-center p-6">
  <h1 className="m-5 p-5 text-4xl font-bold text-blue-600">
    Customers Data
  </h1>

  <div className="overflow-x-auto w-full max-w-4xl shadow-lg rounded-2xl">
    <table className="min-w-full border-collapse bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
      <thead className="bg-blue-600 text-white dark:bg-blue-700">
        <tr>
          <th className="px-6 py-3 text-left text-sm font-semibold">User ID</th>
          <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
          <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
        </tr>
      </thead>
      <tbody>
        {customer.map((ele, index) => (
          <tr
            key={ele._id}
            className={`${
              index % 2 === 0
                ? "bg-gray-100 dark:bg-gray-700"
                : "bg-white dark:bg-gray-800"
            } hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors`}
          >
            <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-300 dark:border-gray-600">
              {ele._id}
            </td>
            <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-300 dark:border-gray-600">
              {ele.name}
            </td>
            <td className="px-6 py-3 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-300 dark:border-gray-600">
              {ele.email}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  )
}

export default Customer
