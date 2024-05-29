import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import LBsidebar from '../components/LBsidebar'
import { useLocation } from 'react-router-dom';
import LBAitems from '../components/LBAitems';
import dayjs from 'dayjs';

function LBarchive() {
  let location = useLocation();
  const token = localStorage.getItem('jwt');

  // console.log(location);
  const [archive, setarchive] = useState([]);
  useEffect(() => {
    getUser()
  }, [])

  const getUser = async () => {

    let url = import.meta.env.VITE_REACT_APP_BASE_URL + "/archive";
    console.log(url);
    let data = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Include the JWT in the Authorization header
        'Authorization': `Bearer ${token}`
      }
    });
    let passedData = await data.json();
    console.log(passedData);
    setarchive(passedData);
  }
  return (
    <div className='flex flex-col h-screen p-16'>
      <Nav />
      <div className='flex mt-10'>

        <div className="table basis-3/4">
          <div class="relative overflow-x-auto rounded mx-20">
            <table class="w-full text-sm text-left rtl:text-right  ">
              <thead class="text-xs  uppercase bg-[#0575e6] text-white font-light">
                <tr>
                  <th scope="col" class="px-6 py-3">
                    Date
                  </th>
                  <th scope="col" class="px-2 py-3">
                    Team Members
                  </th>
                  <th scope="col" class="px-2 py-3">
                    Shift Hours
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  archive.map((item) => {
                    let str = item.ShiftHour;
        
                    let timeArray = str.split("  ");
                    // Get the current date
                    let currentDate = dayjs()
                    // console.log(utcTime);
                    // Convert the second item to a Day.js object with the current date
                    let dayjsObject = dayjs(currentDate.format('YYYY-MM-DD') + ' ' + timeArray[1], "YYYY-MM-DD hh:mm A");
                    // console.log(dayjsObject);
            
                    // // If the time has already passed today, add 1 day to get the nearest upcoming time
                    if (dayjsObject.isBefore(currentDate)) {
                        console.log("pass");
                        
                        return <LBAitems data={item} />
                      }
                      else if (item.ShiftHour =="Out Of Office") {
                        
                        return <LBAitems data={item} />
                      }
                    })
                  }



              </tbody>
            </table>
          </div>
        </div>
        {/* <LBsidebar /> */}
      </div>
    </div>
  )
}

export default LBarchive