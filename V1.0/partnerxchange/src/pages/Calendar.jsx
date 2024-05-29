import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useProjectsContext } from '../context/ProjectsProvider';


function CalendarPage() {
    const localizer = dayjsLocalizer(dayjs)
    const token = localStorage.getItem('jwt');
    const [archive, setarchive] = useState([]);
    const { Projects, setProjects } = useProjectsContext();

    useEffect(() => {
        getUser()
    }, [])

    const getUser = async () => {

        let url = import.meta.env.VITE_REACT_APP_BASE_URL + "/leaderboard";
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
        // console.log(passedData);
        setarchive(passedData);
    }
    const [eventsList, seteventsList] = useState([]);
    useEffect(() => {
        console.log(archive);
        const events = archive.map(item => {
            if (item.ShiftHour == "Out Of Office") {
                
                return {
                    start: dayjs(JSON.parse(item.dateRange)[0]).toDate(),
                    end: dayjs(JSON.parse(item.dateRange)[1]).toDate(),
                    title: `OOO: ${item.user}`,
                    color: "red"
                };
            }
            if (item.ShiftHour == "On Call") {
                
                return {
                    start: dayjs(JSON.parse(item.dateRange)[0]).toDate(),
                    end: dayjs(JSON.parse(item.dateRange)[1]).toDate(),
                    title: `On Call: ${item.user}`,
                    color: "red"
                };
            }
        });
        const additionalEvents = Projects.map(item => {
            return {
                start: dayjs(item.GoLive, 'MMMM D, YYYY').toDate(),
                end: dayjs(item.GoLive, 'MMMM D, YYYY').toDate(),
                title: `${item.RequestID} RBTW GoLive By- ${item.ProjectLead.slice(1)}`,
            };
        });

        seteventsList(events.concat(additionalEvents))
    }, [archive, Projects]);
    const customEventPropGetter = event => {
        if (event.color === 'red') {
            return {
                className: 'text-red-500',
                style: {

                    color: '#FF0000' // This will change the text color to black
                },
            };
        } else {
            return {
                style: {
                    color: '#228B22' // This will change the text color to black

                }
            }
        }
    };

    return (
        <div className='flex flex-col h-screen p-16'>
            <Nav />
            <div className='mt-10 mx-20 pb-40'>
                <Calendar
                    localizer={localizer}
                    events={eventsList}
                    startAccessor="start"
                    endAccessor="end"
                    eventPropGetter={customEventPropGetter}
                    style={{ height: 500 }}
                />
            </div>
        </div>
    )
}

export default CalendarPage