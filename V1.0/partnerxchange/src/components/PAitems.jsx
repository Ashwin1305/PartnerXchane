import React, { useState } from 'react'

export default function PAitems(props) {
    const [byRemarkdilogbox, setbyRemarkdilogbox] = useState("scale-0");
    const [Notesdilogbox, setNotesdilogbox] = useState("scale-0");

    return (<>
        <div className={byRemarkdilogbox}>

            <div className="bg-opacity-20 backdrop-blur-sm bg-black h-screen w-screen fixed z-30 top-0 left-0 flex items-center justify-center">
                <div className="bg-white w-full  border-2 mx-52 rounded flex flex-col items-end">
                    <button onClick={() => setbyRemarkdilogbox("scale-0")} className='justify-right mx-4'>x</button>
                    <div className="flex items-start w-full p-4">
                        <div className="flex flex-col items-start w-full h-52 overflow-auto">
                            {props.data.BYRemark ? JSON.parse(props.data.BYRemark).notes.map((item) => (

                                <div className='border-2 my-2 p-2 w-full'>{item}</div>

                            )) : <>

                                <div className='font-bold my-2 p-2 w-full'></div>
                            </>}

                        </div>


                    </div>
                </div>
            </div>
        </div>
        <div className={Notesdilogbox}>

            <div className="bg-opacity-20 backdrop-blur-sm bg-black h-screen w-screen fixed z-30 top-0 left-0 flex items-center justify-center">
                <div className="bg-white w-full  border-2 mx-52 rounded flex flex-col items-end">
                    <button onClick={() => setNotesdilogbox("scale-0")} className='justify-right mx-4'>x</button>
                    <div className="flex items-start w-full p-4">
                        <div className="flex flex-col items-start w-full h-52 overflow-auto">
                            {props.data.Notes ? JSON.parse(props.data.Notes).notes.map((item) => (

                                <div className='border-2 my-2 p-2 w-full'>{item}</div>

                            )) : <>

                                <div className='font-bold my-2 p-2 w-full'></div>
                            </>}

                        </div>


                    </div>
                </div>
            </div>
        </div>
        <tr class="bg-white text-left border-b ">
            <td scope="row" class="px-6 py-4">
                {props.data.RequestID}
            </td>
            <td scope="row" class="px-6 py-4 whitespace-nowrap">
                {props.data.Customer}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                {props.data.CustomerCode}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                {props.data.Jira}
            </td>
            <td class="px-9 py-4 whitespace-nowrap">
                {props.data.Severity}
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
                {props.data.ProjectedGoLive}
            </td>

            <td class="px-6 py-4">
                0
            </td>

            <td class="px-9 py-4 whitespace-nowrap">
                {props.data.ProjectLead.slice(1)}
            </td>
            <td class="px-9 py-4 whitespace-nowrap">
                {props.data.Environment}

            </td>
            <td class="px-9 py-4 whitespace-nowrap">
                {props.data.DevEnviornment}
            </td>
            <td class="px-9 py-4 whitespace-nowrap">
                {props.data.QAEnviornment}
            </td>
            <td class="px-9 py-4 whitespace-nowrap">
                {props.data.Production}
            </td>
            <td class="px-3 py-4 whitespace-nowrap">
                {props.data.GoLive}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                {props.data.EDIVersion.slice(1)}

            </td>
            <td class="px-6 py-4 ">
                {props.data.EDIMessageType.slice(1)}

            </td>
            <td class="">
                <div className=" px-6 h-full flex items-center justify-center ">

                    <button onClick={() => setbyRemarkdilogbox("")}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>


            </td>
            <td class="">
                <div className=" px-6 h-full flex items-center justify-center ">

                    <button onClick={() => setNotesdilogbox("")}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>


            </td>
            <td class="px-6 py-4 ">
                {props.data.MappingSpecification ?
                    <a href={props.data.MappingSpecification} className='text-[#0575E6] underline'>
                        {props.data.MappingSpecification.substring(props.data.MappingSpecification.lastIndexOf("/") + 1)}
                    </a>
                    : <></>}

            </td>
            <td className="pr-4">


            </td>
        </tr></>
    )
}
