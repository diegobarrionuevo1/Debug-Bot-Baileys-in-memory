import bot from "@bot-whatsapp/bot";
import { delay } from "@whiskeysockets/baileys";

const inactividad = parseInt(process.env.GENERIC_INACTIVITY);

export const serverError = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAction(async (ctx, { provider, endFlow }) => {
        await delay(2000)
        return endFlow(`Estimado(a) ${ctx.pushName}, ocurrio un error en el servidor. Por favor intentelo de nuevo en unos instantes! 😊`)
    })
export const flujoFinal = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAction(
        async (ctx, { endFlow, state }) => {
            state.clear()
            return endFlow(`Estimado(a) ${ctx.pushName}, te informamos que has sido desconectado del asistente debido a su inactividad. Puede volver a iniciar cuando guste! 😊`);
        }
    )

export const flowUsuario = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAction(async (ctx, { flowDynamic, provider, endFlow , gotoFlow }) => {
        try {
            const confirmar = {
                data: {
                    estado: '3'
                }
            }
            if (confirmar === 500) {
                return gotoFlow(serverError)
            }
            if (confirmar.data.estado === "3") {
                console.log("esta bloqueado");
                return endFlow()
            }
            if (confirmar.data) {
                await delay(2000)
                await flowDynamic(["Usted ya se encuentra registrado! si no recuerda su usuario o contraseña, por favor dirijase a: 🍀🤖...",
                    "-Menu Principal",
                    "-Seccione la opcion 4",
                    "-Finalmente seleccione la opcion 1"])
                console.log("ya se encuentra registrado");
                return endFlow()
            }
        } catch (error) {
            console.error(error)
        }
        await delay(2000)
        await flowDynamic("⏳ por favor solo espere a que el asistente responda 🍀🤖...")
    })
    .addAction(async (ctx, { flowDynamic, provider }) => {
        await delay(2000)
        await flowDynamic("🌟 Para comenzar, necesitaré algunos detallitos sobre ti..."
        )
    })
    .addAction(async (ctx, { flowDynamic, provider }) => {

        await flowDynamic("Por favor, escribe *únicamente* tu *primer nombre*: ✏️");

    })
    .addAction(
        { capture: true, idle: inactividad }
        , async (ctx, { fallBack, gotoFlow, flowDynamic, state, provider }) => {
            if (ctx?.idleFallBack) {
                console.log("fallBack");
                return gotoFlow(flujoFinal)
            }
            let nombre = ctx.body.trim()
            // Verifica si el nombre está vacío o contiene espacios
            if (!nombre || nombre.includes(' ')) {
                await flowDynamic("Ops, parece que hubo un error. 🤔 Asegúrate de escribir solamente tu primer nombre, por favor.");
                return fallBack();
            } else {
                await state.update({ name: `${ctx.body}` });

                await flowDynamic("¡Magnífico, ${nombre}! Sigamos con el siguiente paso. 🚀");

                return gotoFlow(apellido);
            }
        }
    )
export const apellido = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAction(async (ctx, { flowDynamic, provider }) => {
        await flowDynamic("Ahora, por favor escribe tu *apellido*: 📜");
    })
    .addAction(
        { capture: true, idle: inactividad },
        async (ctx, { state, fallBack, gotoFlow, flowDynamic, provider }) => {

            if (ctx?.idleFallBack) {
                console.log("fallBack");
                return gotoFlow(flujoFinal)
            }
            const apellido = ctx.body.trim(); // Obtén el apellido del usuario
            if (!apellido || apellido.includes(' ')) {

                await flowDynamic("Oh no, parece que hubo un error. 🙁 Asegúrate de escribir solo tu apellido, por favor.");

                return fallBack();
            } else {
                await state.update({ lastname: `${ctx.body}` });

                return gotoFlow(creandoUsuario);
            }
        }
    )
export const creandoUsuario = bot
    .addKeyword(bot.EVENTS.ACTION)
    .addAnswer("⏳",
        { delay: 1000 })
    .addAction(
        async (ctx, { state, flowDynamic, endFlow, provider }) => {
            let currentState = state.getMyState();
            //limpiamos
            state.clear();
            // creamos el nuevo usuario en base de datos (simulacion de base de datos)
            let newUser = {
                telefono: ctx.from,
                nombre: currentState.name,
                apellido: currentState.lastname
            }
            if (newUser) {
                
                await flowDynamic("¡Perfecto! 🌈 El usuario estará listo en un momento. Espera pacientemente a la respuesta del operador 🕑");

                return endFlow();
            } else {

                await flowDynamic("¡Vaya! 😟 Tu solicitud no pudo ser creada, por favor inténtalo de nuevo.");

                return endFlow();
            }
        }
    );