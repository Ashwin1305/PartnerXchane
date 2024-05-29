import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
let now = dayjs();
import * as Yup from 'yup';
import { useOBContext } from '../context/OBProvider';

import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';


function OBitems(props) {
    const { OB, setOB } = useOBContext();

    const day = now.format("DDMMYYHHMMss")
    const token = localStorage.getItem('jwt');
    const [IPOwner, setIPOwner] = useState(props.data.IPOwner)
    const [OCValidation, setOCValidation] = useState(props.data.OCValidation);
    const [TestingJSON, setTestingJSON] = useState(props.data.TestingJSON);
    const [GoLive, setGoLive] = useState(props.data.GoLive);
    const [SFTP, setSFTP] = useState(props.data.SFTP);
    const [BYRemark, setBYRemark] = useState(props.data.BYRemarks);
    const [calMilestione, setcalMilestione] = useState();
    const [TradingPartnerSetup, setTradingPartnerSetup] = useState(props.data.TradingPartnerSetup);
    const [completion, setcompletion] = useState();

    let x = JSON.parse(TestingJSON);
    // console.log(props);
    useEffect(() => {
        let setCompleted = 0

        if (props.data.TradingPartnerSetup == "Completed") {
            setCompleted = setCompleted + 1
        }
        if (props.data.SFTP == "Completed") {
            setCompleted = setCompleted + 1
        }
        for (let i = 0; i < x.length; i++) {
            if (x[i]['value'] == "Completed") {
                setCompleted = setCompleted + 1
                // console.log(x[i]['name'] + "k");

            }

        }
        // console.log(x);
        setcompletion((setCompleted / (x.length + 3)) * 100)
    }, [props, OCValidation, TestingJSON, SFTP]);
    useEffect(() => {

        book("  ")

    }, [completion]);
    function book(time) {

        if (props.data.IPOwner != IPOwner) {


            fetch(import.meta.env.VITE_REACT_APP_BASE_URL + '/newNoti', {
                method: 'POST',
                body: JSON.stringify({
                    userID: IPOwner,
                    msg: `${now.format("mmss") + props.data.SCAC} has been assigned to you by ${localStorage.getItem('name')}`,
                    assignedBY: localStorage.getItem('name')
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${token}`

                },
            })
                .then((response) => response.json())

        }
        if (time == "") {
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
            console.log(time);
            var active = "true"
            if (TradingPartnerSetup == "Cancelled") {
                active = "false"
            }
            else if (SFTP == "Cancelled") {
                active = "false"
            }
            else {
                for (let i = 0; i < JSON.parse(TestingJSON).length; i++) {
                    if (JSON.parse(TestingJSON)[i]['value'] == "Cancelled") {
                        active = "false"

                    }

                }
            }
            // console.log(active);
            if (GoLive == "Completed") {
                let beforeETA = false
                if (dayjs(props.data.GoLive).isAfter(dayjs())) {
                    beforeETA = true
                }
                fetch(import.meta.env.VITE_REACT_APP_BASE_URL + '/updateMilestone/' + localStorage.getItem('name'), {
                    method: 'PUT',
                    body: JSON.stringify({
                        id: props.data.id,
                        time: dayjs().format('lll'),
                        beforeETA: beforeETA

                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Authorization': `Bearer ${token}`

                    },
                })
            }
            fetch(import.meta.env.VITE_REACT_APP_BASE_URL + '/updateOB/' + props.data.id, {
                method: 'PATCH',
                body: JSON.stringify({
                    IPOwner: IPOwner,
                    OCValidation: OCValidation,
                    TestingJSON: TestingJSON,
                    GoLive: GoLive,
                    SFTP: SFTP,
                    BYRemarks: BYRemark,
                    Notes: Notes,
                    TradingPartnerSetup: TradingPartnerSetup,
                    Completion: Math.floor(completion),
                    Milestone: calMilestione,
                    disabledArray: JSON.stringify(disabled),
                    active: active

                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${token}`

                },
            })
                .then((e) => window.location.reload())
        }




    }
    function uploadCQdoc(time) {

        console.log(time);
        toast("Uploading", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light"
        })
        fetch(import.meta.env.VITE_REACT_APP_BASE_URL + '/uploadCQdoc/' + props.data.id, {
            method: 'PATCH',
            body: JSON.stringify({
                TradingPartnerSetup: sTPS,
                SFTP: sSFTP,
                GoLive: sGoLive,
                TestingJSON: sTestingJSON,
                OCValidation: "Completed",
                CQDoc: `https://${import.meta.env.VITE_STORAGE_ACC_NAME}.blob.core.windows.net/${import.meta.env.VITE_STORAGE_CONTAINER_NAME}/${file.name}`,
                disabledArray: JSON.stringify(disabled)
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`

            },
        }).then((r) => window.location.reload())
    }


    function sync(time) {
        book(time)


    }
    function deleteRow() {
        toast("Deleting Row", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "light"
        })
        fetch(import.meta.env.VITE_REACT_APP_BASE_URL + '/deleteOB/' + props.data.id, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${token}`
            },
        })
            .then(response => {
                if (!response.ok) {
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
    useEffect(() => {
        const today = dayjs()

        // if (props.data.OCValidation == "Completed") {
        if (props.data.TradingPartnerSetup == "Completed") {
            if (props.data.SFTP == "Completed") {

                for (let i = 0; i < JSON.parse(props.data.TestingJSON).length; i++) {
                    // console.log(JSON.parse(props.data.TestingJSON)[i].value);
                    if (JSON.parse(props.data.TestingJSON)[i].value != "Completed") {
                        let date = dayjs(JSON.parse(props.data.TestingJSON)[i].value)
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

                    } else if (JSON.parse(props.data.TestingJSON)[i].value == "On Hold") {
                        setcalMilestione("Critical")
                    }

                }

            }
            else {
                let date = dayjs(props.data.SFTP)
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
            let date = dayjs(props.data.TradingPartnerSetup)
            let oneDayBefore = date.subtract(4, 'day')
            // console.log(oneDayBefore);
            if (today.isBefore(date)) {
                if (today.isBefore(oneDayBefore)) {
                    setcalMilestione("Stable")
                } else {
                    setcalMilestione("Critical")

                }
            }
            else if (today.isAfter(date)) {
                setcalMilestione("Violated")
                // break
            } else {
                setcalMilestione("Stable")

            }
        }
        if (props.data.TradingPartnerSetup == "On Hold") {
            setcalMilestione("Critical")
        }
        if (props.data.SFTP == "On Hold") {
            setcalMilestione("Critical")
        }
        // } 
        // else {
        //     let date = dayjs(props.data.OCValidation)
        //     let oneDayBefore = date.subtract(1, 'day')
        //     // console.log(oneDayBefore);
        //     if (today.isBefore(date)) {
        //         if (today.isBefore(oneDayBefore)) {
        //             setcalMilestione("Stable")
        //         } else {
        //             setcalMilestione("Critical")

        //         }
        //     }
        //     else {
        //         setcalMilestione("Violated")
        //         // break
        //     }
        // }
        // book("   ")
    });

    const [progressColor, setprogressColor] = useState();
    useEffect(() => {
        if (calMilestione == "Stable") {
            setprogressColor("#53E88E")
        }
        else if (calMilestione == "Violated") {
            setprogressColor("#FF7967")
        }
        else if (calMilestione == "Critical") {
            setprogressColor("#FFCD91")
        }
        else {
            setprogressColor("#53E88E")

        }

    }, [calMilestione]);
    const [sTestingJSON, setsTestingJSON] = useState(TestingJSON);
    const [sTPS, setsTPS] = useState(props.data.TradingPartnerSetup);
    const [sSFTP, setsSFTP] = useState(props.data.SFTP);
    const [sGoLive, setsGoLive] = useState(props.data.GoLive);
    const [settime, setsettime] = useState();
    const [CQDOC, setCQDOC] = useState(props.data.CQDoc);
    const [run, setrun] = useState();

    function handleOC(e) {
        setOCValidation(e.target.value)
        if (e.target.value == "Completed") {
            updateArray(0)
            if (localStorage.getItem('type') == "admin" || props.data.IPOwner == localStorage.getItem('name') || props.data.TPSpecialist == localStorage.getItem('name')) {

                settoggleFileUpload("fixed top-0 left-0 z-50")
            }

            if (props.data.CQDoc == null) {

                if (props.data.Phase == "Phase 1") {


                    var now = dayjs()
                    var d = dayjs(now).add(7, 'day');
                    now = d
                    setsTPS(now.format('ll'))
                    var d = dayjs(now).add(7, 'day');
                    now = d
                    setsSFTP(now.format('ll'))
                    let y = JSON.parse(props.data.TestingJSON)
                    var t = []
                    for (let i = 0; i < y.length; i++) {
                        if (y[i].name == "204") {
                            var d = dayjs(now).add(5, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "300") {
                            var d = dayjs(now).add(5, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "754") {
                            var d = dayjs(now).add(10, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "IFTMIN") {
                            var d = dayjs(now).add(10, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "IFTMBF") {
                            var d = dayjs(now).add(10, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "990") {
                            var d = dayjs(now).add(7, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "301") {
                            var d = dayjs(now).add(7, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "110") {
                            var d = dayjs(now).add(7, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "IFTSTA") {
                            var d = dayjs(now).add(14, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "753") {
                            var d = dayjs(now).add(14, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "IFTCC") {
                            var d = dayjs(now).add(14, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "214") {
                            var d = dayjs(now).add(12, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "315") {
                            var d = dayjs(now).add(12, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "323") {
                            var d = dayjs(now).add(12, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "214 SMP") {
                            var d = dayjs(now).add(12, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "210") {
                            var d = dayjs(now).add(12, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "310") {
                            var d = dayjs(now).add(12, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "210 SMP") {
                            var d = dayjs(now).add(12, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }

                    }
                    setsTestingJSON(JSON.stringify(t))
                    console.log(t);
                    var d = dayjs(now).add(7, 'day');
                    now = d
                    setsGoLive(now.format('ll'))
                    setrun(true)
                }
                if (props.data.Phase == "Phase 2") {


                    var now = dayjs()
                    var d = dayjs(now).add(10, 'day');
                    now = d
                    setsTPS(now.format('ll'))
                    var d = dayjs(now).add(10, 'day');
                    now = d
                    setsSFTP(now.format('ll'))
                    let y = JSON.parse(props.data.TestingJSON)
                    var t = []
                    for (let i = 0; i < y.length; i++) {
                        if (y[i].name == "204") {
                            var d = dayjs(now).add(7, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "300") {
                            var d = dayjs(now).add(7, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "754") {
                            var d = dayjs(now).add(14, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "IFTMIN") {
                            var d = dayjs(now).add(14, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "IFTMBF") {
                            var d = dayjs(now).add(14, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "990") {
                            var d = dayjs(now).add(10, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "301") {
                            var d = dayjs(now).add(10, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "110") {
                            var d = dayjs(now).add(10, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "IFTSTA") {
                            var d = dayjs(now).add(17, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "753") {
                            var d = dayjs(now).add(17, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "IFTCC") {
                            var d = dayjs(now).add(17, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "214") {
                            var d = dayjs(now).add(15, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "315") {
                            var d = dayjs(now).add(15, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "323") {
                            var d = dayjs(now).add(15, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "214 SMP") {
                            var d = dayjs(now).add(15, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "210") {
                            var d = dayjs(now).add(15, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "310") {
                            var d = dayjs(now).add(15, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "210 SMP") {
                            var d = dayjs(now).add(15, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }

                    }
                    setsTestingJSON(JSON.stringify(t))
                    console.log(t);
                    var d = dayjs(now).add(10, 'day');
                    now = d
                    setsGoLive(now.format('ll'))
                    setrun(true)
                }
                if (props.data.Phase == "Phase 3") {


                    var now = dayjs()
                    var d = dayjs(now).add(12, 'day');
                    now = d
                    setsTPS(now.format('ll'))
                    var d = dayjs(now).add(12, 'day');
                    now = d
                    setsSFTP(now.format('ll'))
                    let y = JSON.parse(props.data.TestingJSON)
                    var t = []
                    for (let i = 0; i < y.length; i++) {
                        if (y[i].name == "204") {
                            var d = dayjs(now).add(10, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "300") {
                            var d = dayjs(now).add(10, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "754") {
                            var d = dayjs(now).add(16, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "IFTMIN") {
                            var d = dayjs(now).add(16, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "IFTMBF") {
                            var d = dayjs(now).add(16, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "990") {
                            var d = dayjs(now).add(12, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "301") {
                            var d = dayjs(now).add(12, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "110") {
                            var d = dayjs(now).add(12, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "IFTSTA") {
                            var d = dayjs(now).add(24, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "753") {
                            var d = dayjs(now).add(24, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "IFTCC") {
                            var d = dayjs(now).add(24, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "214") {
                            var d = dayjs(now).add(20, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "315") {
                            var d = dayjs(now).add(20, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "323") {
                            var d = dayjs(now).add(20, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "214 SMP") {
                            var d = dayjs(now).add(20, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "210") {
                            var d = dayjs(now).add(20, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "310") {
                            var d = dayjs(now).add(20, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }
                        if (y[i].name == "210 SMP") {
                            var d = dayjs(now).add(20, 'day');
                            now = d
                            t.push({ name: y[i].name, value: now.format('ll') })

                        }

                    }
                    setsTestingJSON(JSON.stringify(t))
                    console.log(t);
                    var d = dayjs(now).add(12, 'day');
                    now = d
                    setsGoLive(now.format('ll'))
                    setrun(true)
                }
            }
        }
    }
    // useEffect(() => {
    //     uploadCQdoc(settime)


    // }, [run]);

    useEffect(() => {
        // console.log(TestingJSON);
        setsTestingJSON(TestingJSON)
        // console.log(sTestingJSON);
    }, [TestingJSON]);
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
            formData.append('file', file);
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
            uploadCQdoc(newFileName)

            settoggleFileUpload("hidden")
        })

    }
    const handleFileUpload = (event) => {
        setFile(event.target.files[0]);
        // console.log(setTime);

    };

    async function handlheSubmit() {
        const newFileName = new Date().toISOString();
        const publicUrl = `https://storage.googleapis.com/partnerxchange/${newFileName}`;

        console.log(publicUrl);
        await submitFile(newFileName)
        setsetTime(newFileName)

        setsettime(newFileName)
        setCQDOC(`https://storage.googleapis.com/partnerxchange/${newFileName}`)


    }
    const [disabled, setdisabled] = useState(JSON.parse(props.data.disabledArray));
    // console.log(disabled);
    function updateArray(i) {
        setdisabled(disabled => {
            let newArray = [...disabled]; // create a copy of the array
            newArray[i] = false; // update the i-th item to true
            return newArray; // return the updated array
        });
    }
    useEffect(() => {
        updateMilestone(props.data.id, calMilestione)

    }, [calMilestione]);
    const updateMilestone = (id, newMilestone) => {
        setOB(prevData =>
            prevData.map(item =>
                item.id === id ? { ...item, Milestone: newMilestone } : item
            )
        );
    };
    const [tempByRemark, settempByRemark] = useState("");
    function handleAddnotes() {
        // Parse the JSON string to an object
        let BYRemarkObj = BYRemark ? JSON.parse(BYRemark) : { notes: [] };

        // Add the new value to the notes array
        BYRemarkObj.notes.push(tempByRemark);

        // Stringify the object back to JSON
        let updatedBYRemark = JSON.stringify(BYRemarkObj);

        // Update the state
        setBYRemark(updatedBYRemark);

    }
    useEffect(() => {
        // console.log(BYRemark);
        if (props.data.BYRemarks != BYRemark) {

            book("")
        }

    }, [BYRemark]);
    const [byRemarkdilogbox, setbyRemarkdilogbox] = useState("scale-0");
    function deleteByRemark(index) {
        let arr = JSON.parse(props.data.BYRemarks).notes
        if (index > -1 && index < arr.length) {
            arr.splice(index, 1);
        }
        let updatedBYRemark = JSON.stringify({ notes: arr });

        setBYRemark(updatedBYRemark);

    }
    const [Notes, setNotes] = useState(props.data.Notes);
    const [tempNotes, settempNotes] = useState("");
    function handleAddNotes() {
        // Parse the JSON string to an object
        let NotesObj = Notes ? JSON.parse(Notes) : { notes: [] };

        // Add the new value to the notes array
        NotesObj.notes.push(tempNotes);

        // Stringify the object back to JSON
        let updatedNotes = JSON.stringify(NotesObj);

        // Update the state
        setNotes(updatedNotes);

    }
    useEffect(() => {
        // console.log(Notes);
        if (props.data.Notes != Notes) {
            fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/newNoti", {
                method: 'POST',
                body: JSON.stringify({
                    userID: props.data.TPSpecialist,
                    msg: `Check ${props.data.RequestID} Notes in Onboarding`,
                    assignedBY: localStorage.getItem('name')
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${token}`

                },
            }).then(() => book(""))
        }

    }, [Notes]);
    const [Notesdilogbox, setNotesdilogbox] = useState("scale-0");
    function deleteNotes(index) {
        let arr = JSON.parse(props.data.Notes).notes
        if (index > -1 && index < arr.length) {
            arr.splice(index, 1);
        }
        let updatedNotes = JSON.stringify({ notes: arr });

        setNotes(updatedNotes);

    }
    return (
        <>
            <div className={toggleFileUpload}>
                <div className="h-screen w-screen fixed bg-black bg-opacity-20 backdrop-blur-sm z-50 transition-opacity	duration-700">
                    <div className="flex flex-col h-screen items-center justify-center">
                        <form enctype="multipart/form-data">

                            <div className="bg-white  rounded-md p-8 flex flex-col">
                                <div className="font-bold text-xl">
                                    Upload document
                                </div>
                                <div className="text-xs mt-3 text-[#E84500]">
                                    Note: Ensure that the document contains all the necessary details required for the trading partner setup.
                                    {/* {fileUploadError} */}
                                </div>
                                <div className="text-xs mt-3 text-[#E84500]">
                                    {/* Note: Ensure that the document contains all the necessary details required for the trading partner setup. */}
                                    {fileUploadError}
                                </div>
                                <div className="mt-4 p-3  self-center rounded-lg border-[#0575e6] flex items-center justify-center">
                                    {/* <svg width="25" height="18" viewBox="0 0 25 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.5052 17.3636V10M12.5052 10L16.1002 12.8636M12.5052 10L8.91016 12.8636" stroke="#0575E6" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M20.7227 13.7696C22.257 13.2908 23.8042 12.2 23.8042 10C23.8042 6.72727 20.3804 5.90909 18.6684 5.90909C18.6684 4.27273 18.6684 1 12.5056 1C6.34274 1 6.34274 4.27273 6.34274 5.90909C4.63083 5.90909 1.20703 6.72727 1.20703 10C1.20703 12.2 2.75419 13.2908 4.28846 13.7696" stroke="#0575E6" stroke-linecap="round" stroke-linejoin="round" />
                                </svg> */}
                                    <div className='mx-2'>
                                        <input type="file" onChange={handleFileUpload} className='text-gray-500 file:text-white block w-52 border-2 border-[#0575e6] rounded text-sm disabled:opacity-50 disabled:pointer-events-none file:bg-[#0575e6] file:border-0 file:me-2 file:py-2 file:px-1' />

                                    </div>
                                </div>
                                <div className="flex justify-around mt-6">
                                    <button onClick={(e) => settoggleFileUpload("hidden")} className="border h-8 w-24 flex items-center justify-center rounded-lg border-[#0575e6] text-[#0575e6]">Cancel</button>

                                    <div onClick={handlheSubmit} className="cursor-pointer border h-8 w-24 flex items-center justify-center rounded-lg bg-[#0575e6] text-white">Submit</div>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className={byRemarkdilogbox}>

                <div className="bg-opacity-20 backdrop-blur-sm bg-black h-screen w-screen fixed z-30 top-0 left-0 flex items-center justify-center">
                    <div className="bg-white w-full  border-2 mx-52 rounded flex flex-col items-end">
                        <button onClick={() => setbyRemarkdilogbox("scale-0")} className='justify-right mx-4 py-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>

                        </button>
                        <div className="flex items-start w-full px-4 pb-4">
                            <div className="flex flex-col items-start w-full h-52 overflow-auto">
                                {props.data.BYRemarks ? JSON.parse(props.data.BYRemarks).notes.map((item, index) => (

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
                                <button onClick={handleAddnotes} className="flex flex-col m-2 bg-[#0575e6] rounded h-10 items-center justify-center text-white font-medium">
                                    Add Note
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className={Notesdilogbox}>

                <div className="bg-opacity-20 backdrop-blur-sm bg-black h-screen w-screen fixed z-30 top-0 left-0 flex items-center justify-center">
                    <div className="bg-white w-full  border-2 mx-52 rounded flex flex-col items-end">
                        <button onClick={() => setNotesdilogbox("scale-0")} className='justify-right mx-4 py-2'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
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
            <tr class="bg-white text-left border-b ">
                <td scope="row" class="px-6 py-4">
                    {props.data.RequestID}
                </td>
                <td scope="row" class="px-6 py-4 whitespace-nowrap">
                    {props.data.Customer.slice(4)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    {props.data.CarrierName}
                </td>
                <td class="px-6 py-4">
                    {props.data.SCAC}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    {props.data.Phase}
                </td>
                <td class="px-6 py-4">
                    <div className="w-20 flex  rounded-full items-center overflow-hidden">

                        <div className={`  h-5 overflow-hidden`} style={{ width: `${completion}%`, backgroundColor: progressColor }}>
                        </div>
                        <div className='w-20 text-center z-10 absolute text-sm '>
                            {Math.floor(completion)} %
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    {calMilestione == null ? <>Stable</> : <>
                        {calMilestione}</>}
                </td>
                <td class="px-6 py-4">
                    {props.data.TicketNumber}
                </td>

                <td class="px-6 py-4">
                    {props.data.TPSpecialist}
                </td>
                <td class="px-6 py-4">

                    <select onChange={(e) => { setIPOwner(e.target.value) }} className='border-0 py-0 w-56 focus:border-0 text-sm'>
                        <option selected className='hidden'>{props.data.IPOwner}</option>
                        {props.Users.map((item) => (<>
                            {item.type != "admin" ?
                                <option>

                                    {item.user}
                                </option>
                                : <></>}
                        </>))}
                    </select>
                </td>
                <td class="px-6 py-4">
                    {/* {props.data.OCValidation} */}
                    <select onChange={handleOC} placeholder='Phase' className='border-0 py-0 w-32 text-sm'>
                        <option selected className='hidden'>{props.data.OCValidation}</option>

                        <option >On Hold</option>
                        <option>Cancelled</option>
                        <option>Completed</option>
                    </select>

                    {OCValidation == "Completed" && props.data.CQDoc != null ?
                        <a href={props.data.CQDoc} className='text-xs pt-2 text-[#0575e6] underline font-semibold'>Carrier Questionnaire</a>
                        : <></>}

                </td>
                <td class="px-6 py-4">
                    {/* {props.data.OCValidation} */}
                    <select disabled={disabled[0]} onChange={(e) => {
                        setTradingPartnerSetup(e.target.value);
                        if (e.target.value == "Completed") {
                            updateArray(1)
                        }
                    }} className='border-0 py-0 w-36 text-sm'>
                        <option selected className='hidden'>{props.data.TradingPartnerSetup}</option>

                        <option>On Hold</option>
                        <option>Cancelled</option>
                        <option>Completed</option>
                    </select>
                </td>
                <td class="px-6 py-4">
                    {/* {props.data.Testing204} */}
                    <select disabled={disabled[1]} onChange={(e) => {
                        setSFTP(e.target.value); if (e.target.value == "Completed") {
                            updateArray(3)
                        }
                    }} className='border-0 py-0 w-36 text-sm'>
                        <option selected className='hidden'>{props.data.SFTP}</option>

                        <option>On Hold</option>
                        <option>Cancelled</option>
                        <option>Completed</option>
                    </select>
                </td>
                <td class="px-6 py-4">
                    {/* {props.data.Testing204} */}

                    <table class="table-auto">
                        <tbody>
                            {JSON.parse(props.data.TestingJSON && props.data.TestingJSON).map((item, index) => (
                                <tr>

                                    <td className='border p-1 w-11 bg-slate-200'>
                                        {item.name}
                                    </td>
                                    <td className='border p-1'>
                                        <select disabled={disabled[index + 3]} onChange={(e) => {
                                            for (let i = 0; i < x.length; i++) {
                                                console.log(x[i]);
                                                if (x[i]['name'][0] == item.name) {
                                                    x[i]['value'] = e.target.value;
                                                    setTestingJSON(JSON.stringify(x))

                                                }

                                            }
                                            console.log(JSON.parse(props.data.TestingJSON && props.data.TestingJSON).length);
                                            console.log(index);
                                            if (e.target.value == "Completed") {
                                                updateArray(index + 4)
                                            }
                                            if (JSON.parse(props.data.TestingJSON && props.data.TestingJSON).length == (index + 1)) {
                                                updateArray(2)
                                            }
                                        }} className='border-0 py-0 w-36 text-sm'>
                                            <option selected className='hidden'>{item.value}</option>
                                            <option>On Hold</option>
                                            <option>Cancelled</option>
                                            <option>Completed</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>




                </td>
                <td class="px-6 py-4">
                    {/* {props.data.GoLive} */}
                    <select disabled={disabled[2]} onChange={(e) => setGoLive(e.target.value)} className='border-0 py-0 w-36 text-sm'>
                        <option selected className='hidden'>{props.data.GoLive}</option>

                        <option>On Hold</option>
                        <option>Cancelled</option>
                        <option>Completed</option>
                    </select>
                </td>
                <td >
                    <div class="px-6 py-6 flex items-center justify-center">

                        <button onClick={() => setbyRemarkdilogbox("")}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>
                </td>
                <td >
                    <div class="px-6 py-6 flex items-center justify-center">

                        <button onClick={() => setNotesdilogbox("")}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>
                </td>
                <td className="pr-4">
                    <div className='flex items-center justify-center'>
                        {localStorage.getItem('type') == "admin" || props.data.IPOwner == localStorage.getItem('name') || props.data.TPSpecialist == localStorage.getItem('name') ?
                            <>
                                <button onClick={() => sync("")} className="border- border-[#0575E6] rounded-md  mx-2 ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className=" w-4 h-4 text-[#0575E6]">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>

                                </button>
                                <button className='text-sm text-[#0575e6] px-2' onClick={() => { props.settogglrEdit(""); props.seteditdata(props.data) }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>

                                </button>
                            </>
                            : <></>}
                        {localStorage.getItem('type') == "admin" ?
                            <>

                                <button className='text-sm text-red-500' onClick={deleteRow}>

                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>

                                </button>
                            </>
                            : <></>}
                    </div>

                </td>
            </tr>

        </>
    )
}

export default OBitems