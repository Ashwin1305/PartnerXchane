import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs';
import { useUserContext } from '../context/UserProvider';
import { useOBContext } from '../context/OBProvider';
import { useProjectsContext } from '../context/ProjectsProvider';
import { CSVLink } from "react-csv";
import { jwtDecode } from "jwt-decode";

function Nav(props) {
    
    const token = localStorage.getItem('jwt');
    const { Users, setUsers } = useUserContext();
    const { OB, setOB } = useOBContext();
    const { Projects, setProjects } = useProjectsContext();

    const [Notification, setNotification] = useState([]);
    const [notiState, setnotiState] = useState("scale-0 ");
    const [OBno, setOBno] = useState([]);
    const [OBList, setOBList] = useState([]);
    let location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        // const token = "eyJ0eXAiO.../// jwt token";
        const decoded = jwtDecode(token);

        // console.log(decoded);
        localStorage.setItem('type', decoded.type)
        localStorage.setItem('name', decoded.name)
        localStorage.setItem('pp', decoded.pp)
        localStorage.setItem('id', decoded.id)

    });
    const getNotification = async () => {

        let url = import.meta.env.VITE_REACT_APP_BASE_URL + "/getNoti/" + localStorage.getItem('name');
        let data = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Include the JWT in the Authorization header
                'Authorization': `Bearer ${token}`
            }
        });
        let passedData = await data.json();
        setNotification(passedData.reverse());
    }
    const getmaxOB = async () => {

        let url = import.meta.env.VITE_REACT_APP_BASE_URL + "/leaderboard/" + localStorage.getItem('name');
        let data = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Include the JWT in the Authorization header
                'Authorization': `Bearer ${token}`
            }
        });
        let passedData = await data.json();
        // console.log(passedData);
        setOBno(passedData);
    }
    const getOBn = async () => {

        let url = import.meta.env.VITE_REACT_APP_BASE_URL + "/getOB/" + localStorage.getItem('name');
        let data = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Include the JWT in the Authorization header
                'Authorization': `Bearer ${token}`
            }
        });
        let passedData = await data.json();
        setOBList(passedData);
    }

    const getUser = async () => {
        let url = import.meta.env.VITE_REACT_APP_BASE_URL + "/leaderboard";
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Include the JWT in the Authorization header
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 403) {
            // Use navigate function to redirect to "/"
            navigate("/login");
            window.location.reload()
        } else {
            let passedData = await response.json();
            setUsers(passedData);
            console.log();
        }
    }
    const getOB = async () => {

        let url = import.meta.env.VITE_REACT_APP_BASE_URL + "/getOB";
        let data = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Include the JWT in the Authorization header
                'Authorization': `Bearer ${token}`
            }
        });
        let passedData = await data.json();
        setOB(passedData.reverse());
        // console.log(OB);
    }
    const getProjects = async () => {

        let url = import.meta.env.VITE_REACT_APP_BASE_URL + "/projects";
        let data = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Include the JWT in the Authorization header
                'Authorization': `Bearer ${token}`
            }
        });
        let passedData = await data.json();
        setProjects(passedData.reverse());
    }
    useEffect(() => {
        if (localStorage.getItem('auth')) {
            // console.log("login sucess")

        } else {
            navigate("/login")

        }
        getOB()
        getUser()
        getProjects()
        getNotification()
        getmaxOB()
        getOBn()
    }, [])

    function newProject() {
        props.settoggleNewProject("")
    }
    function newRequest() {
        props.settoggleNewRequest("")
    }
    function notiStateChange() {
        if (notiState == "") {
            setnotiState("scale-0 ")
        } else {
            setnotiState("")

        }
    }
    function menuStateChange() {
        if (menuBar == "") {
            setmenuBar("scale-0 ")
        } else {
            setmenuBar("")

        }
    }
    const [menuBar, setmenuBar] = useState("scale-0 ");
    function clearNoti() {
        const idArray = Notification.map(item => item.id);

        fetch(import.meta.env.VITE_REACT_APP_BASE_URL + '/deleteNotifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ ids: idArray }),
        })
            .then(response => response.text())
            .then(() => window.location.reload())
            .catch((error) => {
                console.error('Error:', error);
            });


    }
    const ref = useRef();
    const ref2 = useRef();

    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                // Your code to close the popup
                setnotiState("scale-0 ")
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref2.current && !ref2.current.contains(event.target)) {
                // Your code to close the popup
                setmenuBar("scale-0 ")
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref2]);
    return (
        <div>

            <div className="flex justify-between py-2">

                <div className='flex items-center text-xl font-semibold justify-between '>
                    <div className="btn cursor-pointer" >

                        <img src="/menuIcon.png" alt="" srcSet="" className='w-10 ' onClick={menuStateChange} />
                        <div className={menuBar} ref={ref2}>

                            <div className="absolute flex z-[45] w-48 bg-white font-semibold rounder flex-col border-2 p-4 text-sm pb-8">
                                {location.pathname == "/" || location.pathname == "/archive" ?
                                    <div className="flex items-center h-8 ">
                                        <span className="relative rounded-full h-2 w-2 mr-5 bg-[#0575e6]"></span>
                                        <Link to="/" className=" ">Onboarding</Link>
                                    </div>
                                    :
                                    <div className="flex items-center h-8 ">
                                        <span className="relative rounded-full h-2 w-2 mr-5 "></span>
                                        <Link to="/" className=" ">Onboarding</Link>
                                    </div>}
                                {location.pathname == "/projects" || location.pathname == "/projects/archive" ?
                                    <div className="flex items-center h-8 ">
                                        <span className="relative rounded-full h-2 w-2 mr-5 bg-[#0575e6]"></span>
                                        <Link to="/projects" className=" ">Projects</Link>
                                    </div>
                                    :
                                    <div className="flex items-center h-8 ">
                                        <span className="relative rounded-full h-2 w-2 mr-5 "></span>
                                        <Link to="/projects" className=" ">Projects</Link>
                                    </div>}
                                {location.pathname == "/leaderboard" || location.pathname == "/leaderboard/archive" ?
                                    <div className="flex items-center h-8 ">
                                        <span className="relative rounded-full h-2 w-2 mr-5 bg-[#0575e6]"></span>
                                        <Link to="/leaderboard" className=" ">Leaderboard</Link>
                                    </div>
                                    :
                                    <div className="flex items-center h-8 ">
                                        <span className="relative rounded-full h-2 w-2 mr-5 "></span>
                                        <Link to="/leaderboard" className=" ">Leaderboard</Link>
                                    </div>}
                                {/* {location.pathname == "/calendar"?
                                    <div className="flex items-center h-8 ">
                                        <span className="relative rounded-full h-2 w-2 mr-5 bg-[#0575e6]"></span>
                                        <Link to="/calendar" className=" ">Calendar</Link>
                                    </div>
                                    :
                                    <div className="flex items-center h-8 ">
                                        <span className="relative rounded-full h-2 w-2 mr-5 "></span>
                                        <Link to="/calendar" className=" ">Calendar</Link>
                                    </div>} */}
                                <button onClick={() => { localStorage.clear(); navigate("/login") }} className="text-left ml-[29px] h-8 text-red-500">Logout</button>
                            </div>
                        </div>
                    </div>

                    {location.pathname == "/" || location.pathname == "/archive" ?
                        <Link to="/" className="mx-2 duration-100 border-[#0575e6] ">Onboarding</Link> :
                        <></>}
                    {location.pathname == "/projects" || location.pathname == "/projects/archive" ?
                        <Link to="/projects" className="mx-2  focus:border-b-4 duration-100 border-[#0575e6]">Projects</Link> :
                        <></>}
                    {location.pathname == "/leaderboard" || location.pathname == "/leaderboard/archive" ?
                        <Link to="/leaderboard" className="mx-4 focus:border-b-4 duration-100 border-[#0575e6]">Leaderboard</Link> :
                        <></>}
                    {location.pathname == "/calendar" ?
                        <Link to="/Calendar" className="mx-4 focus:border-b-4 duration-100 border-[#0575e6]">Calendar</Link> :
                        <></>}





                    <div className=" grow flex justify-start items-center mr-10">
                        {location.pathname == "/leaderboard" ? <Link to={"/leaderboard/archive"} className='flex items-center justify-center  mx-2 border-2 h-8 w-8 border-black rounded-full'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                            </svg>

                        </Link> : <> </>}
                        {location.pathname == "/leaderboard/archive" ? <Link to={"/leaderboard"} className='flex items-center justify-center  mx-2 border-2 h-8 w-8 border-black rounded-full'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                            </svg>

                        </Link> : <> </>}
                        {location.pathname == "/" || location.pathname == "/projects" ?
                            <input
                                type="text"
                                placeholder="Search..."
                                value={props.searchTerm}
                                onChange={e => props.setSearchTerm(e.target.value)}
                                className='py-1 px-4 text-sm font-normal border-[#0575e6] border-2 my-1 mx-2 rounded-full justify-end'
                            /> : <></>}
                        {location.pathname == "/" ? <Link to={"/archive"} className='flex items-center justify-center  mx-2 border-2  w-8 h-8 border-black rounded-full'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                            </svg>

                        </Link> : <> </>}
                        {location.pathname == "/archive" ? <button disabled className='flex items-center justify-center  mx-2 border-2 h-8 w-8 border-black rounded-full'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                            </svg>

                        </button> : <> </>}
                        {location.pathname == "/projects" ? <Link to={"/projects/archive"} className='flex items-center justify-center  mx-2 border-2 h-8 w-8 border-black rounded-full'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                            </svg>

                        </Link> : <> </>}
                        {location.pathname == "/projects/archive" ? <button disabled className='flex items-center justify-center  mx-2 border-2 h-8 w-8 border-black rounded-full'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                            </svg>

                        </button> : <> </>}


                        {location.pathname == "/leaderboard" && localStorage.getItem('type') == "admin" ?
                            <Link to={"/newuser"} onClick={newProject} className="rounded-full border-2 mx-2 flex items-center h-8 w-8 justify-center border-black">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>

                            </Link> : <></>}
                        {location.pathname == "/" || location.pathname == "/projects" ?
                            <button className="rounded-full border-2 flex items-center h-8 w-8 justify-center border-black mx-2">
                                <CSVLink data={props.expJSON}>

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                </CSVLink>


                            </button>

                            : <></>}
                        {location.pathname == "/projects" && localStorage.getItem('type') == "admin" ?
                            <button onClick={newProject} className="rounded-full mx-2 border-2 flex items-center h-8 w-8 justify-center border-black">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>

                            </button> : <></>}
                        {location.pathname == "/" ?
                            <button onClick={newRequest} className="rounded-full border-2 mx-2 flex items-center h-8 w-8 justify-center border-black">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>

                            </button>

                            : <></>}
                    </div>
                </div>
                <div className="profile flex items-center justify-center" ref={ref}>
                    <Link to="/calendar" className="w-9 flex pt-2 items-center justify-center mx-1">
                        <img src="\calendar.jpg" alt="" srcSet="" />
                    </Link>
                    <button className="p-2 mx-2 px-0 " onClick={notiStateChange}>
                        <div className="flex">

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 mt-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5" />
                            </svg>
                            <span className="absolute flex h-2 w-2 translate-x-6	-translate-y-1 ">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 z-4 bg-red-500"></span>
                            </span>
                        </div>
                        <div className={notiState}>
                            <div className="absolute z-50 right-56 text-black bg-white w-96  rounded drop-shadow-lg">
                                <div className="px-6 py-8 flex flex-col">
                                    <div className="flex  mb-2">

                                        <div className="font-semibold text-lg  text-left">Notification</div>
                                        <button onClick={clearNoti} className='text-sm text-red-500 ml-4 mt-1' >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>

                                        </button>
                                    </div>
                                    <div className="text-sm font-light relative whitespace-nowrap overflow-x-auto max-h-[100px] max-w-full scroll-smooth text-left">
                                        {Notification.map((item,index) => (
                                            <div className='my-1' key={index}>{item.msg}</div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </button>
                    <div className="mx-2">
                        <div className="mt-2 p-0  whitespace-nowrap font-semibold text-xl">
                            {localStorage.getItem('name')}
                        </div>

                    </div>

                    <div className='mx-2'>
                        <img src={`/Avatar/` + localStorage.getItem('pp')} alt="" className='w-12 rounded-full ' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Nav