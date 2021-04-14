import json
import boto3
import pickle
import numpy as np

s3 = boto3.client('s3')


def handler(event, context):
    """
    Lambda function that will download and use the uploaded activity prediction model from the S3 bucket
    Input must be 4 element array consisting of accelerometer values and heart rate
    Returns the predicted activity based on the inputs
    """
    print(event)
    body = event['body']
    temp_file_path = '/tmp/' + "behavior-model"
    accel = json.loads(body)['accel']
    accel = np.reshape(accel, (1, -1))
    print("Input: ", accel)

    s3.download_file(
        Bucket='behavior-model-bucket',
        Key='behavior-model',
        Filename=temp_file_path
    )
    with open(temp_file_path, 'rb') as f:
        activity_model = pickle.load(f)
    activity = activity_model.predict(accel)[0]
    print("Activity: ", activity)

    return {
        "statusCode": 200,
        "body": json.dumps({
            "activity": str(activity),
        })
    }
