import React, { useState } from 'react'
import Nav from '../components/Nav'
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';

export default function NewUser() {
    const [name, setname] = useState();
    const [password, setpassword] = useState();
    const [type, settype] = useState("user");
    const [confirmPassword, setconfirmPassword] = useState();
    const [errors, seterrors] = useState("");
    const [username, setusername] = useState("");
    const [email, setemail] = useState("");
    const [Avatar, setAvatar] = useState("");
    const token = localStorage.getItem('jwt');

    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Required Name'),
        username: Yup.string()
            .required('Required Username'),
        password: Yup.string()
            .required('Required Password'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Required'),
        type: Yup.string()
            .required('Required type'),
        Avatar: Yup.string()
            .required('Required Avatar'),
        email: Yup.string().email("Invalid email").required("Required email"),
    });
    function createUser() {

        validationSchema.validate({
            name: name,
            password: password,
            confirmPassword: confirmPassword,
            type: type,
            username: username,
            email: email,
            Avatar:Avatar
        }, { abortEarly: false })
            .then(() => {
                toast("New User", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: false,
                    draggable: false,
                    progress: undefined,
                    theme: "light"
                })
                // console.log(name, password, type);
                fetch(import.meta.env.VITE_REACT_APP_BASE_URL + "/newuser", {
                    method: 'POST',
                    body: JSON.stringify({
                        name: name,
                        password: password,
                        type: type,
                        username: username,
                        email: email,
                        Avatar:Avatar
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                        'Authorization': `Bearer ${token}`

                    },
                })
                    .then((response) => { window.location.reload() })
            }).catch((error) => {
                // Handle validation errors here
                if (error instanceof Yup.ValidationError) {
                    // Handle validation error
                    seterrors('Validation error: ' + error.errors)
                    console.error('Validation error:', error.errors);
                } else {
                    // Handle other errors (e.g., network errors)
                    console.error('Error:', error.message);
                }
            });
    }
    const countries = [
        { "value": "Avatar (1).jpg", "label": "Avatar (1)", "image": "/Avatar/Avatar (1).jpg" },
        { "value": "Avatar (2).jpg", "label": "Avatar (2)", "image": "/Avatar/Avatar (2).jpg" },
        { "value": "Avatar (3).jpg", "label": "Avatar (3)", "image": "/Avatar/Avatar (3).jpg" },
        { "value": "Avatar (4).jpg", "label": "Avatar (4)", "image": "/Avatar/Avatar (4).jpg" },
        { "value": "Avatar (5).jpg", "label": "Avatar (5)", "image": "/Avatar/Avatar (5).jpg" },
        { "value": "Avatar (6).jpg", "label": "Avatar (6)", "image": "/Avatar/Avatar (6).jpg" },
        { "value": "Avatar (7).jpg", "label": "Avatar (7)", "image": "/Avatar/Avatar (7).jpg" },
        { "value": "Avatar (8).jpg", "label": "Avatar (8)", "image": "/Avatar/Avatar (8).jpg" },
        { "value": "Avatar (9).jpg", "label": "Avatar (9)", "image": "/Avatar/Avatar (9).jpg" },
        { "value": "Avatar (10).jpg", "label": "Avatar (10)", "image": "/Avatar/Avatar (10).jpg" },
        { "value": "Avatar (11).jpg", "label": "Avatar (11)", "image": "/Avatar/Avatar (11).jpg" },
        { "value": "Avatar (12).jpg", "label": "Avatar (12)", "image": "/Avatar/Avatar (12).jpg" },
        { "value": "Avatar (13).jpg", "label": "Avatar (13)", "image": "/Avatar/Avatar (13).jpg" },
        { "value": "Avatar (14).jpg", "label": "Avatar (14)", "image": "/Avatar/Avatar (14).jpg" },
        { "value": "Avatar (15).jpg", "label": "Avatar (15)", "image": "/Avatar/Avatar (15).jpg" },
        { "value": "Avatar (16).jpg", "label": "Avatar (16)", "image": "/Avatar/Avatar (16).jpg" },
        { "value": "Avatar (17).jpg", "label": "Avatar (17)", "image": "/Avatar/Avatar (17).jpg" },
        { "value": "Avatar (18).jpg", "label": "Avatar (18)", "image": "/Avatar/Avatar (18).jpg" },
        { "value": "Avatar (19).jpg", "label": "Avatar (19)", "image": "/Avatar/Avatar (19).jpg" },
        { "value": "Avatar (20).jpg", "label": "Avatar (20)", "image": "/Avatar/Avatar (20).jpg" },
        { "value": "Avatar (21).jpg", "label": "Avatar (21)", "image": "/Avatar/Avatar (21).jpg" },
        { "value": "Avatar (22).jpg", "label": "Avatar (22)", "image": "/Avatar/Avatar (22).jpg" },
        { "value": "Avatar (23).jpg", "label": "Avatar (23)", "image": "/Avatar/Avatar (23).jpg" },
        { "value": "Avatar (24).jpg", "label": "Avatar (24)", "image": "/Avatar/Avatar (24).jpg" },
        { "value": "Avatar (25).jpg", "label": "Avatar (25)", "image": "/Avatar/Avatar (25).jpg" },
        { "value": "Avatar (26).jpg", "label": "Avatar (26)", "image": "/Avatar/Avatar (26).jpg" },
        { "value": "Avatar (27).jpg", "label": "Avatar (27)", "image": "/Avatar/Avatar (27).jpg" },
        { "value": "Avatar (28).jpg", "label": "Avatar (28)", "image": "/Avatar/Avatar (28).jpg" },
        { "value": "Avatar (29).jpg", "label": "Avatar (29)", "image": "/Avatar/Avatar (29).jpg" },
        { "value": "Avatar (30).jpg", "label": "Avatar (30)", "image": "/Avatar/Avatar (30).jpg" }
    ]
