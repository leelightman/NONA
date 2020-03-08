import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

df = pd.read_json('./datasets/renttherunway_final_data.json', lines=True)

df = df[['height', 'weight', 'size', 'fit']]

# Drop Rows with Missing Values

df = df.dropna()
# Map Fit to Values
df['fit'] = df['fit'].map({'large': 1, 'small': -1, 'fit': 0})


def convertHeight(strHeight):
    strSplit = strHeight.split("'")
    feet = strSplit[0]
    inches = strSplit[1].split('"')[0]
    total = int(feet) * 12 + int(inches)
    return total


def convertWeight(strWeight):
    strWeight = strWeight[:-3]
    weight = int(strWeight)
    return weight


# Convert Height to Values
df['height'] = df['height'].apply(convertHeight)
df['weight'] = df['weight'].apply(convertWeight)

X = df[['height', 'weight', 'size']]
Y = df['fit']

predictionWeight = 0.5

count = 0
total = 0


def testPrediction(row):
    test = row[['height', 'weight', 'size']].values.reshape(1, 3)
    prediction = LM.predict(test) * 10
    if (prediction > predictionWeight):
        prediction = 1

    elif (prediction < -predictionWeight):
        prediction = -1
    else:
        prediction = 0

    if (prediction == row['fit']):
        prediction = 1
        # print('Success')
    else:
        prediction = 0
        # print('Failure')
    return prediction


LM = LinearRegression()
model = LM.fit(X, Y)

print(df)
df['predicted'] = df.apply(lambda row: testPrediction(row), axis=1)
print(df)
print(df['predicted'].mean())
