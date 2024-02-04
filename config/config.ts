import 'dotenv/config';
import * as env from 'env-var';

export const Configuration = {
    API_TOKEN: env.get('API_TOKEN').asString(),
    CLIENT_ID: env.get('CLIENT_ID').asString()
}