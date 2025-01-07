import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    // id (id_publicacion) -> _id
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // TODO: Preguntar cómo se llamará 'User',
        //required
    },
    titulo: {
        type: String,
        required: [true, 'Por favor, incluya el título de la publicación.'],
    }, 
    contenido: {
        type: String,
        required: [true, 'Por favor, incluya el cuerpo de la publicación.'],
    }, 
    // fecha_publicacion -> createdAt,
    // fecha_modificacion -> updatedAt
    ubicacion: {
        type: String,
        enum: {
            values: ["AFRICA", "AMERICA", "ASIA", "EUROPE", "OCEANIA"],
            message: '{VALUE} no es una ubicación válida'
        }
    }, 
    categoria: {
        type: String,
        enum: {
            values: ["ADVENTURE", "CITY", "CULTURE", "NATURE", "RELAX"],
            message: '{VALUE} no es una categoría válida'
        }
    },
    imagenes: [
        {   
            type: String
        }
    ]
}, 
{ 
    timestamps: {
        createdAt: "creado",
        updatedAt: "modificado"
    } 
});

schema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});


export default mongoose.model('Publication', schema);



