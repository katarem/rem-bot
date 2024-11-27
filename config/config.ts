import 'dotenv/config';
import * as env from 'env-var';

export const config = {
    API_TOKEN: env.get('API_TOKEN').required().asString(),
    CLIENT_ID: env.get('CLIENT_ID').required().asString(),
    DB_PATH: env.get('DB_PATH').required().asString()
}