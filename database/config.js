import mongoose from "mongoose";

export const dbMongoConnection = async() => {
    try {
        await mongoose.connect( process.env.DB_CONNECTION );
        console.log('Database Connected :)');
    } catch (error) {
        console.log(error);
        throw new Error('No se pudo iniciar la conexión a la DB');
    }
};