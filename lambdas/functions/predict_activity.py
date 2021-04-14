import json
import boto3
import pickle
import numpy as np

s3 = boto3.client('s3')


def handler(event, context):
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
