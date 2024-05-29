import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import OBitems from '../components/OBitems'
import * as Yup from 'yup';
import Select from 'react-select';
import dayjs from 'dayjs';
import { useUserContext } from '../context/UserProvider';
import { useOBContext } from '../context/OBProvider';
import { useProjectsContext } from '../context/ProjectsProvider';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { useLocation } from 'react-router-dom';

let now = dayjs();
function Home() {
    const day = now.format("mmss")
    const token = localStorage.getItem('jwt');
    const [RequestID, setRequestID] = useState(day);
    const [Customer, setCustomer] = useState("");
    const [CarrierName, setCarrierName] = useState();
    const [SCAC, setSCAC] = useState();
    const [Phase, setPhase] = useState("");
    const [TicketNumber, setTicketNumber] = useState();

    const { Users, setUsers } = useUserContext();
    const { OB, setOB } = useOBContext();
    const { Projects, setProjects } = useProjectsContext();
    const [EDIList, setEDIList] = useState([]);
    const [EDIMsgSelectList, setEDIMsgSelectList] = useState([]);
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState([]);
    const [TestingJSON, setTestingJSON] = useState({});

    useEffect(() => {
        // Load options here

        let opt = []
        for (let i = 0; i < EDIList.length; i++) {
            opt.push({ value: EDIList[i], label: EDIList[i] })

        }
        setOptions(opt);
    }, [EDIList]);

    const [SFTP, setSFTP] = useState("Pending");
    const [goLive, setgoLive] = useState("Pending");
    const [TestingIFTMIN, setTestingIFTMIN] = useState("Pending");
    const [TestingIFTSTA, setTestingIFTSTA] = useState("Pending");
    const [TradingPartnerSetup, setTradingPartnerSetup] = useState("Pending");
    useEffect(() => {
        const date1 = dayjs()
        const date2 = dayjs()




        var dev = dayjs(date1).add(7, 'day');
        setSFTP("Pending");
        setgoLive("Pending");
        setTradingPartnerSetup("Pending")
        // setTestingIFTMIN(d10.format('ll'))
        // setTestingIFTSTA(d14.format('ll'))
        var d10 = dayjs(date1).add(10, 'day');
        var d14 = dayjs(date1).add(14, 'day');
        var d5 = dayjs(date1).add(5, 'day');
        var d7 = dayjs(date1).add(7, 'day');
        var d12 = dayjs(date1).add(12, 'day');

        var t = []
        for (let i = 0; i < EDIMsgSelectList.length; i++) {

            t.push({ name: [EDIMsgSelectList[i]], value: "Pending" })

        }
        setTestingJSON(t)




    }, [Phase, EDIMsgSelectList]);
    const [errors, seterrors] = useState("");
    const validationSchema = Yup.object().shape({
        RequestID: Yup.string().required('RequestID is required'),
        Customer: Yup.string().required('Customer is required'),
        CarrierName: Yup.string()
            .matches(/^[a-zA-Z0-9\s]*$/, 'No special characters allowed')
            .required('Enter Value'),
        SCAC: Yup.string()
            .matches(/^[a-zA-Z0-9\s]{1,4}$/, 'No special characters allowed and max 4 letters')
            .required('Enter Value'),
        Phase: Yup.string().required('Phase is required'),
        TicketNumber: Yup.string().required('TicketNumber is required'),
        TPSpecialist: Yup.string().required('TPSpecialist is required'),
        IPOwner: Yup.string().required('IPOwner is required'),
        SFTP: Yup.string().required('SFTP is required'),
        // Testing204: Yup.string().required('Testing204 is required'),
        // TestingIFTMIN: Yup.string().required('stingIFTMIN is required'),
        // TestingIFTSTA: Yup.string().equired('TestingIFTSTA is required'),
        GoLive: Yup.string().required('GoLive is required'),
        TestingJSON: Yup.string().required('TestingJSON is required'),
        TradingPartnerSetup: Yup.string().required('TradingPartnerSetup is required')
    });

    function newRequest() {

        validationSchema.validate({
            RequestID: RequestID,
            Customer: Customer,
            CarrierName: CarrierName,
            SCAC: SCAC,
            Phase: Phase,
            TicketNumber: TicketNumber,
            TPSpecialist: localStorage.getItem('name'),
            IPOwner: localStorage.getItem('name'),
            SFTP: SFTP,
            GoLive: goLive,
            TestingJSON: JSON.stringify(TestingJSON),
            TradingPartnerSetup: TradingPartnerSetup
        }, { abortEarly: false })
            .then(() => {
                toast("New Request", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "light"
                })
                fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/newRequest", {
                    method: 'POST',
                    body: JSON.stringify({
                        RequestID: RequestID + SCAC,
                        Customer: Customer,
                        CarrierName: CarrierName,
                        SCAC: SCAC,
                        Phase: Phase,
                        TicketNumber: TicketNumber,
                        TPSpecialist: localStorage.getItem('name'),
                        IPOwner: localStorage.getItem('name'),
                        SFTP: SFTP,
                        Testing204: "ETA: 01 APR 24",
                        TestingIFTMIN: TestingIFTMIN,
                        TestingIFTSTA: TestingIFTSTA,
                        GoLive: goLive,
                        TestingJSON: JSON.stringify(TestingJSON),
                        TradingPartnerSetup: TradingPartnerSetup,

                        disabledArray: JSON.stringify(new Array(21).fill(true))
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Authorization': `Bearer ${token}`

                    },
                })
                    .then((response) => response.json())

                fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/newNoti", {
                    method: 'POST',
                    body: JSON.stringify({
                        userID: localStorage.getItem('name'),
                        msg: `${now.format("mmss") + SCAC} has been assigned to you by ${localStorage.getItem('name')}`,
                        assignedBY: localStorage.getItem('name')
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Authorization': `Bearer ${token}`

                    },
                })
                    .then((response) => window.location.reload(false))
            })
            .catch((error) => {
                // Handle validation errors here
                if (error instanceof Yup.ValidationError) {
                    // Handle validation error
                    // console.error('Validation error:', error.errors);
                    seterrors('Validation error: ' + error.errors);
                } else {
                    // Handle other errors (e.g., network errors)
                    // console.error('Error:', error.message);
                    seterrors('Error:', error.message);
                }
            });
        // window.location.reload(false);


    }
    useEffect(() => {
        {
            for (let i = 0; i < Projects.length; i++) {
                if (Projects[i].Customer == Customer) {
                    setEDIList(Projects[i].EDIMessageType.split(","))
                }

            }


        }

    }, [Customer]);


    function handleSubmit() {
        newRequest()
    }

    const [toggleNewRequest, settoggleNewRequest] = useState("hidden");
    const [toggleFileUpload, settoggleFileUpload] = useState("hidden");
    const [file, setFile] = useState(null);
    const [setTime, setsetTime] = useState("");
    const [fileUploadSync, setfileUploadSync] = useState(false);
    const FileUploadSchema = Yup.object().shape({
        file: Yup.mixed().required('No file selected')
    });
    const [fileUploadError, setfileUploadError] = useState("");
    const submitFile = async (newFileName) => {
        // event.preventDefault();

        const formData = new FormData();
        try {
            await FileUploadSchema.validate({ file });
            toast("Uploading", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: false,
                draggable: false,
                progress: undefined,
                theme: "light",
            })
            formData.append('file', file, newFileName);
        } catch (error) {
            // Handle validation errors here
            if (error instanceof Yup.ValidationError) {
                // Handle validation error
                // console.error('Validation error:', error.errors);
                setfileUploadError('Validation error: ' + error.errors);
            } else {
                // Handle other errors (e.g., network errors)
                // console.error('Error:', error.message);
                setfileUploadError('Error:', error.message);
            }
            return;
        }
        await axios.post(import.meta.env.VITE_REACT_APP_BASE_URL + '/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then((res) => {
            // console.log(res)

            window.location.reload()
            settoggleFileUpload("hidden")
        })

    }
    const handleFileUpload = (event) => {
        setFile(event.target.files[0]);
        // console.log(setTime);

    };
    async function handlheSubmit() {
        const publicUrl = `https://storage.googleapis.com/partnerxchange/${setTime}`;

        // console.log(publicUrl);
        await submitFile(setTime)

    }
    function exportCSV(params) {

    }
    const [expJSON, setexpJSON] = useState([]);
    const [filteredData, setfilteredData] = useState([]);
    useEffect(() => {
        let templist = []
        for (let i = 0; i < OB.length; i++) {
            // console.log(i,expJSON);
            // console.log(OB[i]);
            let BYRemarklist = [];
            if (OB[i].BYRemarks) {

                for (let k = 0; k < JSON.parse(OB[i].BYRemarks).notes.length; k++) {
                    BYRemarklist.push(JSON.parse(OB[i].BYRemarks).notes[k] + " \n");

                }
            }
            // console.log(BYRemarklist);
            let obj = {
                "RequestID": OB[i].RequestID,
                "Customer": OB[i].Customer.slice(4),
                "CarrierName": OB[i].CarrierName,
                "SCAC": OB[i].SCAC,
                "Phase": OB[i].Phase,
                // "Completion": OB[i].Completion + " %",
                // "Milestone": OB[i].Milestone,
                "Ticket Number": OB[i].TicketNumber,
                "TP Specialist	": OB[i].TPSpecialist,
                "Action Owner": OB[i].IPOwner,
                "GoLive": OB[i].GoLive,
                "CQ Validation": OB[i].OCValidation,
                "Trading Partner Setup": OB[i].TradingPartnerSetup,
                "SFTP": OB[i].SFTP,
                "BYRemarks": BYRemarklist

            }
            for (let j = 0; j < JSON.parse(OB[i].TestingJSON).length; j++) {
                obj["Testing" + JSON.parse(OB[i].TestingJSON)[j].name] = JSON.parse(OB[i].TestingJSON)[j].value

            }
            templist.push(obj)

        }
        // console.log(templist);
        setexpJSON(templist)
        if (filteredData.length != 0) {
            let templist = []
            for (let i = 0; i < filteredData.length; i++) {
                // console.log(i,expJSON);
                // console.log(filteredData[i]);
                let BYRemarklist = [];
                if (filteredData[i].BYRemarks) {

                    for (let k = 0; k < JSON.parse(filteredData[i].BYRemarks).notes.length; k++) {
                        BYRemarklist.push(JSON.parse(filteredData[i].BYRemarks).notes[k] + " \n");

                    }
                }
                // console.log(BYRemarklist);
                let obj = {
                    "RequestID": filteredData[i].RequestID,
                    "Customer": filteredData[i].Customer.slice(4),
                    "CarrierName": filteredData[i].CarrierName,
                    "SCAC": filteredData[i].SCAC,
                    "Phase": filteredData[i].Phase,
                    // "Completion": filteredData[i].Completion + " %",
                    // "Milestone": filteredData[i].Milestone,
                    "Ticket Number": filteredData[i].TicketNumber,
                    "TP Specialist	": filteredData[i].TPSpecialist,
                    "Action Owner": filteredData[i].IPOwner,
                    "GoLive": filteredData[i].GoLive,
                    "CQ Validation": filteredData[i].OCValidation,
                    "Trading Partner Setup": filteredData[i].TradingPartnerSetup,
                    "SFTP": filteredData[i].SFTP,
                    "BYRemarks": BYRemarklist

                }
                for (let j = 0; j < JSON.parse(filteredData[i].TestingJSON).length; j++) {
                    obj["Testing" + JSON.parse(filteredData[i].TestingJSON)[j].name] = JSON.parse(filteredData[i].TestingJSON)[j].value

                }
                templist.push(obj)

            }
            // console.log(templist);
            setexpJSON(templist)
        }
    }, [OB, filteredData]);
    const [togglrEdit, settogglrEdit] = useState("hidden");
    const [editdata, seteditdata] = useState({});
    useEffect(() => {
        // console.log(editdata.TestingJSON);
        seteCarrierName(editdata.CarrierName)
        seteSCAC(editdata.SCAC)
        seteditTestingJSON(editdata.TestingJSON)
        seteTicketNumber(editdata.TicketNumber)
        seteSFTP(dayjs(editdata.SFTP))
        seteID(editdata.id)
        seteTPS(dayjs(editdata.TradingPartnerSetup))
        seteGoLive(dayjs(editdata.GoLive))
    }, [editdata]);
    const [eCarrierName, seteCarrierName] = useState();
    const [eSCAC, seteSCAC] = useState();
    const [eTicketNumber, seteTicketNumber] = useState();
    const [eTPS, seteTPS] = useState();
    const [eSFTP, seteSFTP] = useState();
    const [editTestingJSON, seteditTestingJSON] = useState();
    const [eID, seteID] = useState();
    const [eGoLive, seteGoLive] = useState();

    function handleEditSubmit() {
        // console.log(eCarrierName);
        // console.log(eSCAC)
        // console.log(editTestingJSON);
        toast("Edit Request", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light"
        })
        fetch(import.meta.env.VITE_REACT_APP_BASE_URL + '/editOB/' + eID, {
            method: 'PUT',
            body: JSON.stringify({
                TestingJSON: editTestingJSON,
                CarrierName: eCarrierName,
                SCAC: eSCAC,
                TicketNumber: eTicketNumber,
                SFTP: dayjs(eSFTP).format("ll"),
                TradingPartnerSetup: dayjs(eTPS).format("ll"),
                GoLive: dayjs(eGoLive).format("ll")

            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`

            },
        }).then((r) => window.location.reload())
    }
    const [searchTerm, setSearchTerm] = useState('');
    // console.log(OB);
    const location = useLocation();
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const search = searchParams.get('search');
        if (search) {

            setSearchTerm(search)
        }
    }, []);
    useEffect(() => {
        const newfilteredData = OB.filter(item =>
            (item.Customer && item.Customer.slice(4).toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.Phase && item.Phase.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.RequestID && item.RequestID.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.CarrierName && item.CarrierName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.SCAC && item.SCAC.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.TPSpecialist && item.TPSpecialist.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.TicketNumber && item.TicketNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.IPOwner && item.IPOwner.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.Milestone && item.Milestone.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setfilteredData(newfilteredData)
    }, [OB, searchTerm]);

    return (<>

        <div className={toggleNewRequest}>
            <div className="fixed h-screen w-screen bg-black bg-opacity-20 backdrop-blur-sm z-50 transition-opacity	duration-700">
                <div className="flex flex-col h-screen items-center justify-center">
                    <div className="bg-white w-1/2 min-h-2/5 rounded-md p-6">
                        <div className="flex flex-col p-6">
                            <div className="flex items-center text-xl font-semibold">
                                New Request

                            </div>
                            <div className="error text-red-500 text-sm">
                                {errors}
                            </div>
                            <div className="basis-1/2 my-2 flex flex-wrap text-gray-500">
                                <select name="cars" onChange={(e) => { setCustomer(e.target.value); }} id="cars" className='border-2 p-2 mx-2 border-[#0575e6] w-40 my-3 rounded'>
                                    <option selected className='hidden'>Select Customer</option>
                                    {Projects.map((item) => {
                                        // Exclude items where GoLive, Production, DevEnvironment, or QAEnvironment is 'Cancelled'
                                        if (item.GoLive === 'Cancelled' || item.Production === 'Cancelled' || item.DevEnviornment === 'Cancelled' || item.QAEnviornment === 'Cancelled') {
                                            return null;
                                        }

                                        // Exclude items where ProjectType is 'Upgrade' and GoLive is 'Completed'
                                        if (item.ProjectType === 'Upgrade' && item.GoLive === 'Completed') {
                                            return null;
                                        }

                                        // Include items where ProjectType is 'New'
                                        if (item.ProjectType === 'New') {
                                            return <option value={item.Customer}>{item.Customer.slice(4)}</option>
                                        }
                                    })}



                                </select>
                                <select type="text" onChange={(e) => setPhase(e.target.value)} className='border-2 border-[#0575e6] p-2 mx-2 w-40 my-3 rounded' placeholder='Phase' >
                                    <option selected className='hidden'>Select Phase</option>
                                    <option >Phase 1</option>
                                    <option >Phase 2</option>
                                    <option >Phase 3</option>
                                </select>

                                {/* <select type="text" className='border-2 border-[#0575e6] p-2 mx-2  my-3 rounded' placeholder='Phase' >
                                    <option >Select EDI Message Type</option>


                                </select> */}
                                <div className='mx-2 flex items-center justify-center'>
                                    <Select
                                        isMulti
                                        name="colors"
                                        options={options}
                                        className="basic-multi-select border-2 border-[#0575e6] w-40 rounded"
                                        classNamePrefix="select"
                                        placeholder="Select EDI Message type"
                                        value={selected}
                                        isSearchable={false}
                                        onChange={(e) => {
                                            let x = []
                                            for (let i = 0; i < e.length; i++) {
                                                x.push(e[i].value)
                                            }
                                            setSelected(e)
                                            const priorityOrder = [
                                                ['204', '300', '754', 'IFTMIN', 'IFTMBF'],
                                                ['990', '301', '110', 'IFTSTA', '753', 'IFTCC'],
                                                ['214', '315', '323', '214 SMP'],
                                                ['210', '310', '210 SMP']
                                            ];
                                            x.sort((a, b) => {
                                                let aPriority = priorityOrder.findIndex(priority => priority.includes(a));
                                                let bPriority = priorityOrder.findIndex(priority => priority.includes(b));

                                                if (aPriority !== bPriority) {
                                                    return aPriority - bPriority;
                                                } else {
                                                    return priorityOrder[aPriority].indexOf(a) - priorityOrder[bPriority].indexOf(b);
                                                }
                                            });
                                            console.log(x);
                                            setEDIMsgSelectList(x);
                                        }}
                                    />
                                </div>
                                <input type="text" value={CarrierName} onChange={(e) => setCarrierName(e.target.value)} className='border-2 border-[#0575e6] p-2 mx-2 w-40 my-3 rounded' placeholder='CarrierName' />
                                <input type="text" value={TicketNumber} onChange={(e) => setTicketNumber(e.target.value)} className='border-2 border-[#0575e6] p-2 mx-2 w-40 my-3 rounded' placeholder='TicketNumber' />
                                <input type="text" value={SCAC} onChange={(e) => setSCAC(e.target.value)} className='border-2 border-[#0575e6] p-2 mx-2 w-40 my-3 rounded' placeholder='SCAC' />
                                {/* <input type="text" value={RequestID} onChange={(e) => setCname(e.target.value)} className='border-2 border-[#0575e6] p-2 w-40 my-3 rounded' placeholder='Customer name' /> */}
                            </div>
                            <div className="flex my-1">

                                <button onClick={() => { window.location.reload() }} className="mx-2 p-1 border-2 w-28 text-center border-[#0575e6] rounded-md">Cancel</button>
                                <button onClick={handleSubmit} className="border-2 w-28 mx-14 text-center bg-[#0575e6] border-black rounded-md text-white">Submit</button>
                            </div>
                        </div>
                        <div className="basis-1/2">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className={togglrEdit}>
            <div className=" h-screen w-screen fixed bg-black bg-opacity-20 backdrop-blur-sm z-50 transition-opacity	duration-700">
                <div className="flex flex-col h-screen items-center justify-center ">
                    <form enctype="multipart/form-data" className='w-[580px]'>

                        <div className="bg-white   rounded-md p-8 flex flex-col ">
                            <div className="font-bold text-xl">
                                Edit Request
                            </div>
                            <div className="text-xs mt-3 text-[#E84500]">
                                {/* Note: Ensure that the document contains all the necessary details required for the trading partner setup. */}

                            </div>
                            <div className="p-2 font-semibold">

                                Request Id: {editdata.RequestID}
                            </div>
                            <div className='flex   text-sm flex-wrap'>
                                <div className='flex  pt-2 flex-col'>

                                    <label htmlFor="" className=' mx-2'>Carrier Name</label>
                                    <input type="text" onChange={(e) => seteCarrierName(e.target.value)} className='border-2 border-[#0575e6] p-2 mx-2 w-60  rounded' placeholder={editdata.CarrierName} value={eCarrierName} />
                                </div>
                                <div className='flex flex-col'>

                                    <label htmlFor="" className='pt-2 mx-2'>SCAC</label>
                                    <input type="text" onChange={(e) => seteSCAC(e.target.value)} className='border-2 border-[#0575e6] p-2 mx-2 w-60  rounded' value={eSCAC} />
                                </div>

                                {localStorage.getItem('type') == "admin" ?
                                    <>
                                        <div className='flex flex-col'>

                                            <label htmlFor="" className='pt-2 mx-2'>Ticket Number</label>
                                            <input type="text" onChange={(e) => seteTicketNumber(e.target.value)} className='border-2 border-[#0575e6] p-2 mx-2 w-60  rounded' value={eTicketNumber} />
                                        </div>
                                        <div className='mt-2'>


                                            <label htmlFor="" className='pt-2 mx-2'>Trading Partner Setup</label>
                                            <div className="mx-2">

                                                <LocalizationProvider dateAdapter={AdapterDayjs} >

                                                    <MobileDatePicker

                                                        onChange={(e) => {
                                                            var n = dayjs(e);
                                                            seteTPS(n.format("ll"))
                                                        }} value={eTPS}
                                                        className='border-2 border-[#0575e6] p-2  w-60 my-3 rounded '
                                                        slotProps={{
                                                            textField: {
                                                                placeholder: `${editdata.TradingPartnerSetup}`,
                                                                size: 'small',

                                                                inputProps: { // This targets the input element directly
                                                                    style: {
                                                                        fontSize: 16, // This reduces the font size
                                                                    },
                                                                }, // This reduces the height of the TextField
                                                            }
                                                        }}
                                                        sx={{
                                                            width: 240,
                                                            border: 1,
                                                            borderColor: "#0575e6",
                                                            fontSize: 2, // This reduces the font size
                                                            lineHeight: 4,
                                                            padding: 0,
                                                            margin: 0,
                                                        }} />
                                                </LocalizationProvider>
                                            </div>
                                        </div>
                                        <div className='mt-2'>
                                            <label htmlFor="" className='pt-2 mx-2'>SFTP</label>
                                            <div className="mx-2">

                                                <LocalizationProvider dateAdapter={AdapterDayjs} >

                                                    <MobileDatePicker
                                                        onChange={(e) => {
                                                            var n = dayjs(e);
                                                            seteSFTP(n.format("ll"))
                                                        }} value={eSFTP}
                                                        className='border-2 border-[#0575e6] p-2  w-60 my-3 rounded '
                                                        slotProps={{
                                                            textField: {
                                                                placeholder: `${editdata.SFTP}`,
                                                                size: 'small',

                                                                inputProps: { // This targets the input element directly
                                                                    style: {
                                                                        fontSize: 16, // This reduces the font size
                                                                    },
                                                                }, // This reduces the height of the TextField
                                                            }
                                                        }}
                                                        sx={{
                                                            width: 240,
                                                            border: 1,
                                                            borderColor: "#0575e6",
                                                            fontSize: 2, // This reduces the font size
                                                            lineHeight: 4,
                                                            padding: 0,
                                                            margin: 0,
                                                        }} />
                                                </LocalizationProvider>
                                            </div></div>
                                        <div className='mt-2'>
                                            <label htmlFor="" className='pt-2 mx-2'>Go Live</label>
                                            <div className="mx-2">

                                                <LocalizationProvider dateAdapter={AdapterDayjs} >

                                                    <MobileDatePicker
                                                        onChange={(e) => {
                                                            var n = dayjs(e);
                                                            seteGoLive(n.format("ll"))
                                                        }} value={eGoLive}
                                                        className='border-2 border-[#0575e6] p-2  w-60 my-3 rounded '
                                                        slotProps={{
                                                            textField: {
                                                                placeholder: `${editdata.GoLive}`,
                                                                size: 'small',

                                                                inputProps: { // This targets the input element directly
                                                                    style: {
                                                                        fontSize: 16, // This reduces the font size
                                                                    },
                                                                }, // This reduces the height of the TextField
                                                            }
                                                        }}
                                                        sx={{
                                                            width: 240,
                                                            border: 1,
                                                            borderColor: "#0575e6",
                                                            fontSize: 2, // This reduces the font size
                                                            lineHeight: 4,
                                                            padding: 0,
                                                            margin: 0,
                                                        }} />
                                                </LocalizationProvider>
                                            </div></div>

                                        {/* <input type="text"  className='border-2 border-[#0575e6] p-2 mx-2 w-60 my-3 rounded' placeholder='TESTING 214 ETA' /> */}
                                        {editdata.TestingJSON ? JSON.parse(editdata.TestingJSON).map((item) => <>
                                            <div className='mt-2'>


                                                <label htmlFor="" className='pt-2 mx-2'>{item.name}</label>
                                                <div className="mx-2">
                                                    <LocalizationProvider dateAdapter={AdapterDayjs} >

                                                        <MobileDatePicker
                                                            className='border-2 border-[#0575e6] p-2  w-60 my-3 rounded '
                                                            onChange={(e) => {
                                                                let x = JSON.parse(editTestingJSON);
                                                                for (let i = 0; i < x.length; i++) {
                                                                    if (x[i]['name'][0] == item.name) {
                                                                        console.log(dayjs(e).format("ll"));
                                                                        x[i]['value'] = dayjs(e).format("ll");
                                                                        seteditTestingJSON(JSON.stringify(x))

                                                                    }

                                                                }

                                                            }}
                                                            slotProps={{
                                                                textField: {
                                                                    placeholder: `${item.value}`,
                                                                    size: 'small',

                                                                    inputProps: { // This targets the input element directly
                                                                        style: {
                                                                            fontSize: 16, // This reduces the font size
                                                                        },
                                                                    }, // This reduces the height of the TextField
                                                                }
                                                            }}
                                                            sx={{
                                                                width: 240,
                                                                border: 1,
                                                                borderColor: "#0575e6",
                                                                fontSize: 2, // This reduces the font size
                                                                lineHeight: 4,
                                                                padding: 0,
                                                                margin: 0,
                                                            }} />
                                                    </LocalizationProvider>

                                                </div>
                                            </div>
                                        </>) : <></>}
                                    </>
                                    : <></>}
                            </div>
                            <div className="flex pt-4 justify-between">
                                {/* <div onClick={() => settogglrEdit("hidden")}>Cancel</div> */}
                                <button onClick={() => { settogglrEdit("hidden") }} className="mx-2 p-1 border-2 w-28 text-center border-[#0575e6] rounded-md">Cancel</button>
                                <div onClick={handleEditSubmit} className="border-2 w-28 cursor-pointer text-center bg-[#0575e6] border-black rounded-md text-white mr-3">Submit</div>

                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div className='flex flex-col h-screen p-16'>
            <Nav settoggleNewRequest={settoggleNewRequest} expJSON={expJSON} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <div className="mt-5 pb-5">

                <div class=" relative h-96 overflow-x-auto rounded">
                    <table class="table-auto relative w-full text-sm text-left rtl:text-right  ">
                        <thead class="text-xs  uppercase bg-[#0575e6] text-white font-light">
                            <tr>
                                <th scope="col" class="sticky bg-[#0575e6] z-20 top-0 px-6 py-3 whitespace-nowrap">
                                    Request ID
                                </th>
                                <th scope="col" class="sticky bg-[#0575e6] z-20 top-0 px-6 py-3">
                                    Customer
                                </th>
                                <th scope="col" class="sticky bg-[#0575e6] z-20 top-0 px-6 py-3 whitespace-nowrap">
                                    Carrier Name
                                </th>
                                <th scope="col" class="sticky bg-[#0575e6] z-20 top-0 px-6 py-3">
                                    SCAC
                                </th>
                                <th scope="col" class="sticky bg-[#0575e6] z-20 top-0 px-6 py-3">
                                    Phase
                                </th>
                                <th scope="col" class="sticky bg-[#0575e6] z-20 top-0 px-6 py-3">
                                    Completion
                                </th>
                                <th scope="col" class="sticky bg-[#0575e6] z-20 top-0 px-6 py-3">
                                    Milestone
                                </th>
                                <th scope="col" class="sticky bg-[#0575e6] z-20 top-0 px-6 py-3">
                                    Ticket
                                </th>
                                <th scope="col" class="sticky bg-[#0575e6] z-20 top-0 px-6 py-3 whitespace-nowrap">
                                    TP Specialist
                                </th>
                                <th scope="col" class="sticky bg-[#0575e6] z-20 top-0 px-9 py-3 whitespace-nowrap">
                                    Action Owner
                                </th>
                                <th scope="col" class="sticky bg-[#0575e6] z-20 top-0 px-9 py-3 whitespace-nowrap">
                                    CQ Validation
                                </th>
                                <th scope="col" class="sticky bg-[#0575e6] z-20 top-0 px-9 py-3 whitespace-nowrap">
                                    Trading Partner Setup
                                </th>
                                <th scope="col" class="sticky bg-[#0575e6] z-20 top-0 px-9 py-3 whitespace-nowrap">
                                    SFTP Testing
                                </th>
                                <th scope="col" class="sticky bg-[#0575e6] z-20 top-0 px-6 py-3">
                                    Testing
                                </th>
                                <th scope="col" class="sticky bg-[#0575e6] z-20 top-0 px-9 py-3 whitespace-nowrap">
                                    Go Live
                                </th>
                                <th scope="col" class="sticky bg-[#0575e6] z-20 top-0 px-6 py-3 whitespace-nowrap">
                                    BY Remarks
                                </th>
                                <th scope="col" class="sticky bg-[#0575e6] z-20 top-0 px-6 py-3 whitespace-nowrap">
                                    Notes
                                </th>
                                <th scope="col" class="sticky bg-[#0575e6] z-20 top-0 px-6 py-3 whitespace-nowrap">

                                </th>
                            </tr>
                        </thead>
                        <tbody className='' >
                            {filteredData.length != 0 ? filteredData.map((item) => {
                                if (localStorage.getItem('type') == "admin" || item.IPOwner == localStorage.getItem('name') || item.TPSpecialist == localStorage.getItem('name')) {

                                    return <OBitems data={item} Users={Users} settoggleFileUpload={settoggleFileUpload} setsetTime={setsetTime} fileUploadSync={fileUploadSync} setTime={setTime} fileUploadError={fileUploadError} settogglrEdit={settogglrEdit} seteditdata={seteditdata} />
                                }

                            }) : OB.map((item) => {

                                if (localStorage.getItem('type') == "admin" || item.IPOwner == localStorage.getItem('name') || item.TPSpecialist == localStorage.getItem('name')) {

                                    return <OBitems data={item} Users={Users} settoggleFileUpload={settoggleFileUpload} setsetTime={setsetTime} fileUploadSync={fileUploadSync} setTime={setTime} fileUploadError={fileUploadError} settogglrEdit={settogglrEdit} seteditdata={seteditdata} />
                                }

                            })}


                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </>
    )
}

export default Home