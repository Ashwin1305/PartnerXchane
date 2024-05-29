import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import { useOBContext } from '../context/OBProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import Select from 'react-select';
import axios from 'axios';
import { useProjectsContext } from '../context/ProjectsProvider';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from 'react-router-dom';


function Pitems(props) {
    const { OB, setOB } = useOBContext();
    const [options, setOptions] = useState([]);
    const [selected, setSelected] = useState([]);
    const { Projects, setProjects } = useProjectsContext();

    const [CEnv, setCEnv] = useState(props.data.Environment);
    const [CMilestone, setCMilestone] = useState(props.data.Milestone);
    const [CQA, setCQA] = useState(props.data.QAEnviornment);
    const [CProduction, setCProduction] = useState(props.data.Production);
    const [CGoLive, setCGoLive] = useState(props.data.GoLive);
    const token = localStorage.getItem('jwt');
    const [Jira, setJira] = useState(props.data.Jira);
    const [CProjectLead, setCProjectLead] = useState(props.data.ProjectLead);
    const [Severity, setSeverity] = useState(props.data.Severity);
    // const [OBList, setOBList] = useState([]);
    const [CDE, setCDE] = useState(props.data.DevEnviornment);
    const [BYRemark, setBYRemark] = useState(props.data.BYRemark);
    const [Notes, setNotes] = useState(props.data.Notes);

    async function book() {
        toast("Sync", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light"
        })
        await fetch(import.meta.env.VITE_REACT_APP_BASE_URL + '/updateP/' + props.data.id, {
            method: 'PUT',
            body: JSON.stringify({
                CEnv: CEnv,
                CMilestone: CMilestone,
                CQA: CQA,
                DevEnviornment: CDE,
                CProduction: CProduction,
                CGoLive: CGoLive,
                CProjectLead: CProjectLead,
                Jira: Jira,
                Severity: Severity,
                BYRemark: BYRemark,
                Notes: Notes

            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`

            },
        })
            .then((response) => window.location.reload(false))

    }
    // console.log(Jira);
    function sync() {
        book()
        // window.location.reload(false);

    }
    const [calMilestione, setcalMilestione] = useState();
    useEffect(() => {
        const today = dayjs()

        // if (props.data.OCValidation == "Completed") {
        if (props.data.DevEnviornment == "Completed") {
            if (props.data.QAEnviornment == "Completed") {
                if (props.data.Production == "Completed") {

                    setcalMilestione("Stable")
                } else {

                    let date = dayjs(props.data.Production)
                    let oneDayBefore = date.subtract(4, 'day')
                    if (today.isBefore(oneDayBefore)) {
                        setcalMilestione("Stable")
                    } else {
                        setcalMilestione("Critical")

                    }
                    if (today.isAfter(date)) {
                        console.log(oneDayBefore);
                        setcalMilestione("Violated")

                    }
                }
            }
            else {
                let date = dayjs(props.data.QAEnviornment)
                let oneDayBefore = date.subtract(4, 'day')
                // console.log(oneDayBefore);
                if (today.isBefore(date)) {
                    if (today.isBefore(oneDayBefore)) {
                        setcalMilestione("Stable")
                    } else {
                        setcalMilestione("Critical")

                    }
                }
                else {
                    setcalMilestione("Violated")
                    // break
                }
            }
        }
        else {
            let date = dayjs(props.data.DevEnviornment)
            let oneDayBefore = date.subtract(4, 'day')
            // console.log(oneDayBefore.format('ll'));
            if (today.isBefore(date)) {
                if (today.isBefore(oneDayBefore)) {
                    setcalMilestione("Stable")
                } else {
                    setcalMilestione("Critical")

                }
            } else if (today.isAfter(date)) {

                setcalMilestione("Violated")
            }
            else {
                setcalMilestione("Stable")
                // break
            }
        }
        if (props.data.DevEnviornment == "On Hold") {
            setcalMilestione("Critical")
        }
        if (props.data.QAEnviornment == "On Hold") {
            setcalMilestione("Critical")
        }
        if (props.data.Production == "On Hold") {
            setcalMilestione("Critical")
        }
        // console.log(calMilestione);
    })
    useEffect(() => {
        updateMilestone(props.data.id, calMilestione)


    }, [calMilestione]);
    const updateMilestone = (id, newMilestone) => {
        setProjects(prevData =>
            prevData.map(item =>
                item.id === id ? { ...item, Milestone: newMilestone } : item
            )
        );
    };

    const [completion, setcompletion] = useState();
    useEffect(() => {
        let setCompleted = 0

        if (props.data.DevEnviornment == "Completed") {
            setCompleted = setCompleted + 1
        }
        if (props.data.QAEnviornment == "Completed") {
            setCompleted = setCompleted + 1
        }
        if (props.data.Production == "Completed") {
            setCompleted = setCompleted + 1
        }
        if (props.data.GoLive == "Completed") {
            setCompleted = setCompleted + 1
        }

        // console.log(setCompleted);
        setcompletion((setCompleted / (4)) * 100)
    }, [props]);
    const [progressColor, setprogressColor] = useState();
    useEffect(() => {
        if (calMilestione == "Stable") {
            setprogressColor("#53E88E")
        }
        if (calMilestione == "Violated") {
            setprogressColor("#FF7967")
        }
        if (calMilestione == "Critical") {
            setprogressColor("#FFCD91")
        }


    }, [calMilestione]);
    function deleteRow() {
        toast("Delete Project", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light"
        })
        fetch(import.meta.env.VITE_REACT_APP_BASE_URL + '/deleteP/' + props.data.id, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(response => {
                if (!response.ok) {
                    props.setdelError("Cannot delete this project as it already exists in Onboarding")
                    console.log("Cannot delete this project as it already exists in Onboarding");
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                console.log('Record deleted successfully');
                window.location.reload()
            })
            .catch(error => {
                console.log('There was an error: ', error);
            });

    }
    var k = 0
    // console.log(OB.length);
    for (let j = 0; j < OB.length; j++) {
        if (OB[j].Customer == props.data.Customer) {

            k++
        }
    }
    const [togglrEdit, settogglrEdit] = useState("hidden");
    useEffect(() => {
        // Load options here

        const options = [
            // { value: 'volvo', label: 'EDI Message Type' },
            {
                options: [
                    { value: '204', label: '204' },
                    { value: '300', label: '300' },
                    { value: '754', label: '754' },
                    { value: 'IFTMIN', label: 'IFTMIN' },
                    { value: 'IFTMBF', label: 'IFTMBF' },
                    { value: '990', label: '990' },
                    { value: '301', label: '301' },
                    { value: '110', label: '110' },
                    { value: 'IFTSTA', label: 'IFTSTA' },
                    { value: '753', label: '753' },
                    { value: 'IFTCC', label: 'IFTCC' },
                    { value: '214', label: '214' },
                    { value: '315', label: '315' },
                    { value: '323', label: '323' },
                    { value: '214 SMP', label: '214 SMP' },
                    { value: '210', label: '210' },
                    { value: '310', label: '310' },
                    { value: '210 SMP', label: '210 SMP' },
                ]
            }
        ]
        setOptions(options);
    }, []);

    const [EDIMessageType, setEDIMessageType] = useState();
    const handleChange = (selectedOptions) => {
        setSelected(selectedOptions);
        // setEDIMessageType(selectedOptions.target.value);
        // console.log(EDIMessageType)


    };
    // editt
    const [editCustomer, seteditCustomer] = useState(props.data.Customer);
    const [editCC, seteditCC] = useState(props.data.CustomerCode);
    const [editEDIVersion, seteditEDIVersion] = useState(props.data.EDIVersion);
    const [editEDIVT, seteditEDIVT] = useState(props.data.EDIMessageType);
    const [editPGOLive, seteditPGOLive] = useState(dayjs(props.data.ProjectedGoLive));
    const [editGOLive, seteditGOLive] = useState(dayjs(props.data.GoLive));
    const [editDEV, seteditDEV] = useState(dayjs(props.data.DevEnviornment));
    const [editQA, seteditQA] = useState(dayjs(props.data.QAEnviornment));
    const [editPT, seteditPT] = useState(props.data.ProjectType);
    const [editDeveloper, seteditDeveloper] = useState(props.data.Developer);
    const [editImplemnetor, seteditImplemnetor] = useState(props.data.Implementor);
    const [editPro, seteditPro] = useState(dayjs(props.data.Production));
    const [editFile, seteditFile] = useState(props.data.MappingSpecification);
    const [file, setFile] = useState(null);
    const [byRemarkdilogbox, setbyRemarkdilogbox] = useState("scale-0");
    const [NotesDialogBox, setNotesDialogBox] = useState("scale-0");
    const submitFile = async () => {
        // event.preventDefault();
        const formData = new FormData();
        try {
            formData.append('file', file);
            console.log(file.name);
            await axios.post(import.meta.env.VITE_REACT_APP_BASE_URL + '/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (error) {
            console.log(error);
        }

    }
    const handleFileUpload = (event) => {
        setFile(event.target.files[0]);
        const publicUrl = `https://${import.meta.env.VITE_STORAGE_ACC_NAME}.blob.core.windows.net/${import.meta.env.VITE_STORAGE_CONTAINER_NAME}/${event.target.files[0].name}`;
        seteditFile(publicUrl)
        // submitFile()
    };
    function handleEditSubmit() {
        toast("Edit Project", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light"
        })
        if (file) {
            submitFile().then(
                () => {
                    console.log("run");
                    fetch(import.meta.env.VITE_REACT_APP_BASE_URL + '/editPJ/' + props.data.id, {
                        method: 'PUT',
                        body: JSON.stringify({
                            Customer: editCustomer,
                            CustomerCode: editCC,
                            EDIVersion: editEDIVersion,
                            EDIMessageType: editEDIVT,
                            ProjectType: editPT,
                            Developer: editDeveloper,
                            Implementor: editImplemnetor,
                            ProjectedGoLive: dayjs(editPGOLive).format("ll"),
                            GoLive: dayjs(editGOLive).format("ll"),
                            QAEnviornment: dayjs(editQA).format("ll"),
                            DevEnviornment: dayjs(editDEV).format("ll"),
                            Production: dayjs(editPro).format("ll"),
                            MappingSpecification: editFile

                        }),
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8',
                            'Authorization': `Bearer ${token}`

                        },
                    })
                        .then((r) => window.location.reload())
                })
        }
        else {
            console.log("run2");
            fetch(import.meta.env.VITE_REACT_APP_BASE_URL + '/editPJ/' + props.data.id, {
                method: 'PUT',
                body: JSON.stringify({
                    Customer: editCustomer,
                    CustomerCode: editCC,
                    EDIVersion: editEDIVersion,
                    EDIMessageType: editEDIVT,
                    ProjectType: editPT,
                    Developer: editDeveloper,
                    Implementor: editImplemnetor,
                    ProjectedGoLive: dayjs(editPGOLive).format("ll"),
                    GoLive: dayjs(editGOLive).format("ll"),
                    QAEnviornment: dayjs(editQA).format("ll"),
                    DevEnviornment: dayjs(editDEV).format("ll"),
                    Production: dayjs(editPro).format("ll"),
                    MappingSpecification: editFile

                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${token}`

                },
            })
                .then((r) => window.location.reload())
        }
    }
    async function book() {
        toast("Sync", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light"
        })
        await fetch(import.meta.env.VITE_REACT_APP_BASE_URL + '/updateP/' + props.data.id, {
            method: 'PUT',
            body: JSON.stringify({
                CEnv: CEnv,
                CMilestone: CMilestone,
                CQA: CQA,
                DevEnviornment: CDE,
                CProduction: CProduction,
                CGoLive: CGoLive,
                CProjectLead: CProjectLead,
                Jira: Jira,
                Severity: Severity,
                BYRemark: BYRemark,
                Notes: Notes

            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`

            },
        })
            .then((response) => window.location.reload(false))

    }
    useEffect(() => {


    }, []);
    const [tempByRemark, settempByRemark] = useState("");
    const [tempNotes, settempNotes] = useState("");
    function handleAddByRemark() {
        // Parse the JSON string to an object
        let BYRemarkObj = BYRemark ? JSON.parse(BYRemark) : { notes: [] };

        // Add the new value to the notes array
        BYRemarkObj.notes.push(tempByRemark);

        // Stringify the object back to JSON
        let updatedBYRemark = JSON.stringify(BYRemarkObj);

        // Update the state
        setBYRemark(updatedBYRemark);

    }
    function handleAddNotes() {
        // Parse the JSON string to an object
        let NotesObj = Notes ? JSON.parse(Notes) : { notes: [] };

        // Add the new value to the notes array
        NotesObj.notes.push(tempNotes);

        // Stringify the object back to JSON
        let updatedNotes = JSON.stringify(NotesObj);

        // Update the state
        console.log(updatedNotes);
        setNotes(updatedNotes);

    }
    useEffect(() => {
        // console.log(BYRemark);
        if (props.data.BYRemark != BYRemark) {

            book()
        }

    }, [BYRemark]);
    useEffect(() => {
        // console.log(BYRemark);
        if (props.data.Notes != Notes) {
            console.log(props.data.ProjectLead.slice(1));
            for (let i = 0; i < props.data.ProjectLead.slice(1).split(",").length; i++) {


                fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/newNoti", {
                    method: 'POST',
                    body: JSON.stringify({
                        userID: props.data.ProjectLead.slice(2).split(", ")[i],
                        msg: `Check ${props.data.RequestID} Notes in projects`,
                        assignedBY: localStorage.getItem('name')
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Authorization': `Bearer ${token}`
                    }
                })

            }

            fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/newNoti", {
                method: 'POST',
                body: JSON.stringify({
                    userID: props.data.Developer,
                    msg: `Check ${props.data.RequestID} Notes in projects`,
                    assignedBY: localStorage.getItem('name')
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${token}`
                }
            }).then(() =>
                fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/newNoti", {
                    method: 'POST',
                    body: JSON.stringify({
                        userID: props.data.Implementor,
                        msg: `Check ${props.data.RequestID} Notes in projects`,
                        assignedBY: localStorage.getItem('name')
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Authorization': `Bearer ${token}`
                    }
                })
            ).then(() =>
                book()
            )

        }

    }, [Notes]);
    function deleteByRemark(index) {
        let arr = JSON.parse(props.data.BYRemark).notes
        if (index > -1 && index < arr.length) {
            arr.splice(index, 1);
        }
        let updatedBYRemark = JSON.stringify({ notes: arr });

        setBYRemark(updatedBYRemark);

    }
    function deleteNotes(index) {
        let arr = JSON.parse(props.data.Notes).notes
        if (index > -1 && index < arr.length) {
            arr.splice(index, 1);
        }
        let updatedNotes = JSON.stringify({ notes: arr });

        setNotes(updatedNotes);

    }

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            border: state.isFocused ? 0 : 0,
            boxShadow: state.isFocused ? 'none' : 'none',
            '&:hover': {
                border: state.isFocused ? 0 : 0
            }
        })
    };
    return (
        <>
            <div className={togglrEdit}>
                <div className=" h-screen w-screen fixed bg-black bg-opacity-20 backdrop-blur-sm z-50 transition-opacity	duration-700">
                    <div className="flex flex-col h-screen items-center justify-center ">
                        <form enctype="multipart/form-data" className='w-[600px] overflow-auto'>

                            <div className="bg-white   rounded-md p-8 flex flex-col ">
                                <div className="font-bold text-xl">
                                    Edit Request
                                </div>
                                <div className="text-xs mt-3 text-[#E84500]">
                                    {/* Note: Ensure that the document contains all the necessary details required for the trading partner setup. */}

                                </div>
                                <div className="p-2 font-semibold">

                                    Request Id: {props.data.RequestID}
                                </div>
                                <div className='flex text-sm flex-wrap'>
                                    <div className='flex  pt-2 flex-col'>

                                        <label htmlFor="" className=' mx-2'>Customer</label>
                                        <input type="text" onChange={(e) => seteditCustomer(dayjs().format("mmss") + e.target.value)} placeholder={editCustomer.slice(4)} className='border-2 border-[#0575e6] p-2 mx-2 w-60  rounded' />
                                    </div>
                                    <div className='flex  pt-2 flex-col'>

                                        <label htmlFor="" className=' mx-2'>Customer Code</label>
                                        <input type="text" onChange={(e) => seteditCC(e.target.value)} value={editCC} className='border-2 border-[#0575e6] p-2 mx-2 w-60  rounded' />
                                    </div>
                                    <div className='flex  pt-2 flex-col'>

                                        <label htmlFor="" className=' mx-2'>EDI Version</label>
                                        {/* <select onChange={(e) => seteditEDIVersion(e.target.value)} className='border-2 p-2 text-gray-600 border-[#0575e6] w-[240px] mx-2 rounded'>
                                            <option value="" selected className='hidden'>{editEDIVersion.slice(1)}</option>
                                            <option value="X12 4010">X12 4010</option>
                                            <option value="X12 5010">X12 5010</option>
                                            <option value="EDIFACT D-09A">EDIFACT D-09A</option>

                                        </select> */}
                                        <Select
                                            isMulti
                                            name="colors"
                                            options={[{ value: 'X12 4010', label: 'X12 4010' }, { value: 'X12 5010', label: 'X12 5010' }, { value: 'EDIFACT D-09A', label: 'EDIFACT D-09A' }]}
                                            className="basic-multi-select rounded border-2 border-[#0575e6] mx-2 w-[240px]"
                                            classNamePrefix="select"
                                            placeholder={props.data.EDIVersion.slice(1)}
                                            isSearchable={false}
                                            onChange={(e) => {
                                                let x = ""
                                                for (let i = 0; i < e.length; i++) {
                                                    x = x + "," + e[i].value
                                                }
                                                seteditEDIVersion(x);
                                                setSelected(e)
                                            }}
                                        />
                                    </div>
                                    <div className='flex  pt-2 flex-col'>

                                        <label htmlFor="" className=' mx-2'>EDI Message Type</label>
                                        {/* <span className='bold text-gray-500 text-xs ml-3'>{props.data.EDIMessageType.slice(1)}</span> */}
                                        <Select
                                            isMulti
                                            name="colors"
                                            options={options}
                                            className="basic-multi-select rounded border-2 border-[#0575e6] mx-2 w-[240px]"
                                            classNamePrefix="select"
                                            placeholder={props.data.EDIMessageType.slice(1)}
                                            isSearchable={false}
                                            onChange={(e) => {
                                                let x = ""
                                                for (let i = 0; i < e.length; i++) {
                                                    x = x + "," + e[i].value
                                                }
                                                seteditEDIVT(x);
                                                setSelected(e)
                                            }}
                                        />
                                    </div>
                                    <div className='flex  pt-2 flex-col'>

                                        <label htmlFor="" className=' mx-2'>Projected Go Live</label>
                                        <div className="mx-2">

                                            <LocalizationProvider dateAdapter={AdapterDayjs} >

                                                <MobileDatePicker
                                                    onChange={(e) => {
                                                        var n = dayjs(e);
                                                        seteditPGOLive(n.format("ll"))
                                                    }} value={editPGOLive}
                                                    className='border-2 border-[#0575e6] p-2  w-60 my-3 rounded '
                                                    slotProps={{
                                                        textField: {
                                                            // placeholder: `${editdata.TradingPartnerSetup}`,
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
                                    <div className='flex  pt-2 flex-col'>

                                        <label htmlFor="" className=' mx-2'>Dev Environment</label>
                                        <div className="mx-2">

                                            <LocalizationProvider dateAdapter={AdapterDayjs} >

                                                <MobileDatePicker
                                                    onChange={(e) => {
                                                        var n = dayjs(e);
                                                        seteditDEV(n.format("ll"))
                                                    }} value={editDEV}
                                                    className='border-2 border-[#0575e6] p-2  w-60 my-3 rounded '
                                                    slotProps={{
                                                        textField: {
                                                            // placeholder: `${editdata.TradingPartnerSetup}`,
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
                                    <div className='flex  pt-2 flex-col'>

                                        <label htmlFor="" className=' mx-2'>QA Environment</label>
                                        <div className="mx-2">

                                            <LocalizationProvider dateAdapter={AdapterDayjs} >

                                                <MobileDatePicker
                                                    onChange={(e) => {
                                                        var n = dayjs(e);
                                                        seteditQA(n.format("ll"))
                                                    }} value={editQA}
                                                    className='border-2 border-[#0575e6] p-2  w-60 my-3 rounded '
                                                    slotProps={{
                                                        textField: {
                                                            // placeholder: `${editdata.TradingPartnerSetup}`,
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
                                    <div className='flex  pt-2 flex-col'>

                                        <label htmlFor="" className=' mx-2'>Production</label>
                                        <div className="mx-2">

                                            <LocalizationProvider dateAdapter={AdapterDayjs} >

                                                <MobileDatePicker
                                                    onChange={(e) => {
                                                        var n = dayjs(e);
                                                        seteditPro(n.format("ll"))
                                                    }} value={editPro}
                                                    className='border-2 border-[#0575e6] p-2  w-60 my-3 rounded '
                                                    slotProps={{
                                                        textField: {
                                                            // placeholder: `${editdata.TradingPartnerSetup}`,
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
                                    <div className='flex  pt-2 flex-col'>

                                        <label htmlFor="" className=' mx-2 pb-1'>Go Live</label>
                                        <div className="mx-2">

                                            <LocalizationProvider dateAdapter={AdapterDayjs} >

                                                <MobileDatePicker
                                                    onChange={(e) => {
                                                        var n = dayjs(e);
                                                        seteditGOLive(n.format("ll"))
                                                    }} value={editGOLive}
                                                    className='border-2 border-[#0575e6] p-2  w-60 my-3 rounded '
                                                    slotProps={{
                                                        textField: {
                                                            // placeholder: `${editdata.TradingPartnerSetup}`,
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
                                    <div className='flex  pt-2 flex-col'>
                                        <label htmlFor="" className=' mx-2 pb-1'>Project Type</label>
                                        <select onChange={(e) => seteditPT(e.target.value)} className='text-gray-600 border-2 p-2 border-[#0575e6] w-[240px] mx-2 rounded'>
                                            <option value="" selected className='hidden'>{editPT}</option>
                                            <option value="New">New</option>
                                            <option value="Upgrade">Upgrade</option>

                                        </select>
                                    </div>
                                    <div className='flex  pt-2 flex-col'>
                                        <label htmlFor="" className=' mx-2 pb-1'>Developer</label>
                                        <select onChange={(e) => seteditDeveloper(e.target.value)} className='text-gray-600 border-2 p-2 border-[#0575e6] w-[240px] mx-2 rounded'>
                                            <option value="" selected className='hidden'>{editDeveloper}</option>
                                            {props.Users.map((item) => (<>
                                                {item.Developer == "Yes" ?
                                                    <option>

                                                        {item.name}
                                                    </option>
                                                    : <></>}
                                            </>))}

                                        </select>
                                    </div>
                                    <div className='flex  pt-2 flex-col'>
                                        <label htmlFor="" className=' mx-2 pb-1'>Implementor</label>
                                        <select onChange={(e) => seteditImplemnetor(e.target.value)} className='text-gray-600 border-2 p-2 border-[#0575e6] w-[240px] mx-2 rounded'>
                                            <option value="" selected className='hidden'>{editImplemnetor}</option>
                                            {props.Users.map((item) => (<>
                                                {item.Implementor == "Yes" ?
                                                    <option>

                                                        {item.name}
                                                    </option>
                                                    : <></>}
                                            </>))}

                                        </select>
                                    </div>
                                    <div className='flex  pt-2 flex-col'>

                                        <label htmlFor="" className=' mx-2 pb-1'>Mapping Specification</label>
                                        <input type="file" onChange={handleFileUpload} name="file-input" id="file-input" className="text-gray-500 file:text-white mx-2 block w-[240px] border-2 border-[#0575e6] rounded text-sm disabled:opacity-50 disabled:pointer-events-none file:bg-[#0575e6] file:border-0 file:me-2 file:py-2 file:px-1" />
                                    </div>
                                </div>
                                <div className="flex pt-4 ">
                                    {/* <div onClick={() => settogglrEdit("hidden")}>Cancel</div> */}
                                    <button onClick={() => { settogglrEdit("hidden") }} className="mx-2 p-1 border-2 w-28 text-center border-[#0575e6] rounded-md">Cancel</button>
                                    <div onClick={handleEditSubmit} className="flex items-center justify-center border-2 ml-[136px] w-28 cursor-pointer text-center bg-[#0575e6] border-black rounded-md text-white mr-3">Submit</div>

                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className={byRemarkdilogbox}>

                <div className="bg-opacity-20 backdrop-blur-sm bg-black h-screen w-screen fixed z-30 top-0 left-0 flex items-center justify-center">
                    <div className="bg-white w-full  border-2 mx-52 rounded flex flex-col items-end">
                        <button onClick={() => setbyRemarkdilogbox("scale-0")} className='justify-right mx-4 py-2'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                        </button>
                        <div className="flex items-start w-full px-4 pb-4">
                            <div className="flex flex-col items-start w-full h-52 overflow-auto">
                                {props.data.BYRemark ? JSON.parse(props.data.BYRemark).notes.map((item, index) => (

                                    <div className='border-2 my-2 p-2 w-full flex justify-between'>{item}
                                        <button className='text-sm text-red-500' onClick={() => deleteByRemark(index)}>

                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>

                                        </button>
                                    </div>

                                )) : <>

                                    <div className='font-bold my-2 p-2 w-full'></div>
                                </>}

                            </div>
                            <div className="flex flex-col w-96  ">
                                <textarea onChange={(e) => settempByRemark(dayjs().format("DD/MM/YY") + ": " + e.target.value)} className="flex flex-col m-2 h-36">

                                </textarea>
                                <button onClick={handleAddByRemark} className="flex flex-col m-2 bg-[#0575e6] rounded h-10 items-center justify-center text-white font-medium">
                                    Add Note
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className={NotesDialogBox}>

                <div className="bg-opacity-20 backdrop-blur-sm bg-black h-screen w-screen fixed z-30 top-0 left-0 flex items-center justify-center">
                    <div className="bg-white w-full  border-2 mx-52 rounded flex flex-col items-end">
                        <button onClick={() => setNotesDialogBox("scale-0")} className='justify-right mx-4 py-2'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                        </button>
                        <div className="flex items-start w-full px-4 pb-4">
                            <div className="flex flex-col items-start w-full h-52 overflow-auto">
                                {props.data.Notes ? JSON.parse(props.data.Notes).notes.map((item, index) => (

                                    <div className='border-2 my-2 p-2 w-full flex justify-between'>{item}
                                        <button className='text-sm text-red-500' onClick={() => deleteNotes(index)}>

                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>

                                        </button>
                                    </div>

                                )) : <>

                                    <div className='font-bold my-2 p-2 w-full'></div>
                                </>}

                            </div>
                            <div className="flex flex-col w-96  ">
                                <textarea onChange={(e) => settempNotes(dayjs().format("DD/MM/YY") + ": " + e.target.value)} className="flex flex-col m-2 h-36">

                                </textarea>
                                <button onClick={handleAddNotes} className="flex flex-col m-2 bg-[#0575e6] rounded h-10 items-center justify-center text-white font-medium">
                                    Add Note
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <tr class="bg-white text-left border-b font-normal">
                <th class="px-6 py-4 w-5 font-normal text-left">
                    {props.data.RequestID}
                </th>
                <th class="px-6 py-4 w-5 font-normal text-left whitespace-nowrap">
                    {props.data.Customer.slice(4)}
                </th>
                <th class="px-6 py-4 w-5 font-normal text-left whitespace-nowrap">
                    {props.data.CustomerCode}
                </th>
                <td class="px-9 py-4 mt-0">
                    <div className="whitespace-nowrap">
                        {props.data.ProjectType}

                    </div>
                </td>
                <th class="font-normal text-sm ">
                    <input type="text" className="w-28 border-0 py-0 my-0 text-sm" placeholder='Enter Value' value={Jira} onChange={(e) => setJira(e.target.value)} />
                    {/* {/* <div className="">

                        <ReactTags
                            inline
                            tags={tags}
                            classNames={{
                                tags: 'flex flex-wrap',
                                tagInput: ' border-0 focus:outline-none text-sm',
                                tagInputField: 'w-28 border-0 focus:outline-none text-sm',
                                selected: 'flex flex-wrap gap-1 ',
                                tag: 'bg-[#0575e6] p-[2px] m-[2px] hidden text-white rounded text-xs',
                                remove: 'ml-1 cursor-pointer'
                            }}
                            delimiters={delimiters}
                            handleDelete={handleDelete}
                            handleAddition={handleAddition}
                            inputFieldPosition="inline"
                            placeholder={tags.length !== 0 ? tags.map(item => item.text).join(', ') : props.data.Jira}

                            autofocus={false}
                            handleInputBlur={(e) => {
                                if (e != "") {

                                    setTags([...tags, { id: e, text: e }])
                                }
                            }
                            }

                        /> */}
                    {/* </div> */}
                </th>
                <th class="px-6 py-4 w-2 font-normal">
                    <select onChange={(e) => setSeverity(e.target.value)} className='border-0 py-0 w-28 text-sm'>
                        <option selected className='hidden'>{Severity}</option>
                        <option>Low</option>
                        <option>Critical</option>
                        <option>High</option>
                        <option>Medium</option>
                    </select>

                </th>
                <td class="px-6 py-4  ">

                    {props.data.ProjectedGoLive}

                </td>

                <td class="px-6 py-4 mt-0">
                    <div className="w-20 flex  rounded-full items-center overflow-hidden">

                        <div className={`  h-5 overflow-hidden`} style={{ width: `${completion}%`, backgroundColor: progressColor }}>
                        </div>
                        <div className='w-20 text-center z-10 absolute text-sm '>
                            {Math.floor(completion)} %
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 mt-0">
                    <div className="">
                        {calMilestione}
                    </div>
                </td>
                <td class="px-6 py-4 mt-0 text-center" >

                    <Link to={`/?search=${props.data.Customer.slice(4)}`} className="">
                        <span>{k}</span>
                    </Link>
                </td>
                <td class="px-6 py-4 mt-0">
                    <div className="">
                        {/* <select onChange={(e) => setCProjectLead(e.target.value)} className='border-0 py-0 w-64 text-sm'>
                            <option selected className='hidden'>{props.data.ProjectLead}</option>
                            {props.Users.map((item) => (<>
                                {item.type != "admin" ?
                                    <option>
                                        {item.name}
                                    </option>
                                    : <></>}
                            </>))}
                        </select> */}
                        <Select
                            isMulti
                            styles={customStyles}
                            options={props.Users.filter(item => item.type !== 'admin').map(item => ({
                                value: item.name,
                                label: item.name
                            }))}
                            className="basic-multi-select rounded border-0  my-3 w-64"
                            classNamePrefix="select"
                            placeholder={props.data.ProjectLead.slice(1)}
                            isSearchable={false}
                            onChange={(e) => {
                                let x = ""
                                for (let i = 0; i < e.length; i++) {
                                    x = x + ", " + e[i].value
                                }
                                setCProjectLead(x);
                                setSelected(e)
                            }}
                        />

                    </div>
                </td>

                <td class="px-9 py-4 mt-0">
                    <div className="whitespace-nowrap">

                        {props.data.Developer}

                    </div>
                </td>
                <td class="px-9 py-4 mt-0">
                    <div className="whitespace-nowrap">
                        {props.data.Implementor}
                    </div>
                </td>
                <td class="px-6 py-4 mt-0">
                    <div className="">
                        <select onChange={(e) => setCEnv(e.target.value)} className='border-0 py-0 w-40 text-sm'>
                            <option selected className='hidden'>{props.data.Environment}</option>
                            <option>Private Cloud NA</option>
                            <option>Private Cloud EU</option>
                            <option>Azure NA</option>
                            <option>Azure EU</option>
                        </select>

                    </div>
                </td>
                <td class="px-6 py-4 mt-0">
                    <div className="">
                        <select onChange={(e) => setCDE(e.target.value)} className='border-0 py-0 w-36 text-sm'>
                            <option selected className='hidden'>{props.data.DevEnviornment}</option>
                            <option>In Progress</option>
                            <option>On Hold</option>
                            <option>Cancelled</option>
                            <option>Completed</option>
                        </select>

                    </div>
                </td>
                <td class="px-6 py-4 mt-0">
                    <div className="">
                        <select onChange={(e) => setCQA(e.target.value)} className='border-0 py-0 w-36 text-sm'>
                            <option selected className='hidden'>{props.data.QAEnviornment}</option>
                            <option>In Progress</option>
                            <option>On Hold</option>
                            <option>Cancelled</option>
                            <option>Completed</option>
                        </select>

                    </div>
                </td>
                <td class="px-6 py-4 mt-0">
                    <div className="">
                        <select onChange={(e) => setCProduction(e.target.value)} className='border-0 py-0 w-36 text-sm'>
                            <option selected className='hidden'>{props.data.Production}</option>
                            <option>In Progress</option>
                            <option>On Hold</option>
                            <option>Cancelled</option>
                            <option>Completed</option>
                        </select>

                    </div>
                </td>
                <td class=" py-4 mt-0">
                    <div className="">
                        <select onChange={(e) => setCGoLive(e.target.value)} className='border-0 py-0 w-36 text-sm'>
                            <option selected className='hidden'>{props.data.GoLive}</option>
                            <option>In Progress</option>
                            <option>On Hold</option>
                            <option>Cancelled</option>
                            <option>Completed</option>
                        </select>

                    </div>
                </td>
                <td class="px-6 py-4 mt-0 whitespace-nowrap">
                    <div className="">
                        <div>{props.data.EDIVersion.slice(1)}</div>
                    </div>
                </td>
                <td class="px-6 py-4 mt-0">
                    <div className="">
                        <div>{props.data.EDIMessageType.slice(1)}</div>
                    </div>
                </td>
                <td class="px-6 py-4 mt-0 ">
                    <div className="">
                        {props.data.MappingSpecification ?
                            <a href={props.data.MappingSpecification} className='text-[#0575E6] underline text-clip overflow-hidden w-5'>
                                {props.data.MappingSpecification.substring(props.data.MappingSpecification.lastIndexOf("/") + 1)}
                            </a>
                            : <></>}

                    </div>
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

                        <button onClick={() => setNotesDialogBox("")}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>


                </td>



                <td>
                    <div className='flex items-center justify-center pr-6'>
                        {localStorage.getItem('type') == "admin" || props.data.ProjectLead == localStorage.getItem('name') ?
                            <>
                                <button onClick={sync} className="border- border-[#0575E6] rounded-md  mx-2 ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#0575E6]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>

                                </button>
                                <button className='text-sm text-[#0575e6] px-2' onClick={() => { settogglrEdit("fixed top-0 left-0") }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>

                                </button>
                            </>

                            : <></>}
                        {localStorage.getItem('type') == "admin" ?

                            <button className='text-sm text-red-500' onClick={deleteRow}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>

                            </button>
                            : <></>}
                    </div>
                </td>
            </tr>
        </>
    )
}

export default Pitems