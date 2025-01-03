const express = require('express');
const axios = require('axios');

module.exports.routes = {
    name: "Instagram Stalker",
    desc: "Stalk Instagram profile details using the username.",
    category: "Tools",
    usages: "/api/insta/stalk",
    query: "?ig=",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    const ig = req.query.ig;
    if (!ig) return res.json({ error: 'Missing data to run the program' });

    const options = {
        method: 'GET',
        url: 'https://instagram210.p.rapidapi.com/ig_profile',
        params: { ig: ig },
        headers: {
            'X-RapidAPI-Key': 'a1195f61acmsh6a9dad0b9230160p12c85fjsnde352bd0fbcd',
            'X-RapidAPI-Host': 'instagram210.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        console.log(response.data);
        return res.json(response.data);
    } catch (error) {
        console.error(error);
        return res.json({ error: 'Error in the request to the Instagram API' });
    }
};
