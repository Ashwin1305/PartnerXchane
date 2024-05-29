import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import OBAitems from '../components/OBAitems';
import PAitems from '../components/PAitems';

function ProjArchive() {
    const token = localStorage.getItem('jwt');

    const [archive, setarchive] = useState([]);
    const getArchive = async () => {

        let url = import.meta.env.VITE_REACT_APP_BASE_URL + "/pj/archive";
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
                                    <th scope="col" class="bg-[#0575e6] sticky top-0 px-6 py-3 whitespace-nowrap">
                                        Request ID
                                    </th>
                                    <th scope="col" class="bg-[#0575e6] sticky top-0 px-6 py-3">
                                        Customer
                                    </th>
                                    <th scope="col" class="bg-[#0575e6] sticky top-0 px-6 py-3 whitespace-nowrap">
                                        Customer Code
                                    </th>
                                    <th scope="col" class="bg-[#0575e6] sticky top-0 px-3 py-3">
                                        Jira
                                    </th>
                                    <th scope="col" class="bg-[#0575e6] sticky top-0 px-9 py-3">
                                        Severity
                                    </th>
                                    <th scope="col" class="bg-[#0575e6] sticky top-0 px-6 py-3 whitespace-nowrap">
                                        Projected Go Live
                                    </th>
                                    <th scope="col" class="bg-[#0575e6] sticky top-0 px-6 py-3 whitespace-nowrap">
                                        Carrier Onboarding
                                    </th>
                                    <th scope="col" class="bg-[#0575e6] sticky top-0 px-9 py-3 whitespace-nowrap">
                                        Project Lead
                                    </th>
                                    <th scope="col" class="bg-[#0575e6] sticky top-0 px-9 py-3">
                                        Environment
                                    </th>
                                    <th scope="col" class="bg-[#0575e6] sticky top-0 px-9 py-3 whitespace-nowrap">
                                        Dev Environment
                                    </th>
                                    <th scope="col" class="bg-[#0575e6] sticky top-0 px-9 py-3 whitespace-nowrap">
                                        QA Environment
                                    </th>
                                    <th scope="col" class="bg-[#0575e6] sticky top-0 px-9 py-3">
                                        Production
                                    </th>
                                    <th scope="col" class=" bg-[#0575e6] sticky top-0 px-3 py-3 whitespace-nowrap">
                                        Go Live
                                    </th>
                                    <th scope="col" class=" bg-[#0575e6] sticky top-0 px-6 py-3 whitespace-nowrap">
                                        EDI Version
                                    </th>
                                    <th scope="col" class=" bg-[#0575e6] sticky top-0 px-6 py-3 whitespace-nowrap">
                                        EDI Message Type
                                    </th>
                                    <th scope="col" class=" bg-[#0575e6] sticky top-0 px-6 py-3 whitespace-nowrap">
                                        By Remark
                                    </th>
                                    <th scope="col" class=" bg-[#0575e6] sticky top-0 px-6 py-3 whitespace-nowrap">
                                        Notes
                                    </th>
                                    <th scope="col" class=" bg-[#0575e6] sticky top-0 px-6 py-3 whitespace-nowrap">
                                    Mapping Specification
                                    </th>

                                </tr>
                            </thead>
                            <tbody>
                                {archive.map((item) => <PAitems data={item} />)}



                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjArchive