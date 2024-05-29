import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import OBAitems from '../components/OBAitems';

function OBarchive() {
    const token = localStorage.getItem('jwt');

    const [archive, setarchive] = useState([]);
    const getArchive = async () => {

        let url = import.meta.env.VITE_REACT_APP_BASE_URL + "/ob/archive";
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

        setarchive(passedData);
    }
    useEffect(() => {
        getArchive()
    }, []);
    return (
        <div className='flex flex-col h-screen p-16'>
            <Nav />
            <div className='flex mt-10'>

                <div class=" relative min-h-2/3 overflow-x-auto rounded">
                    <div>
                        <table class="table-auto w-full text-sm text-left rtl:text-right  ">
                            {/* <table class="w-full text-sm text-left rtl:text-right  "> */}
                            <thead class="text-xs  uppercase bg-[#0575e6] text-white font-light">
                                <tr>
                                    <th scope="col" class="px-6 py-3 whitespace-nowrap">
                                        Request ID
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Customer
                                    </th>
                                    <th scope="col" class="px-6 py-3 whitespace-nowrap">
                                        Carrier Name
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        SCAC
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Phase
                                    </th>
                                    
                                    <th scope="col" class="px-6 py-3">
                                        Ticket
                                    </th>
                                    <th scope="col" class="px-6 py-3 whitespace-nowrap">
                                        TP Specialist
                                    </th>
                                    <th scope="col" class="px-9 py-3 whitespace-nowrap">
                                        Action Owner
                                    </th>
                                    <th scope="col" class="px-9 py-3 whitespace-nowrap">
                                        CQ Validation
                                    </th>
                                    <th scope="col" class="px-9 py-3 whitespace-nowrap">
                                        Trading Partner Setup
                                    </th>
                                    <th scope="col" class="px-9 py-3 whitespace-nowrap">
                                        SFTP Testing
                                    </th>
                                    <th scope="col" class="px-6 py-3">
                                        Testing
                                    </th>
                                    <th scope="col" class="px-9 py-3 whitespace-nowrap">
                                        Go Live
                                    </th>
                                    <th scope="col" class="px-6 py-3 whitespace-nowrap">
                                        BY Remarks
                                    </th>
                                    <th scope="col" class="px-6 py-3 whitespace-nowrap">
                                        Notes
                                    </th>
                                    <th scope="col" class="px-6 py-3 whitespace-nowrap">

                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {archive.map((item) => <OBAitems data={item}/>)}



                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OBarchive