const { BlobServiceClient } = require('@azure/storage-blob');

module.exports = async function (context, req) {
  const page = req.body && req.body.page;
  if (!page) {
    context.res = {
      status: 400,
      body: 'page required'
    };
    return;
  }

  const connectionString = process.env.STORAGE_CONNECTION;
  const containerName = 'visits';
  const blobName = `${page}.json`;

  const blobService = BlobServiceClient.fromConnectionString(connectionString);
  const container = blobService.getContainerClient(containerName);
  await container.createIfNotExists();
  const blockBlob = container.getBlockBlobClient(blobName);

  let count = 0;
  try {
    const download = await blockBlob.download();
    const existing = await streamToBuffer(download.readableStreamBody);
    count = JSON.parse(existing.toString()).count || 0;
  } catch (err) {
    // novo blob
  }
  count += 1;
  await blockBlob.upload(JSON.stringify({ count }), Buffer.byteLength(JSON.stringify({ count })), { overwrite: true });
  context.res = { status: 200, body: { count } };
};

async function streamToBuffer(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on('data', (d) => chunks.push(d));
    readableStream.on('end', () => resolve(Buffer.concat(chunks)));
    readableStream.on('error', reject);
  });
}
