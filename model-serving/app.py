from flask import Flask, request, jsonify
import mlflow.sklearn
import pandas as pd
import mlflow
import os
from flask_cors import CORS
import logging
import joblib
import pymongo
from dotenv import load_dotenv
import os

load_dotenv()

# Connection URI
# uri = 'mongodb://documentdb:Minhnhat123@127.0.0.1:11111/?directConnection=true&tls=true&tlsAllowInvalidHostnames=true&tlsCAFile=global-bundle.pem'
# uri = 'mongodb+srv://admin:Minhnhat123@hust.gfy8kif.mongodb.net/'
uri = os.environ.get('MONGO_URI')
client = pymongo.MongoClient(uri, retryWrites=False)

# Access a database
db = client['feature']
collection = db['project']

app = Flask(__name__)
CORS(app)
# handler = logging.StreamHandler()
# handler.setLevel(logging.DEBUG)
# app.logger.addHandler(handler)

logging.basicConfig(level=logging.DEBUG)
# Load the ML model from MLflow and set the tracking URI
# os.environ['MLFLOW_TRACKING_USERNAME'] = 'admin'
# os.environ['MLFLOW_TRACKING_PASSWORD'] = '142857'

mlflow_api_url = os.environ.get('MLFLOW_URI')
mlflow.set_tracking_uri(mlflow_api_url)

experiment_name = "real_estate"
experiment_id = mlflow.get_experiment_by_name(experiment_name).experiment_id

def create_run_folder(model_folder, run_id):
    # Check if the 'model' folder exists
    if not os.path.exists(model_folder):
        os.makedirs(model_folder)  # Create the 'model' folder if it doesn't exist

    # Create the 'run_id' folder inside the 'model' folder
    run_folder = os.path.join(model_folder, run_id)
    if not os.path.exists(run_folder):
        os.makedirs(run_folder)

model = None
run_id = None
def check_for_new_model():
    global model, run_id
    if model is not None:
        print(model.feature_importances_)
    print(run_id)
    
    list_run = mlflow.search_runs(experiment_ids=experiment_id)

    list_run.sort_values('start_time', ascending=False, inplace=True)
    run_id = list_run.iloc[0]['run_id']
    model_local_path = './model/' + run_id + '/model.pkl'

    if os.path.exists(model_local_path):
        model = joblib.load(model_local_path)
    else:
        create_run_folder('./model/', run_id)
        mlflow_model_path = 'runs:/' + run_id + '/model'
        model = mlflow.sklearn.load_model(mlflow_model_path)
        joblib.dump(model, model_local_path)
        
    print(model.feature_importances_)
    print(run_id)
# # Get the latest run ID for the experiment
# list_run = mlflow.search_runs(experiment_ids=experiment_id)

# list_run.sort_values('start_time', ascending=False, inplace=True)
# run_id = list_run.iloc[0]['run_id']
# model_local_path = './model/' + run_id + '/model.pkl'

# if os.path.exists(model_local_path):
#     model = joblib.load(model_local_path)
# else:
#     create_run_folder('./model/', run_id)
#     mlflow_model_path = 'runs:/' + run_id + '/model'
#     model = mlflow.sklearn.load_model(mlflow_model_path)
#     joblib.dump(model, model_local_path)
check_for_new_model()
@app.route('/update', methods=['GET'])
def update():
    try:
        check_for_new_model()
        return jsonify({'result': 'done'})
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    

@app.route('/get_all_projects', methods=['GET'])
def get_all_projects():
    print(model.feature_importances_)
    try:
        projects = list(collection.find({'run_id': run_id}, {'_id': 0, 'name': 1, 'project_id': 1, 'loc': 1, 'run_id': 1}))
        return jsonify(projects)
    except Exception as e: 
        return jsonify({'error': str(e)}), 400

@app.route('/predict', methods=['POST'])
def predict():
    try:
        print(model.feature_importances_)
        print('begin')
        # Get the input data from the request
        project_id = int(request.json['project_id'])
        square = float(request.json['square'])
        n_bedrooms = float(request.json['n_bedrooms'])
        document = collection.find_one({'project_id': project_id, 'run_id': run_id})
        print(document)
        # Convert the input data to a DataFrame
        if document is None:
            return jsonify({'error': 'Project not found'})

        features = document['feature']
        features['square'] = square
        features['n_bedrooms'] = n_bedrooms
        features['square_change'] = square - features['avg_square']
        features_name = [
            'avg_square', 
            # 'n_news', 
            'max_square', 
            # 'min_square',
            'primary_highway_500', 'primary_highway_1000', 'primary_highway_3000',
            'secondary_highway_500', 'secondary_highway_1000',
            'secondary_highway_3000', 'tertiary_highway_500',
            'tertiary_highway_1000', 'tertiary_highway_3000',
            'residential_highway_500', 'residential_highway_1000',
            'residential_highway_3000', 'bus_stop_500', 'bus_stop_1000',
            'bus_stop_3000', 'supermarket_500', 'supermarket_1000',
            'supermarket_3000', 'mall_500', 'mall_1000', 'mall_3000',
            'hospital_500', 'hospital_1000', 'hospital_3000', 'college_500',
            'college_1000', 'college_3000', 'school_500', 'school_1000',
            'school_3000', 'university_500', 'university_1000', 'university_3000',
            'distance_to_center', 'longitude', 'latitude',
            'pop_density', 'commune_encode', 'district_encode', 'square',
            'square_change',
            'n_bedrooms',
        ]
        input = pd.DataFrame([features])
        input = input[features_name]
        print(input)
        predictions = model.predict(input)
        print(predictions)
        res = {'predictions': predictions[0]}
        return jsonify(res)
    
        # return jsonify({'predictions': predictions.tolist()})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=5001, debug=False, use_reloader=False)
