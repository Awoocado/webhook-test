module.exports = {
    name: "help",
    description: "ayuda",
    run: async(json, res) => {
        const comandos = Array.from(global.commands.values());
        let str = '';
        for(const comando of commands) {
            str += `${comando[1].name}: ${comando[1].description}\n`
        }
        res.status(200).json({ type: 4, data: { embeds: [ { title: "Comando de ayuda", description: `Aqui encontrarás mis comandos:\n\n${str}`, color: 0xF0DA00, timestamp: new Date() } ] } })
    }
}