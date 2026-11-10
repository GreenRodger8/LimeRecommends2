module.exports = async (req, res) => {
    res.send({
        random: Math.random(),
    });
};
