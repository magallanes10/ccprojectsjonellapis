const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.routes = {
    name: "Random TikTok Edit Preset",
    desc: "Random TikTok video based on preset edits",
    category: "Random Videos",
    usages: "/api/edit",
    method: "get",
};

module.exports.onAPI = async (req, res) => {
    try {
        const edits = [
            "Diether preset",
            "jj smooth",
            "presetxml",
            "preset alightmotion",
            "preset smooth jj",
            "AMV edits",
            "jedag jedug amv edit",
            "OE jj preset",
            "A2 JONELL?",
            "Jhay on OE jj preset",
            "A2 JJ PRESET SMOOTH JJ",
        ];
        const randomIndex = Math.floor(Math.random() * edits.length);
        const randomEdit = edits[randomIndex];

        const response = await axios.get(
            `https://ccexplorerapisjonell-harold-hutchinss-projects.vercel.app/api/tiktok/searchvideo?keywords=${encodeURIComponent(randomEdit)}`,
            {
                timeout: 5000,
            }
        );

        if (response.status !== 200) {
            throw new Error("Server responded with non-ok status");
        }

        const videos = response.data.data.videos;
        if (!videos || videos.length === 0) {
            return res.status(404).send("No videos found.");
        }

        const randomVideoIndex = Math.floor(Math.random() * videos.length);
        const videoData = videos[randomVideoIndex];

        const videoUrl = videoData.play;
        const videoResponse = await axios({
            method: "get",
            url: videoUrl,
            responseType: "stream",
            timeout: 5000,
        });

        const filePath = path.join(__dirname, "../");
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
        }
        const videoFilePath = path.join(filePath, "edit.mp4");
        const writer = fs.createWriteStream(videoFilePath);
        videoResponse.data.pipe(writer);

        writer.on("finish", () => {
            res.sendFile(videoFilePath, () => fs.unlinkSync(videoFilePath));
        });
    } catch (error) {
        if (error.code === "ECONNABORTED") {
            res.status(500).send("Failed to retrieve, please try again later.");
        } else {
            console.error("Error:", error.message);
            res.status(500).send("An error occurred while processing the request.");
        }
    }
};
