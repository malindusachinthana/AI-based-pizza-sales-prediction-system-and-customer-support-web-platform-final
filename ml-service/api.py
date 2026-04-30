# api.py — OvenZa Crust | AI Sales Prediction API
# ─────────────────────────────────────────────────
# Place this file in:  your-project/ml-service/api.py
# Run with         :  python api.py
# Runs on          :  http://localhost:5001
# ─────────────────────────────────────────────────

from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
import os
import io
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)  # allow React (localhost:3000) to call this API

# ── Paths ─────────────────────────────────────────────────────────
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH  = os.path.join(BASE_DIR, 'models', 'category_daily_models_v2.pkl')
DATASET_PATH= os.path.join(BASE_DIR, 'models', 'current_dataset.csv')

VALID_CATEGORIES  = {'Chicken', 'Classic', 'Supreme', 'Veggie'}
MAX_FORECAST_DAYS = 14

# ── Load models at startup ────────────────────────────────────────
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


# ── Helper: parse mixed date formats ─────────────────────────────
def parse_date(s):
    s = str(s).strip()
    for fmt in ('%m/%d/%Y', '%d-%m-%Y', '%d/%m/%Y', '%Y-%m-%d'):
        try: return pd.to_datetime(s, format=fmt)
        except ValueError: continue
    return pd.NaT


# ── Helper: predict a single day N ───────────────────────────────
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


# ═══════════════════════════════════════════════════════════════════
# ENDPOINT 1 — GET /predict?day=5
# Returns prediction for a single day (1–14)
# ═══════════════════════════════════════════════════════════════════
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


# ═══════════════════════════════════════════════════════════════════
# ENDPOINT 2 — GET /forecast
# Returns predictions for all 14 days at once (for the chart)
# ═══════════════════════════════════════════════════════════════════
@app.route('/forecast', methods=['GET'])
def forecast_all():
    try:
        results = []
        for n in range(1, MAX_FORECAST_DAYS + 1):
            results.append(predict_day_n(n))
        return jsonify({'success': True, 'data': results})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ═══════════════════════════════════════════════════════════════════
# ENDPOINT 3 — GET /accuracy
# Returns current model accuracy for the dashboard
# ═══════════════════════════════════════════════════════════════════
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


