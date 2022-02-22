const amqp = require('amqplib');

const rabbitUser = process.env.RABBITMQ_USER;
const rabbitPassword = process.env.RABBITMQ_PASSWORD;
const rabbitHost = process.env.RABBITMQ_HOST;

const Producer = {
  sendMessage: async (queue, message) => {
    const connection = await amqp.connect(`amqp://${rabbitUser}:${rabbitPassword}@${rabbitHost}`);
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, {
      durable: true,
    });

    await channel.sendToQueue(queue, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

module.exports = Producer;
