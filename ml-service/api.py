# OvenZa Crust - AI Sales Prediction API

# imports

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
import os
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)

# Paths
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH  = os.path.join(BASE_DIR, 'models', 'category_daily_models_v2.pkl')
DATASET_PATH= os.path.join(BASE_DIR, 'models', 'current_dataset.csv')

VALID_CATEGORIES  = {'Chicken', 'Classic', 'Supreme', 'Veggie'}
MAX_FORECAST_DAYS = 14

# Load models at startup
def load_models():
    with open(MODEL_PATH, 'rb') as f:
        store = pickle.load(f)
    return store

store            = load_models()
category_models  = store['category_models']
global_model     = store['global_model']
category_evals   = store['category_evals']
global_eval      = store['global_eval']
last_train_date  = pd.to_datetime(store['last_training_date'])

print(f'✅ Models loaded. Last training date: {last_train_date.date()}')
print(f'   Categories: {list(category_models.keys())}')


# Parse mixed date formats
def parse_date(s):
    s = str(s).strip()
    for fmt in ('%m/%d/%Y', '%d-%m-%Y', '%d/%m/%Y', '%Y-%m-%d'):
        try: return pd.to_datetime(s, format=fmt)
        except ValueError: continue
    return pd.NaT


# Predict a single day N
def predict_day_n(n):
    """
    Predict pizza quantity for day N (1–14) after training data ends.
    Returns a dict with date, day name, per-category predictions, and total.
    """
    target_dt = last_train_date + pd.to_timedelta(n, unit='D')
    result = {
        'day_number'  : n,
        'date'        : target_dt.strftime('%Y-%m-%d'),
        'date_pretty' : target_dt.strftime('%d %B %Y'),
        'day_name'    : target_dt.strftime('%A'),
        'categories'  : {},
        'total'       : 0,
        'total_lower' : 0,
        'total_upper' : 0,
    }
    for cat, model in category_models.items():
        future_df = model.make_future_dataframe(periods=n, freq='D')
        forecast  = model.predict(future_df)
        row       = forecast[forecast['ds'] == target_dt].iloc[0]
        qty = max(0, int(round(row['yhat'])))
        lo  = max(0, int(round(row['yhat_lower'])))
        hi  = max(0, int(round(row['yhat_upper'])))
        result['categories'][cat] = {'predicted': qty, 'lower': lo, 'upper': hi}
        result['total']       += qty
        result['total_lower'] += lo
        result['total_upper'] += hi
    return result


# Endpoint 1 - GET / predict?day=5
# Returns prediction for a single day (1–14)

@app.route('/predict', methods=['GET'])
def predict():
    try:
        day = request.args.get('day', type=int)

        if day is None:
            return jsonify({'error': 'Missing ?day= parameter'}), 400
        if day < 1 or day > MAX_FORECAST_DAYS:
            return jsonify({'error': f'Day must be between 1 and {MAX_FORECAST_DAYS}'}), 400

        result = predict_day_n(day)
        return jsonify({'success': True, 'data': result})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Endpoint 2 - GET / forecast
# Returns predictions for all 14 days at once (for the chart)

@app.route('/forecast', methods=['GET'])
def forecast_all():
    try:
        results = []
        for n in range(1, MAX_FORECAST_DAYS + 1):
            results.append(predict_day_n(n))
        return jsonify({'success': True, 'data': results})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Endpoint 3 - GET / accuracy
# Returns current model accuracy for the dashboard

@app.route('/accuracy', methods=['GET'])
def accuracy():
    try:
        data = {
            'global': {
                'mape'    : global_eval['mape'],
                'accuracy': global_eval['accuracy'],
            },
            'categories': {
                cat: {
                    'mape'    : category_evals[cat]['mape'],
                    'accuracy': category_evals[cat]['accuracy'],
                    'mae'     : category_evals[cat]['mae'],
                    'rmse'    : category_evals[cat]['rmse'],
                }
                for cat in category_evals
            },
            'last_training_date': last_train_date.strftime('%Y-%m-%d'),
            'max_forecast_days' : MAX_FORECAST_DAYS,
        }
        return jsonify({'success': True, 'data': data})

    except Exception as e:
        return jsonify({'error': str(e)}), 500



# Endpoint 4 - GET / health
# Quick check that the API is running

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status'             : 'ok',
        'last_training_date' : last_train_date.strftime('%Y-%m-%d'),
        'categories'         : list(category_models.keys()),
        'max_forecast_days'  : MAX_FORECAST_DAYS,
    })


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False)
