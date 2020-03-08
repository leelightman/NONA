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

# 0.4 - 71.94%
# 0.6 - 73.23%
predictionWeight = 0.75

count = 0
total = 0


def predict(row):
    predictX = row[['height', 'weight', 'size']].values.reshape(1, 3)
    prediction = LM.predict(predictX) * 2
    return prediction


def classify(row):
    classification = 0
    if (row['prediction'] > predictionWeight):
        classification = 1  # Too Big
    elif (row['prediction'] < -predictionWeight):
        classification = -1  # Too Small
    else:
        classification = 0  # Fits
    return classification


def testAnalysis(row):
    success = 0
    if (row['classification'] == row['fit']):
        success = 1
        # print('Success')
    else:
        success = 0
        # print('Failure')
    return success


LM = LinearRegression()
model = LM.fit(X, Y)

print(df)
df['prediction'] = df.apply(lambda row: predict(row), axis=1)
df['classification'] = df.apply(lambda row: classify(row), axis=1)
df['success'] = df.apply(lambda row: testAnalysis(row), axis=1)
print(df)
print(df['success'].mean())
