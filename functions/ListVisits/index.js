const { BlobServiceClient } = require('@azure/storage-blob');

module.exports = async function (context, req) {
  const connectionString = process.env.STORAGE_CONNECTION;
  const containerName = 'visits';
  const blobService = BlobServiceClient.fromConnectionString(connectionString);
  const container = blobService.getContainerClient(containerName);
  await container.createIfNotExists();

  const result = {};
  for await (const blob of container.listBlobsFlat()) {
    const blobClient = container.getBlobClient(blob.name);
    try {
      const download = await blobClient.download();
      const buffer = await streamToBuffer(download.readableStreamBody);
      const data = JSON.parse(buffer.toString());
      const page = blob.name.replace(/\.json$/, '');
      result[page] = data.count || 0;
    } catch (err) {
      context.log(`Erro ao ler blob ${blob.name}: ${err.message}`);
    }
  }

  context.res = { status: 200, body: result };
};

async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on('data', (d) => chunks.push(d));
    readableStream.on('end', () => resolve(Buffer.concat(chunks)));
    readableStream.on('error', reject);
  });
}
