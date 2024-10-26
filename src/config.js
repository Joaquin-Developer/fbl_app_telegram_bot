
const config = {
    FBL_APP_API: "http://127.0.0.1:8007",
    U_CUP_24_API: "http://127.0.0.1:8000/api/v1",
    DEFAULT_TELEGRAM_TOKEN: process.env["DEFAULT_TELEGRAM_TOKEN"] || "<insert_token>",
    ERR_MESSAGES: {
        CONSTANT_ERR_COMMAND: "Modo incorrecto de úso.\nEscribe /help para mas información.",
        INCORRECT_FASE_DATA: "Dato incorrecto! Debes proporcionar un nombre de fase valido. (8vos, 4tos, SemiFinal, 3er Puesto, Final)"
    }
}   

module.exports = config