# ═══════════════════════════════════════════════════════════════════
# ENDPOINT 4 — POST /retrain
# Admin uploads a new CSV → appends to existing data → retrains
# ═══════════════════════════════════════════════════════════════════
@app.route('/retrain', methods=['POST'])
def retrain():
    global store, category_models, global_model
    global category_evals, global_eval, last_train_date

    try:
        # ── 1. Check file was uploaded ────────────────────────────
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded. Send CSV as multipart/form-data with key "file"'}), 400

        file     = request.files['file']
        filename = file.filename

        if not filename.endswith('.csv'):
            return jsonify({'error': 'Only .csv files are accepted'}), 400

        # ── 2. Read uploaded CSV ──────────────────────────────────
        new_raw = pd.read_csv(io.StringIO(file.read().decode('utf-8')))

        required = ['order_date', 'quantity', 'pizza_category']
        missing  = [c for c in required if c not in new_raw.columns]
        if missing:
            return jsonify({
                'error'   : f'Missing required columns: {missing}',
                'required': required,
                'found'   : list(new_raw.columns),
            }), 400

        # ── 3. Filter new data ────────────────────────────────────
        new_df = new_raw[required].copy()
        new_df['order_date'] = new_df['order_date'].apply(parse_date)
        new_df.dropna(subset=['order_date'], inplace=True)
        new_df['quantity'] = pd.to_numeric(new_df['quantity'], errors='coerce')
        new_df = new_df[new_df['quantity'] > 0]
        new_df = new_df[new_df['pizza_category'].isin(VALID_CATEGORIES)]
        new_df.sort_values('order_date', inplace=True)
        new_df.reset_index(drop=True, inplace=True)

        if len(new_df) == 0:
            return jsonify({'error': 'No valid rows found in uploaded CSV after filtering'}), 400

        # ── 4. Load existing dataset and append ───────────────────
        existing_df = pd.read_csv(DATASET_PATH)
        existing_df['order_date'] = existing_df['order_date'].apply(parse_date)

        combined = pd.concat([existing_df, new_df], ignore_index=True)
        combined.drop_duplicates(inplace=True)
        combined.sort_values('order_date', inplace=True)
        combined.reset_index(drop=True, inplace=True)

        # ── 5. Rebuild daily data and retrain ─────────────────────
        from prophet import Prophet
        from sklearn.metrics import mean_absolute_error, mean_squared_error

        CATEGORIES = sorted(VALID_CATEGORIES)
        TEST_DAYS  = 28

        def make_daily(subset):
            daily = subset.groupby('order_date')['quantity'].sum().reset_index()
            daily.columns = ['ds', 'y']
            daily['ds'] = pd.to_datetime(daily['ds'])
            daily.sort_values('ds', inplace=True)
            full = pd.date_range(daily['ds'].min(), daily['ds'].max(), freq='D')
            daily = daily.set_index('ds').reindex(full, fill_value=0).reset_index()
            daily.columns = ['ds', 'y']
            return daily

        def build_model():
            m = Prophet(
                yearly_seasonality      = False,
                weekly_seasonality      = True,
                daily_seasonality       = False,
                changepoint_prior_scale = 0.05,
                seasonality_prior_scale = 10,
                seasonality_mode        = 'additive',
                interval_width          = 0.95,
            )
            m.add_seasonality(name='monthly', period=30.5, fourier_order=3)
            return m

        def evaluate(daily_df, model):
            test   = daily_df.iloc[-TEST_DAYS:].reset_index(drop=True)
            future = model.make_future_dataframe(periods=TEST_DAYS, freq='D')
            fc     = model.predict(future)
            pred   = fc.tail(TEST_DAYS)['yhat'].clip(lower=0).values
            actual = test['y'].values
            mask   = actual > 0
            a, p   = actual[mask], pred[mask]
            mae    = mean_absolute_error(a, p)
            rmse   = np.sqrt(mean_squared_error(a, p))
            mape   = np.mean(np.abs((a - p) / a)) * 100
            return {'mae': round(mae,1), 'rmse': round(rmse,1),
                    'mape': round(mape,1), 'accuracy': round(100-mape,1)}

        new_cat_models = {}
        new_cat_evals  = {}

        for cat in CATEGORIES:
            daily = make_daily(combined[combined['pizza_category'] == cat])
            train = daily.iloc[:-TEST_DAYS].copy()
            m     = build_model()
            m.fit(train)
            ev    = evaluate(daily, m)
            final = build_model()
            final.fit(daily)
            new_cat_models[cat] = final
            new_cat_evals[cat]  = ev

        g_daily = make_daily(combined)
        g_train = g_daily.iloc[:-TEST_DAYS].copy()
        gm_eval = build_model(); gm_eval.fit(g_train)
        g_ev    = evaluate(g_daily, gm_eval)
        gm_fin  = build_model(); gm_fin.fit(g_daily)

        new_last_date = g_daily['ds'].max()

        # ── 6. Save new models + dataset ─────────────────────────
        new_store = {
            'category_models'   : new_cat_models,
            'global_model'      : gm_fin,
            'category_evals'    : new_cat_evals,
            'global_eval'       : g_ev,
            'last_training_date': new_last_date.strftime('%Y-%m-%d'),
            'max_forecast_days' : MAX_FORECAST_DAYS,
            'model_type'        : 'daily',
        }
        with open(MODEL_PATH, 'wb') as f:
            pickle.dump(new_store, f)

        combined['order_date'] = combined['order_date'].dt.strftime('%Y-%m-%d')
        combined.to_csv(DATASET_PATH, index=False)

        # ── 7. Reload models in memory ────────────────────────────
        store           = new_store
        category_models = new_cat_models
        global_model    = gm_fin
        category_evals  = new_cat_evals
        global_eval     = g_ev
        last_train_date = new_last_date

        return jsonify({
            'success': True,
            'message': 'Models retrained successfully',
            'report' : {
                'new_rows_added'      : len(new_df),
                'total_rows'          : len(combined),
                'new_last_train_date' : new_last_date.strftime('%Y-%m-%d'),
                'category_accuracy'   : {
                    cat: new_cat_evals[cat]['accuracy']
                    for cat in CATEGORIES
                },
                'global_accuracy': g_ev['accuracy'],
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ═══════════════════════════════════════════════════════════════════
# ENDPOINT 5 — GET /health
# Quick check that the API is running
# ═══════════════════════════════════════════════════════════════════
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
