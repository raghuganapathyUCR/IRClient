import React, { useState } from 'react';
import Head from "next/head";
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import DisplayRankedRecipes from '../../components/rankedDocs';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';


function ResultsPage({ data }) {
    let dat;
    dat = JSON.parse(data);

    const [searchText, setSearchText] = useState(dat.query);
    const [indexOption, setIndexOption] = useState(dat.indexOption)
    const [recipes, setRecipes] = React.useState(dat.rankedDocs)


    const router = useRouter();

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIndexOption(event.target.value);
    };


    const handleSubmit = async () => {
        if (searchText === "") {
            toast.error("Please enter some ingredients", {
                position: toast.POSITION.TOP_RIGHT
            });
            return;
        }
        else {
            let res;
            const mp: any = {}
            mp["searchText"] = searchText;
            mp["indexOption"] = indexOption;
            //do a get request to the backend with mp in the body
            const requestOptions: RequestInit = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mp),
            };

            await fetch('http://169.235.31.46:8888/search', requestOptions)
                .then(response => response.json())
                .then(data => {
                    res = data;
                    res["indexOption"] = indexOption;
                    console.log("Results: ", res)
                    router.replace({
                        query: { data: JSON.stringify(res) },
                    });

                    setRecipes(res.rankedDocs)
                    setSearchText(res.query)

                    // window.location.reload();
                })
                .catch(error => console.error(error));
        }
    }
    if (data) {
        return (
            <>
                <Head>
                    <title>ReciPy</title>
                    <meta name="description" content="Generated by create-t3-app" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>


                <main className="flex min-h-screen flex-col p-4 bg-gradient-to-b from-[#17131c] to-[#16183a]">
                    {/* <NavBar /> */}
                    <div className='flex flex-row justify-start space-x-2'>
                        <div className="container flex flex-row space-x-2 ">
                            <Link className="text-4xl text-white" href="/">
                                Reci<span className="text-[hsl(131,65%,63%)]">Py</span>
                            </Link>

                        </div>
                        <input
                            type="text"
                            className="block w-96  px-4 py-2 border text-black rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            placeholder="Search..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <button className="px-4 text-white bg-[hsl(131,65%,63%)] ml-1 border-l rounded " onClick={handleSubmit}>
                            Search
                        </button>
                        <div className="flex items-center mt-6">
                            <p className="mr-4 text-white">Index option:</p>
                            <div className="flex items-center">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        value="bert"
                                        checked={indexOption === "bert"}
                                        onChange={handleOptionChange}
                                        className="form-radio text-[hsl(131,65%,63%)]"
                                    />
                                    <span className="ml-2 text-white">BERT</span>
                                </label>
                                <label className="inline-flex items-center ml-6">
                                    <input
                                        type="radio"
                                        value="lucene"
                                        checked={indexOption === "lucene"}
                                        onChange={handleOptionChange}
                                        className="form-radio text-[hsl(131,65%,63%)]"
                                    />
                                    <span className="ml-2 text-white">Lucene</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className=" w-1/2 flex flex-col justify-between">

                    {recipes && recipes.map((recipe: any) => (
                        <>
                            <h5 className="text-lg text-blue-300">
                                <a href={recipe.url} target="_blank" rel="noopener noreferrer">{recipe.title}</a>
                            </h5>
                            <a className='text-xs  text-gray-500' href={recipe.url} target="_blank" rel="noopener noreferrer">{recipe.url}</a>
                            <div className='flex flex-row justify-between'>
                                {Object.keys(recipe.snippets.extras).map((key,i) => {
                                    return (
                                        <p className=" text-sm  text-gray-300" key={key}>
                                            {key}: {recipe.snippets.extras[key]}
                                        </p>
                                    );
                                })}
                            </div>
                            <p className=" text-gray-500">{recipe.snippets.content}</p>
                            <br>
                        </br>
                        </>
                    ))}
                    </div>
                    {/* <Footer /> */}
                </main>
                <ToastContainer />
            </>
        );
    }
    else {
        return (
            <>
                <main className="flex min-h-screen flex-col p3 bg-gradient-to-b from-[#17131c] to-[#16183a] text-white">
                    {/* <NavBar /> */}
                    Make a search first!
                    {/* <Footer /> */}
                </main>
            </>
        );


    }
}

export async function getServerSideProps({ query }) {
    const { data } = query;
    if (data === undefined) {
        return {
            props: {},
        };
    }
    return {
        props: {
            data,
        },
    };
}

export default ResultsPage;
