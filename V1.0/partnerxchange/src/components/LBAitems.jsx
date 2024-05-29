import React from 'react'

function LBAitems(props) {
    console.log(props);
    return (
        
            <tr class="bg-white border-b ">
                <th class="px-6 py-4 w-5 whitespace-nowrap" >
                    {props.data.date}
                </th>
                <td class="px-2 py-4 flex items-center ">
                    <img src={`/Avatar/` + props.data.pp} alt="" className='rounded-full w-10 h-10' />
                    <div className='ml-3'>{props.data.user}</div>

                </td>
                
                <td class="px-2 py-4 mt-0">
                    <div className="flex flex-col">
                        <div>{props.data.ShiftHour}</div>
                        {props.data.file?
                        <a className='text-xs text-[#0575E6] underline'href={props.data.file}>Approval</a>
                    :<></>}
                    </div>
                </td>
                
            </tr>

        
    )
}

export default LBAitems