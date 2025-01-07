import mongoose from 'mongoose';

const schema = new mongoose.Schema(
    {
    // comentario_id, // Generado en DB
    publicacion_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Publication'
    }, 
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // TODO: Preguntar cómo se llamará 'usuario_id'
    }, 
    contenido_comentario: {
        type: String,
        required: [true, 'Por favor, incluya el cuerpo del comentario.'],
    }, 
    // fecha_comentario // Generado en DB
    }, 
    { 
    timestamps: {
        createdAt: "creado",
        updatedAt: "modificado"
    } 
    }
);

schema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});


export default mongoose.model('Comment', schema);