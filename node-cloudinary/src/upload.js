const cloudinary = require('cloudinary').v2;

function configureCloudinaryFromEnv() {
  // If CLOUDINARY_URL is present, cloudinary.v2 will pick it up automatically.
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;
  if (CLOUDINARY_CLOUD_NAME && CLOUDINARY_API_KEY && CLOUDINARY_API_SECRET) {
    cloudinary.config({
      cloud_name: CLOUDINARY_CLOUD_NAME,
      api_key: CLOUDINARY_API_KEY,
      api_secret: CLOUDINARY_API_SECRET,
    });
  }
}

function uploadBuffer(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    // ensure cloudinary is configured
    const conf = cloudinary.config();
    if (!conf || !conf.cloud_name) {
      return reject(
        new Error(
          'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET or CLOUDINARY_URL.'
        )
      );
    }

    // default to auto resource type so images/videos/files work
    const opts = Object.assign({ resource_type: 'auto' }, options || {});

    const stream = cloudinary.uploader.upload_stream(opts, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });

    // Pipe the buffer into the upload stream
    const { PassThrough } = require('stream');
    const bufferStream = new PassThrough();
    bufferStream.end(buffer);
    bufferStream.pipe(stream);
  });
}

module.exports = { configureCloudinaryFromEnv, uploadBuffer };
