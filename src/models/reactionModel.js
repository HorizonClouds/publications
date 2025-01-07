import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // TODO: Preguntar cómo se llamará 'User'
        required: [true, 'No puede realizarse una reacción sin usuario.']
    },
    publicacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Publication'
    },
    comentario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    reaccion: {
        type: String,
        enum: {
            values: ["LIKE", "LOVE", "DISLIKE"],
            message: '{VALUE} no es una reacción válida'
        }
    },
    // Cuando se consuma por Notification y sea puesto a TRUE, 
    // cambiará la fecha del atributo "modificado" para saber cuándo se vio.
    visto: {
        type: Boolean,
        default: false
    }
}, 
{ 
    timestamps: {
        createdAt: "creado",
        updatedAt: "modificado"
    }
});

// Validador para que no pueda ser una reacción de comentario y publicación a la vez
schema.pre('validate', function(next){
    if(this.comentario && this.publicacion) return next(
        new Error('Reacción vinculada a comentario y publicación a la vez')
    );
    if(!this.comentario && !this.publicacion) return next(
        new Error('No puede realizarse una reacción desvinculada')
    );
    
    next();
});

schema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

export default mongoose.model('Reaction', schema);