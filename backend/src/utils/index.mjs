import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
const client = new SESClient({ region: 'ap-southeast-2' });

export const handler = async (event) => {

  const body = JSON.parse(event?.Records?.[0]?.body)
  console.log('value => ', body, body?.message);

  const command = new SendEmailCommand({
    Destination: {
      ToAddresses: ['skcreations0110@gmail.com'],
    },
    Message: {
      Subject: {
        Data: 'Test Email from Lambda (SES v3)',
      },
      Body: {
        Text: {
          Data: 'This is a test email sent via SES v3!',
        },
      },
    },
    Source: 'skcreations0110@gmail.com',
  });

  try {
    const data = await client.send(command);
    console.log('Success', data);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent', data }),
    };
  } catch (err) {
    console.error('Error', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending email', error: err.message }),
    };
  }
};