;

    const formatOptionLabel = ({ value, label, image }) => (
        <div className='flex items-center '>
            <img className='w-8 rounded-full' src={image} alt={label} style={{ marginRight: '10px' }} />
            {label}
        </div>
    );

    return (
        <>
            <div className="flex flex-col h-screen p-16  ">

                <Nav />

                <div className="flex flex-col items-center justify-center px-4 ">
                    <div className="flex mt-10">
                        {/* <img src="logo.png" alt="" className='h-14 w-14 mr-7' /> */}
                        <div className="text-2xl font-bold"> Create User</div>

                    </div>
                    <div className="xl:mx-auto xl:w-[352px] xl:max-w-sm 2xl:max-w-md">

                        <form action="#" method="POST" className="mt-8" >
                            <div className="space-y-5">
                                <div className="text-red-500">
                                    {errors}
                                </div>
                                <div>
                                    <div className="mt-1">
                                        <input
                                            className="flex h-10 w-full rounded border border-[#0575e6]  bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                            type="text"
                                            placeholder="Username"
                                            value={username}
                                            onChange={(e) => setusername(e.target.value)}
                                        ></input>
                                    </div>
                                </div>
                                <div>
                                    <div className="mt-1">
                                        <input
                                            className="flex h-10 w-full rounded border border-[#0575e6]  bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                            type="text"
                                            placeholder="Name"
                                            value={name}
                                            onChange={(e) => setname(e.target.value)}
                                        ></input>
                                    </div>
                                </div>
                                <div>
                                    <div className="mt-1">
                                        <input
                                            className="flex h-10 w-full rounded border border-[#0575e6]  bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                            type="text"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setemail(e.target.value)}
                                        ></input>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        {/* <label htmlFor="password" className="text-base font-medium text-gray-900">
                                            {' '}
                                            Password{' '}
                                        </label> */}
                                    </div>
                                    <div className="mt-1">
                                        <input
                                            className="flex h-10 w-full rounded border border-[#0575e6] bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setpassword(e.target.value)}
                                        ></input>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        {/* <label htmlFor="password" className="text-base font-medium text-gray-900">
                                            {' '}
                                            Confirm Password{' '}
                                        </label> */}
                                    </div>
                                    <div className="mt-1">
                                        <input
                                            className="flex h-10 w-full rounded border border-[#0575e6] bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                            type="password"
                                            placeholder="Confirm Password"
                                            value={confirmPassword}
                                            onChange={(e) => setconfirmPassword(e.target.value)}
                                        ></input>
                                    </div>
                                </div>
                                <Select
                                    className="basic-multi-select rounded z-10 border-2 border-[#0575e6] my-3 "
                                    options={countries}
                                    formatOptionLabel={formatOptionLabel}
                                    isSearchable={false}
                                    placeholder="Select Avatar"
                                    onChange={(e)=>setAvatar(e.value)}
                                />
                                <div className='w-full'>

                                    <select
                                        className="mt-2 flex h-10 w-full rounded border-2 border-[#0575e6] bg-transparent px-5 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                                        onChange={(e) => settype(e.target.value)}
                                    >
                                        <option className='hidden' selected>User Type</option>
                                        <option value="user">
                                            User
                                        </option>
                                        <option value="admin">
                                            Admin
                                        </option>

                                    </select>
                                </div>
                                <div className='flex w-full items-center justify-center pb-96'>
                                    <button
                                        type="button"
                                        onClick={createUser}
                                        className="inline-flex w-1/2 items-center justify-center rounded bg-[#0575e6]  py-2.5 font-semibold leading-7 text-white hover:bg-black/80"

                                    >
                                        Create Account
                                    </button>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>

            </div>
        </>
    )
}
