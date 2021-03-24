import boto3
from sklearn import preprocessing
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
import pandas as pd
import pickle

# Read CSV file
all_col = ['Heart rate', 'Acceleration', 'Temperature', 'Behavior'] 
features = ['Heart rate', 'Acceleration', 'Temperature']
ds = pd.read_csv("behavior.csv", header=None, names=all_col)

#Process label encoder to change categorical feature to numerical feature
LabEnc = preprocessing.LabelEncoder()
LabEnc.fit(ds['Behavior'])
X= ds[features]
Y= ds['Behavior']

#80/20 train test split
X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2)

#Train the model with built in decision tree algorithm in sklearn
clf = DecisionTreeClassifier(criterion="entropy")
clf = clf.fit(X_train, Y_train)
model = pickle.dumps(clf)

s3 = boto3.client('s3') 
response = s3.put_object(
    Bucket='behavior-model-bucket',
    Body=model,
    Key='behavior-model'
    )
