try:
    import unzip_requirements
except ImportError:
    pass

import json
import boto3
import pickle
import numpy as np

s3 = boto3.client('s3')


def handler(event, context):
    print(event)
    body = event['body']
    temp_file_path = '/tmp/' + "behavior-model"
    input = json.loads(body)['input']
    input = np.reshape(input, (1, -1))
    print("Input: ", input)
    s3.download_file(
        Bucket='behavior-model-bucket',
        Key='behavior-model',
        Filename=temp_file_path
    )
    with open(temp_file_path, 'rb') as f:
        model = pickle.load(f)
    prediction = model.predict(input)[0]
    print(prediction)
    return {
        "statusCode": 200,
        "body": json.dumps({
            "prediction": str(prediction)
        })
    }
