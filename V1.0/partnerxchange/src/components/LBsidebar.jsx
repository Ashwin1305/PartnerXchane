import React from 'react'

function LBsidebar(props) {
  return (
    
        <div className="sidebar basis-1/4 mx-4 text-sm font-semibold text-gray-500">
                        <div className=" bg-[#F8F8F8] px-6 py-4 w-full h-32 rounded-lg">
                            <img src="\Icons\LeaderBoard (1).png" alt="" className='h-10 w-10' />
                            <div className="flex py-2 justify-between">
                                <div className="whitespace-nowrap ">Total Team Members</div>
                                <div className=" ">{props.Users.length}</div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 ">
                                <div className="bg-[#399BFE] h-4 rounded-full" ></div>
                            </div>
                        </div>
                        <div className="mt-8 bg-[#F8F8F8] py-4 px-6 w-full h-32 rounded-lg">
                            <img src="\Icons\LeaderBoard (2).png" alt="" className='h-10 w-10' />
                            <div className="flex py-2 justify-between">
                                <div className="whitespace-nowrap ">Total Onboarding</div>
                                <div className=" ">{props.OB.length}</div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 ">
                                <div className="bg-[#79F39B] h-4 rounded-full" ></div>
                            </div>
                        </div>
                        <div className="mt-8 bg-[#F8F8F8] py-4 px-6 w-full h-32 rounded-lg">
                            <img src="\Icons\LeaderBoard (3).png" alt="" className='h-10 w-10' />
                            <div className="flex py-2 justify-between">
                                <div className="whitespace-nowrap">Total Projects</div>
                                <div className="">{props.Projects.length}</div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 ">
                                <div className="bg-[#FF7A67] h-4 rounded-full" ></div>
                            </div>
                        </div>
                    </div>
    
  )
}

export default LBsidebar