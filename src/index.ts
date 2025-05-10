import express from "express";
import {setupApp} from "./setupApp";
import {SETTINGS} from "./core/settings/settings";
import {runDB} from "./db/mongoDb";

const bootstrap = async () =>{//cоздание приложения
    const app = express();
    setupApp(app);

//порт приложения
    const PORT = SETTINGS.PORT;

    await runDB(SETTINGS.MONGO_URL);

//запуск приложения
    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}`);
    })
    return app;
}

bootstrap();
