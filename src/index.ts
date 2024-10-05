import { APIGatewayProxyHandler } from 'aws-lambda';
import { Output, makeResponse } from './response';
import * as AWS from 'aws-sdk';
import * as bcrypt from 'bcrypt';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event): Promise<Output> => {
    if(!event.body) {
        return makeResponse(400, { message: 'Missing params' });
    }

    const { cpf, password } = JSON.parse(event.body);

    if(!cpf || !password) {
        return makeResponse(400, { message: 'Required fields: [cpf, password]'});
    }

    try {
        const params: AWS.DynamoDB.DocumentClient.GetItemInput = {
            TableName: process.env.TABLE_USERS as string,
            Key: {
                cpf
            }
        };

        const data = await dynamodb.get(params).promise();

        if(data.Item) {
            const isValidPassword = await bcrypt.compare(password, data.Item?.password);
            
            if(isValidPassword) {
                return makeResponse(200, { userId: data.Item.id });
            }
        }
        
        return makeResponse(401, { message: 'Unauthorized' });

    } catch (error) {
        console.log('Error', error);
        return makeResponse(500, { Error: 'Internal server error' });
    }
};