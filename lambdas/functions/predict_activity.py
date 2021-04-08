try:
    import unzip_requirements
except ImportError:
    pass

import json
import boto3
import pickle
import numpy as np
from tensorflow import keras
from PIL import Image, ImageOps

s3 = boto3.client('s3')


def handler(event, context):
    print(event)
    body = event['body']
    temp_file_path = '/tmp/' + "behavior-model"
    accel = json.loads(body)['accel']
    image_name = json.loads(body)['image']
    accel = np.reshape(accel, (1, -1))
    print("Input: ", accel)
    print("Image: ", image_name)

    res = s3.get_object(Bucket='behavior-model-bucket', Key='image-model.json')
    model = res['Body'].read().decode('utf-8')
    print('Model: ', model)
    image_path = '/tmp/' + image_name
    s3.download_file(
        Bucket='behavior-model-bucket',
        Key=image_name,
        Filename=image_path
    )
# Image handling
    og_image = Image.open(image_path)

# resize image to width of 300 with proper ratio 300 x 168
    basewidth = 300
    wpercent = (basewidth / float(og_image.size[0]))
    hsize = int((float(og_image.size[1]) * float(wpercent)))
    og_img = og_image.resize((basewidth, hsize), Image.ANTIALIAS)

# applying grayscale method
    gray_image = ImageOps.grayscale(og_img)
# convert mxn pixels (rn 1920 x 1080) to a 1d array of grayscale values size mn
    pixel_values = np.array(list(gray_image.getdata()))
    print("Pixel_values: ", pixel_values)
    image_model = keras.models.model_from_json(model)
    poach_arr = image_model.predict(pixel_values)[0]
    print("Poach_arr", poach_arr)
    poach = 'false'
    if (poach_arr[1] > poach_arr[0]):
        poach = 'true'

    print("Poach: ", poach)
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
            "poach": str(poach)
        })
    }
