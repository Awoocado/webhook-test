module.exports = {
    name: "prueba",
    description: "esto es una prueba",
    run: async(json, res) => {
        res.status(200).json({
            type: 4,
            data: {
                content: `Hola, tu nombre es ${json.data.options[0].value}`,
                flags: 64,
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        custom_id: "prueba",
                        style: 1,
                        label: "Presioname",
                    }]
                }]
            }
        });
    }
}