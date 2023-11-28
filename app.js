import bot from '@bot-whatsapp/bot'
import QRPortalWeb from '@bot-whatsapp/portal'
import BaileysProvider from '@bot-whatsapp/provider/baileys'
import MockAdapter from '@bot-whatsapp/database/mock'
import { flowUsuario, serverError, flujoFinal, apellido, creandoUsuario } from './flows/newUser.js'

const inactividad = 180000;

const flowMenu = bot
    .addKeyword(bot.EVENTS.WELCOME)
    .addAction(async (ctx, { flowDynamic}) => {
        await flowDynamic(["Elige una opción respondiendo con el *número* adecuado, por favor:",
            "*1*. Crear perfil de jugador",
            "*2*. opcion",
            "*3*. opcion",
            "*4*. opcion",
            "*5*. Cancelar"])
    })
    .addAction({ capture: true, idle: inactividad },
        async (ctx, { gotoFlow, endFlow}) => {
            if (ctx?.idleFallBack) {
                return gotoFlow(flujoFinal)
            }
            // Asumiendo que ctx.body contiene la respuesta del usuario
            const userResponse = parseInt(ctx.body, 10); // Parsea la respuesta del usuario a un número
            // Para opciones válidas, usamos una estructura switch para manejar cada opción individualmente
            switch (userResponse) {
                case 1:
                    return gotoFlow(flowUsuario);
                default:
                    return endFlow("solo disponible la opcion 1")
            }
        }
    );

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = bot.createFlow([flowMenu, flowUsuario,apellido,creandoUsuario, serverError, flujoFinal])
    const adapterProvider = bot.createProvider(BaileysProvider)

    bot.createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
