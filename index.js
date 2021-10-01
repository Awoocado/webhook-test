require("dotenv").config();
const express = require('express');
const nacl = require('tweetnacl');
const fs = require('fs');

const app = express();
global.commands = new Map();

app.use(function (req, res, next) {

    let data = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk) {
        data += chunk;
    });
    req.on('end', function () {
        const sig = req.headers["x-signature-ed25519"];
        const time = req.headers["x-signature-timestamp"];

        if (!sig) return res.status(401).send('invalid request signature');
        if (!time) return res.status(401).send('invalid request signature');
        const isVerified = nacl.sign.detached.verify(
            Buffer.from(time + data),
            Buffer.from(sig, 'hex'),
            Buffer.from(process.env.PUBLIC_KEY, 'hex')
        );
        if (isVerified) {
            req.rawBody = data;
            next();
        }
        else res.status(401).send('invalid request signature');
    });
});

app.post("/", async (req, res) => {

    try {
        const json = JSON.parse(req.rawBody);
        console.log(json);
        if (json.type === 1) res.status(200).json({ type: 1 });
        else if (json.type === 2) {
            const comando = global.commands.get(json.data.name);
            if (!comando) return res.status(200).json({ type: 4, data: { content: "Este comando no existe" } });
            await comando.run(json, res);
        } else if (json.type === 3) {
            if (json.data.custom_id === "prueba") {
                res.status(200).json({
                    type: 7, data: {
                        embeds: [{ title: "Me presionaste!", description: "AAAAAAAAAAAAA" }], components: [{
                            type: 1,
                            components: [{
                                type: 2,
                                custom_id: "prueba",
                                style: 1,
                                label: "Presioname",
                                disabled: true
                            }]
                        }]
                    }
                })
            }
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

for (const file of fs.readdirSync("./comandos")) {
    if (file.endsWith(".js")) {
        const command = require(`./comandos/${file}`);
        global.commands.set(command.name, command);
    }
}

app.listen(80);