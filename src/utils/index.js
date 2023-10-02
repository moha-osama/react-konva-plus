// $_SESSION['s3']['albumBucketName'] = "mogulvideo";
// $_SESSION['s3']['bucketRegion'] = "us-west-2";
// $_SESSION['s3']['IdentityPoolId'] = "us-west-2:78aae9fb-21b1-428e-8b4e-86e5b21de9b2";

import { Amplify, Auth, Storage } from "aws-amplify";
import { v4 } from "uuid";
import { uid } from "uid";

export const upload = (file, objJson, uploadedImages) => {
  Amplify.configure({
    Auth: {
      identityPoolId: "us-west-2:78aae9fb-21b1-428e-8b4e-86e5b21de9b2", //REQUIRED - Amazon Cognito Identity Pool ID
      region: "us-west-2", // REQUIRED - Amazon Cognito Region
    },
    Storage: {
      AWSS3: {
        bucket: "mogulvideo", //REQUIRED -  Amazon S3 bucket name
        region: "us-west-2", //OPTIONAL -  Amazon service region
      },
    },
  });

  const folderUid = v4();
  const shapesUid = uid(16);

  //
  Storage.put(`S3/mogulvideo/${folderUid}/${file.name}`, file, {
    progressCallback(progress) {
      console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
    },
  })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
  //
  Storage.put(`S3/mogulvideo/${folderUid}/shapes-${shapesUid}-json`, objJson, {
    progressCallback(progress) {
      console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
    },
  })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
  //

  uploadedImages.map((img, index) => {
    Storage.put(`S3/mogulvideo/${folderUid}/images/image-${index}`, img, {
      progressCallback(progress) {
        console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
      },
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  });

  //
  return {
    videoFileName: file.name,
    shapesUid,
    folderUid,
    totalUploadedImages: uploadedImages.length,
  };
};

export const download = async (fileKey) => {
  // Configure Amplify (you can put this configuration in a common place)
  Amplify.configure({
    Auth: {
      identityPoolId: "us-west-2:78aae9fb-21b1-428e-8b4e-86e5b21de9b2", // REQUIRED - Amazon Cognito Identity Pool ID
      region: "us-west-2", // REQUIRED - Amazon Cognito Region
    },
    Storage: {
      AWSS3: {
        bucket: "mogulvideo", // REQUIRED - Amazon S3 bucket name
        region: "us-west-2", // OPTIONAL - Amazon service region
      },
    },
  });

  const response = await Storage.get(fileKey);

  return response;
};
