import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import flatpickr from "flatpickr";
import dayjs from 'dayjs';
import * as Yup from 'yup';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';

import Pitems from '../components/Pitems';
import Select from 'react-select';
import { useProjectsContext } from '../context/ProjectsProvider';
// import { useUserContext } from '../context/UserProvider';
import { useOBContext } from '../context/OBProvider';
import { ToastContainer, toast } from 'react-toastify';
import { WithContext as ReactTags } from 'react-tag-input';
import axios from 'axios';

let now = dayjs();

function Project() {
  const { OB, setOB } = useOBContext();


  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);

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

  const day = now.format("hhss")
  const [Cname, setCname] = useState();
  const [CCode, setCCode] = useState();
  const token = localStorage.getItem('jwt');
  const [ProjectedGoLive, setProjectedGoLive] = useState();
  const [Milestone, setMilestone] = useState("Stable");
  const [EDIVersion, setEDIVersion] = useState();
  const [ProjectType, setProjectType] = useState();
  const [Developer, setDeveloper] = useState();
  const [Implementor, setImplementor] = useState();
  const [ProjectLead, setProjectLead] = useState();
  const [Environment, setEnvironment] = useState("Select");
  const [CarrierOnboarding, setCarrierOnboarding] = useState("10");
  const [Dev_Environment, setDev_Environment] = useState("ETA: 01 APR 24");
  const [Production, setProduction] = useState("ETA: 01 APR 24");
  const [GoLive, setGoLive] = useState("ETA: 01 APR 24");
  const [toggleNewProject, settoggleNewProject] = useState("hidden");
  const [Users, setUsers] = useState([])
  const [time, settime] = useState("");
  // const [Projects, setProjects] = useState([]);
  // const { Users, setUsers } = useUserContext();    
  const { Projects, setProjects } = useProjectsContext();
  const [QAEnviornment, setQAEnviornment] = useState("ETA: 01 APR 24");
  useEffect(() => {
    getUser();
    // getProjects();
  }, [])
  const getUser = async () => {

    let url = import.meta.env.VITE_REACT_APP_BASE_URL + "/user";
    let data = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Include the JWT in the Authorization header
        'Authorization': `Bearer ${token}`
      }
    });
    let passedData = await data.json();
    setUsers(passedData);
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
    setProjects(passedData);
  }

  useEffect(() => {
    const date1 = dayjs()
    const date2 = dayjs(ProjectedGoLive)
    // console.log(date2.format("ll"));
    var diff1 = Math.abs(date2.subtract(7, 'day').diff(date1, 'day') / 3)
    // console.log(diff1);
    var dev = dayjs(date2.subtract(7, 'day')).subtract(Math.floor(diff1) * 2, 'day');
    setDev_Environment(dev.format('ll'));

    // var diff2 = 2 * (date2.diff(date1, 'day') / 3)
    var qa = dayjs(date2.subtract(7, 'day')).subtract(Math.floor(diff1), 'day');
    setQAEnviornment(qa.format('ll'));
    setProduction(date2.subtract(7, 'day').format('ll'))
    setGoLive(ProjectedGoLive)


  }, [ProjectedGoLive]);

  const projectSchema = Yup.object().shape({
    RequestID: Yup.string()
      .required('RequestID is required'),
    Customer: Yup.string()
      .matches(/^[a-zA-Z0-9\s]*$/, 'No special characters allowed')
      .required('Enter Value'),
    ProjectedGoLive: Yup.date()
      .required('Projected Go Live date is required'),
    Milestone: Yup.string()
      .required('Milestone is required'),
    EDIVersion: Yup.string()
      .required('EDI Version is required'),
    EDIMessageType: Yup.string()
      .required('EDI Message Type is required'),
    ProjectLead: Yup.string()
      .required('Project Lead is required'),
    Environment: Yup.string()
      .required('Environment is required'),
    CarrierOnboarding: Yup.string()
      .required('Carrier Onboarding is required'),
    Dev_Environment: Yup.string()
      .required('Development Environment is required'),
    Production: Yup.string()
      .required('Production is required'),
    GoLive: Yup.date()
      .required('Go Live date is required'),
    QAEnviornment: Yup.string()
      .required('QA Environment is required'),
    ProjectType: Yup.string()
      .required('Project Lead is required'),
    Implementor: Yup.string()
      .required('Implementor is required'),
    Developer: Yup.string()
      .required('Developer is required'),
    file: Yup.mixed().required('Please upload mapping specification')
    // CCode: Yup.string()
    //   .matches(/^[a-zA-Z0-9\s]{1,4}$/, 'No special characters allowed and max 4 letters')
    //   .required('Enter Value'),

  });
  const [errors, seterrors] = useState("");
  function newProject(newFileName) {

   
    projectSchema.validate({
      RequestID: day + CCode,
      Customer: Cname,
      ProjectedGoLive: ProjectedGoLive,
      Milestone: Milestone,
      EDIVersion: EDIVersion,
      EDIMessageType: EDIMessageType,
      ProjectLead: ProjectLead,
      Environment: Environment,
      CarrierOnboarding: CarrierOnboarding,
      Dev_Environment: Dev_Environment,
      Production: Production,
      GoLive: GoLive,
      QAEnviornment: QAEnviornment,
      file: file,
      ProjectType: ProjectType,
      Developer: Developer,
      Implementor: Implementor,
    }, { abortEarly: false }) // Set abortEarly to false to get all errors
      .then(() => {

        const publicUrl = `https://${import.meta.env.VITE_STORAGE_ACC_NAME}.blob.core.windows.net/${import.meta.env.VITE_STORAGE_CONTAINER_NAME}/${file.name}`;
        fetch(import.meta.env.VITE_REACT_APP_BASE_URL + '/newProject', {
          method: 'POST',
          body: JSON.stringify({
            RequestID: day + CCode.split(",")[0].toString(),
            Customer: ProjectType === 'Upgrade' ? day+Cname + '_' + ProjectType : day+Cname,
            CustomerCode: CCode,
            ProjectedGoLive: ProjectedGoLive,
            Milestone: Milestone,
            EDIVersion: EDIVersion,
            EDIMessageType: EDIMessageType,
            ProjectLead: ProjectLead,
            Implementor: Implementor,
            Developer: Developer,
            Environment: Environment,
            CarrierOnboarding: CarrierOnboarding,
            Dev_Environment: Dev_Environment,
            Production: Production,
            GoLive: GoLive,
            QAEnviornment: QAEnviornment,
            MappingSpecification: publicUrl,
            ProjectType: ProjectType
            // BYRemark: now.format("DD/MM/YY")
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${token}`

          },
        })
          .then()
        for (let i = 1; i < ProjectLead.split(", ").length; i++) {

          fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/newNoti", {
            method: 'POST',
            body: JSON.stringify({
              userID: ProjectLead.split(", ")[i],
              msg: `${day + CCode.split(",")[0].toString()} has been assigned to you by ${localStorage.getItem('name')}`,
              assignedBY: localStorage.getItem('name')
            }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8',
              'Authorization': `Bearer ${token}`

            },
          })
        }
        fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/newNoti", {
          method: 'POST',
          body: JSON.stringify({
            userID: Developer,
            msg: `${day + CCode.split(",")[0].toString()} has been assigned to you by ${localStorage.getItem('name')}`,
            assignedBY: localStorage.getItem('name')
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${token}`

          },
        })
        fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/newNoti", {
          method: 'POST',
          body: JSON.stringify({
            userID: Implementor,
            msg: `${day + CCode.split(",")[0].toString()} has been assigned to you by ${localStorage.getItem('name')}`,
            assignedBY: localStorage.getItem('name')
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${token}`

          },
        })
          .then((response) => window.location.reload(false))

          .catch((error) => {
            // Handle errors here
            console.error('Error:', error);
          });
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
          seterrors('Error: ' + error.message);
        }

      });

  }

  const [toggleFileUpload, settoggleFileUpload] = useState("hidden");
  const [file, setFile] = useState(null);
  async function handleSubmit() {
    const newFileName = new Date().toISOString();
    toast("New Projcet", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "light"
    })
    await submitFile(newFileName)
    newProject(newFileName)
  }

  const submitFile = async (newFileName) => {
    // event.preventDefault();
    settime(newFileName)
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
  };
  const [delError, setdelError] = useState("");
  const [expJSON, setexpJSON] = useState([]);


  useEffect(() => {
    let templist = []
    for (let i = 0; i < Projects.length; i++) {
      var k = 0
      for (let j = 0; j < OB.length; j++) {
        if (OB[j].Customer == Projects[i].Customer) {
          k++
        }
      }
      let BYRemarklist = [];
      if (Projects[i].BYRemark) {

        for (let k = 0; k < JSON.parse(Projects[i].BYRemark).notes.length; k++) {
          BYRemarklist.push(JSON.parse(Projects[i].BYRemark).notes[k] + " \n");
        }
      }

      // console.log(BYRemarklist);
      // console.log(k);
      let obj = {
        "RequestID": Projects[i].RequestID,
        "Customer Name": Projects[i].Customer.slice(4),
        "Customer Code": Projects[i].CustomerCode,
        "Project Type": Projects[i].ProjectType,
        "Jira": Projects[i].Jira,
        "Severity": Projects[i].Severity,
        "Projected Go Live": Projects[i].ProjectedGoLive,
        "Carrier Onboarding": k,
        "Project Lead": Projects[i].ProjectLead,
        "Developer": Projects[i].Developer,
        "Implemnetor": Projects[i].Implementor,
        "Environment": Projects[i].Environment,
        "Dev Enviornment": Projects[i].DevEnviornment,
        "QA Enviornment": Projects[i].QAEnviornment,
        "Production Environment": Projects[i].Production,
        "Go Live ": Projects[i].GoLive,
        "EDI Version": Projects[i].EDIVersion.slice(1),
        "EDI Message Type": Projects[i].EDIMessageType.slice(1),
        "BYRemarks": BYRemarklist


      }
      templist.push(obj)

    }
    // console.log(templist);
    setexpJSON(templist)
  }, [Projects, OB]);
  const [searchMilestone, setsearchMilestone] = useState();
  const [seachItemM, setseachItemM] = useState();
  function MilestoneSearch(x, y) {
    setseachItemM(x)
    setsearchMilestone(y)
    // console.log(JSON.stringify(seachItemM), searchMilestone)
  }
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setfilteredData] = useState(Projects);
  useEffect(() => {

    MilestoneSearch()
  }, [seachItemM]);
  useEffect(() => {
    const newfilteredData = Projects.filter(item =>
      (item.Customer && item.Customer.slice(4).toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.RequestID && item.RequestID.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.CustomerCode && item.CustomerCode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      // (item.searchMilestone && item.searchMilestone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.Milestone && item.Milestone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.ProjectLead && item.ProjectLead.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setfilteredData(newfilteredData)
    // console.log(newfilteredData);
  }, [searchTerm]);
  const [tags, setTags] = React.useState([]);

  const handleDelete = i => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = tag => {
    setTags([...tags, tag]);
  };
  useEffect(() => {
    const commaSeparatedString = tags.map(item => item.text).join(', ');
    // console.log(commaSeparatedString);
    setCCode(commaSeparatedString)

  }, [tags]);
  const KeyCodes = {
    comma: 188,
    enter: 13,
    space: 32,
  };
  const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.space];

  return (
    <>
      <div className={toggleNewProject}>
        <div className="fixed h-screen w-screen bg-black bg-opacity-20 backdrop-blur-sm z-50 transition-opacity	duration-700">
          <div className="flex flex-col h-screen items-center justify-center">
            <div className="bg-white w-1/2  rounded-md p-6 overflow-auto">
              <div className="flex flex-col p-16">
                <div className="flex items-center text-xl font-semibold">
                  New Project

                </div>
                <div className="text-red-500 text-sm">
                  {errors}
                </div>
                <div className="flex mt-5 text-gray-500">
                  <div className="basis-1/2 flex flex-col">

                    <input type="text" value={Cname} onChange={(e) => setCname(e.target.value)} className='border-2 border-[#0575e6] p-2 w-52 my-3 rounded' placeholder='Customer name' />
                    {/* <select name="cars" onChange={(e) => setEDIVersion(e.target.value)} id="cars" className='border-2 p-2 border-[#0575e6] w-52 my-3 rounded'>
                      <option value="" selected className='hidden'>EDI Version</option>
                      <option value="X12 4010">X12 4010</option>
                      <option value="X12 5010">X12 5010</option>
                      <option value="EDIFACT D-09A">EDIFACT D-09A</option>

                    </select> */}
                    <Select
                      isMulti
                      name="colors"
                      options={[{ value: 'X12 4010', label: 'X12 4010' }, { value: 'X12 5010', label: 'X12 5010' }, { value: 'EDIFACT D-09A', label: 'EDIFACT D-09A' }]}
                      className="basic-multi-select rounded border-2 border-[#0575e6] my-3 w-52"
                      classNamePrefix="select"
                      placeholder="EDI Version"
                      isSearchable={false}
                      onChange={(e) => {
                        let x = ""
                        for (let i = 0; i < e.length; i++) {
                          x = x + ", " + e[i].value
                        }
                        setEDIVersion(x);
                        setSelected(e)
                      }}
                    />
                    {/* <select onChange={(e) => setProjectLead(e.target.value)} id="cars" className='border-2 p-2 border-[#0575e6] w-52 my-3 rounded'>
                      <option selected className='hidden'>Project Lead</option>
                      {Users.map((item) => (

                        <option>{item.name}</option>
                      ))}


                    </select> */}
                    <Select
                      isMulti
                      name="colors"
                      options={Users.map(item => {
                        if (item.type !== 'admin') {
                            return {
                                value: item.name,
                                label: item.name
                            }
                        }
                    }).filter(Boolean)}
                    
                      className="basic-multi-select rounded border-2 border-[#0575e6] my-3 w-52"
                      classNamePrefix="select"
                      placeholder="Project Lead"
                      isSearchable={false}
                      onChange={(e) => {
                        let x = ""
                        for (let i = 0; i < e.length; i++) {
                          x = x + ", " + e[i].value
                        }
                        setProjectLead(x);
                        setSelected(e)
                      }}
                    />
                    <div className="my-3">

                      <LocalizationProvider dateAdapter={AdapterDayjs} >

                        <DatePicker onChange={(e) => {
                          var n = dayjs(e);
                          console.log(n.format("ll"));
                          setProjectedGoLive(n.format("ll"))
                        }} value={ProjectedGoLive} className='border-2 border-[#0575e6] w-40 my-3 rounded '
                          slotProps={{
                            textField: {
                              placeholder: 'Projected Go Live',
                              size: 'small',
                              inputProps: { // This targets the input element directly
                                style: {
                                  fontSize: 16, // This reduces the font size
                                },
                              }, // This reduces the height of the TextField
                            }
                          }}
                          sx={{
                            width: 208,
                            border: 1,
                            borderColor: "#0575e6",
                            fontSize: 2, // This reduces the font size
                            lineHeight: 4,
                            padding: 0,
                            margin: 0,
                          }} />
                      </LocalizationProvider>

                    </div>
                    <select name="cars" onChange={(e) => setProjectType(e.target.value)} id="cars" className='border-2 p-2 border-[#0575e6] w-52 my-3 rounded'>
                      <option value="" selected className='hidden'>Project Type</option>
                      <option value="New">New</option>
                      <option value="Upgrade">Upgrade</option>

                    </select>
                  </div>
                  <div className="basis-1/2 flex flex-col">

                    {/* <input type="text" onChange={(e) => setCCode(e.target.value)} value={CCode} className='border-2 border-[#0575e6] p-2 w-52 my-3 rounded' placeholder='Customer Code' /> */}
                    <div className="border-[#0575e6] my-3  w-52 border-2 rounded">

                      <ReactTags
                        inline
                        tags={tags}
                        classNames={{
                          tags: 'flex flex-wrap',
                          tagInput: 'w-auto border-0 focus:outline-none',
                          tagInputField: 'border-0 focus:outline-none',
                          selected: 'flex flex-wrap gap-2',
                          tag: 'bg-[#0575e6] p-[2px] m-[2px] text-white rounded text-xs',
                          remove: 'ml-1 cursor-pointer'
                        }}
                        delimiters={delimiters}
                        handleDelete={handleDelete}
                        handleAddition={handleAddition}
                        inputFieldPosition="inline"
                        placeholder='Customer Code'
                        autofocus={false}
                            handleInputBlur={(e) => {
                                if (e != "") {

                                    setTags([...tags, { id: e, text: e }])
                                }
                            }}
                      />
                    </div>
                    <Select
                      isMulti
                      name="colors"
                      options={options}
                      className="basic-multi-select rounded border-2 border-[#0575e6] my-3 w-52"
                      classNamePrefix="select"
                      placeholder="EDI Message Type"
                      isSearchable={false}
                      onChange={(e) => {
                        let x = ""
                        for (let i = 0; i < e.length; i++) {
                          x = x + "," + e[i].value
                        }
                        setEDIMessageType(x);
                        setSelected(e)
                      }}
                    />
                    {/* <input type='file' onChange={handleFileUpload} /> */}

                    {/* <label for="file-input" class="sr-only">Upload Mapping Documents</label> */}
                    <select name="cars" onChange={(e) => setDeveloper(e.target.value)} id="cars" className='border-2 p-2 border-[#0575e6] w-52 my-3 rounded'>
                      <option value="" selected className='hidden'>Developer</option>
                      {Users.map((item) => (<>
                        {item.Developer == "Yes" ?
                          <option>

                            {item.name}
                          </option>
                          : <></>}
                      </>))}

                    </select>
                    <select name="cars" onChange={(e) => setImplementor(e.target.value)} id="cars" className='border-2 p-2 border-[#0575e6] w-52 my-3 rounded'>
                      <option value="" selected className='hidden'>Implementor</option>
                      {Users.map((item) => (<>
                        {item.Implementor == "Yes" ?
                          <option>

                            {item.name}
                          </option>
                          : <></>}
                      </>))}

                    </select>

                    <input type="file" onChange={handleFileUpload} name="file-input" id="file-input" className="text-gray-500 file:text-white my-3 block w-52 border-2 border-[#0575e6] rounded text-sm disabled:opacity-50 disabled:pointer-events-none file:bg-[#0575e6] file:border-0 file:me-2 file:py-2 file:px-1" />
                  </div>
                </div>
                <div className='flex mt-5'>

                  <button onClick={() => { window.location.reload() }} className=" p-1 border-2 w-28 text-center border-[#0575e6] rounded-md">Cancel</button>


                  <button onClick={handleSubmit} className="border-2 w-28 mx-14 text-center bg-[#0575e6] border-black rounded-md text-white">Submit</button>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={toggleFileUpload}>
        <div className="h-screen w-screen fixed bg-black bg-opacity-20 backdrop-blur-sm z-20 transition-opacity	duration-700">
          <div className="flex flex-col h-screen items-center justify-center">
            <div className="bg-white w-1/4 h-2/6 rounded-md p-8 flex flex-col">
              <div className="font-bold text-xl">
                Upload document
              </div>
              <div className="text-xs mt-3 text-[#E84500]">
                Note: Ensure that the document contains all the necessary details required for the trading partner setup.
              </div>
              <div className="border mt-4 p-3 w-60 self-center rounded-lg border-[#0575e6] flex items-center justify-center">
                <svg width="25" height="18" viewBox="0 0 25 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5052 17.3636V10M12.5052 10L16.1002 12.8636M12.5052 10L8.91016 12.8636" stroke="#0575E6" stroke-linecap="round" stroke-linejoin="round" />
                  <path d="M20.7227 13.7696C22.257 13.2908 23.8042 12.2 23.8042 10C23.8042 6.72727 20.3804 5.90909 18.6684 5.90909C18.6684 4.27273 18.6684 1 12.5056 1C6.34274 1 6.34274 4.27273 6.34274 5.90909C4.63083 5.90909 1.20703 6.72727 1.20703 10C1.20703 12.2 2.75419 13.2908 4.28846 13.7696" stroke="#0575E6" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <form onSubmit={submitFile} enctype="multipart/form-data">
                  <input type='file' onChange={handleFileUpload} />
                  <button className='mx-2' type='submit'>
                    Upload or Drag & Drop

                  </button>
                </form>
              </div>
              <div className="flex justify-around mt-6">
                <div className="border h-8 w-24 flex items-center justify-center rounded-lg border-[#0575e6] text-[#0575e6]">Cancel</div>

                <div className="border h-8 w-24 flex items-center justify-center rounded-lg bg-[#0575e6] text-white">Submit</div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col h-screen p-16'>
        <Nav settoggleNewProject={settoggleNewProject} expJSON={expJSON} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <div className="text-xs text-red-500 text-center">

          {delError}
        </div>
        <div className="mt-5">
          <div class=" relative h-96 overflow-x-auto rounded">
            <table class="w-full text-sm text-left rtl:text-right ">
              <thead class="text-xs  uppercase bg-[#0575e6] text-white font-light">
                <tr>
                  <th scope="col" class="bg-[#0575e6] sticky top-0 px-6 py-3 whitespace-nowrap">
                    Requset Id
                  </th>
                  <th scope="col" class="bg-[#0575e6] sticky top-0 px-6 py-3">
                    Customer
                  </th>
                  <th scope="col" class="bg-[#0575e6] sticky top-0 px-6 py-3 whitespace-nowrap">
                    Customer Code
                  </th>
                  <th scope="col" class="bg-[#0575e6] sticky top-0 px-9 py-3 whitespace-nowrap">
                    Project Type
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
                  <th scope="col" class="bg-[#0575e6] sticky z-40 top-0 px-6 py-3 whitespace-nowrap">
                    Completion %
                  </th>
                  <th scope="col" class="bg-[#0575e6] sticky top-0 px-6 py-3">
                    Milestone
                  </th>
                  <th scope="col" class="bg-[#0575e6] sticky top-0 px-6 py-3 whitespace-nowrap">
                    Carrier Onboarding
                  </th>
                  <th scope="col" class="bg-[#0575e6] sticky top-0 px-9 z-20 py-3 whitespace-nowrap">
                    Project Lead
                  </th>

                  <th scope="col" class="bg-[#0575e6] sticky top-0 px-9 py-3 whitespace-nowrap">
                    Developer
                  </th>
                  <th scope="col" class="bg-[#0575e6] sticky top-0 px-9 py-3 whitespace-nowrap">
                    Implementor
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
                    Mapping Specification
                  </th>
                  <th scope="col" class="sticky bg-[#0575e6] top-0 px-6 py-3 whitespace-nowrap">
                    BY Remarks
                  </th>
                  <th scope="col" class="sticky bg-[#0575e6] top-0 px-6 py-3 whitespace-nowrap">
                    Notes
                  </th>
                  <th scope="col" class=" bg-[#0575e6] sticky top-0 px-6 py-3 whitespace-nowrap">

                  </th>

                </tr>
              </thead>
              <tbody>

                {filteredData.length != 0 ? filteredData.map((item, index) => (

                  <Pitems data={item} setEnvironment={setEnvironment} Users={Users} setdelError={setdelError} MilestoneSearch={MilestoneSearch} index={index} />
                )) : Projects.map((item, index) => (

                  <Pitems data={item} setEnvironment={setEnvironment} Users={Users} setdelError={setdelError} MilestoneSearch={MilestoneSearch} index={index} />
                ))}




              </tbody>
            </table>
          </div>


        </div>
      </div>
    </>
  )
}

export default Project