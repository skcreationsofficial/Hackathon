import { config } from 'dotenv';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

config();

export default async function sendEmail (email: string, message: string) {

    const accessKeyId = process.env.AWS_ACCESS_KEY!;
    const secretAccessKey = process.env.AWS_SECRET_KEY!;
    const region = process.env.AWS_REGION!;
    
    const sqs = new SQSClient({
        region: region,
        credentials: {
            accessKeyId: accessKeyId,
            secretAccessKey: secretAccessKey,
        },
    });

    const jsonStringifiedData = JSON.stringify({email: email, message: message})

    const command = new SendMessageCommand({
        QueueUrl: process.env.SQS_QUEUE_URL,
        MessageBody: jsonStringifiedData,
    });

    const response = await sqs.send(command);

    console.log('send mail response => ', response, jsonStringifiedData)

    return response
    
}