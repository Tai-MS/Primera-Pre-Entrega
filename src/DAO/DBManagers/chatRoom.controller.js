import messageModel from '../model/massages.model.js'
class ChatManager{
    /**
     * Description
     * @param {any} user
     * @param {any} message
     * @returns {any}
     */
    async updateDb(user, message){
        const newElement = new messageModel({
            user: user,
            message: message
        })
        return await newElement.save()
    }

    /**
     * Description
     * @returns {any}
     */
    async returnChat() {
        try {
            // Consulta todos los documentos de la colección de mensajes
            const messages = await messageModel.find({});
            
            // Mapea los mensajes para devolver un array con el nombre de usuario y el mensaje
            const formattedMessages = messages.map(message => ({
                user: message.user,
                message: message.message
            }));
            console.log(formattedMessages);
            // Devuelve los mensajes formateados
            return formattedMessages;
        } catch (error) {
            // Manejo de errores
            console.error('Error al obtener mensajes:', error);
            throw error;
        }
    }
    
}

const chatManager = new ChatManager

export default chatManager